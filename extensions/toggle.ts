import { basename, dirname, relative } from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import {
	DefaultPackageManager,
	getAgentDir,
	SettingsManager,
} from "@earendil-works/pi-coding-agent";
import { Input, matchesKey, truncateToWidth } from "@earendil-works/pi-tui";

import {
	applyProcessSelection,
	buildDisabledBaseline,
	getProcessCache,
	groupResources,
	hasFolderRow,
	resourceKey,
	selectionState,
	selectedResourcePaths,
	setAllSelected,
	toggleSelection,
	type GlobalSettings,
	type ManagedResource,
	type ResourceGroup,
} from "./toggle-state.ts";

function same(left: unknown, right: unknown): boolean {
	return JSON.stringify(left) === JSON.stringify(right);
}

function safeText(value: string): string {
	return value.replace(/[\u0000-\u001f\u007f-\u009f]/g, "");
}

function label(resource: ManagedResource): string {
	const name = resource.type === "skill" ? basename(dirname(resource.path)) : basename(resource.path, ".md");
	return safeText(name);
}

export default async function toggleExtension(pi: ExtensionAPI) {
	const agentDir = getAgentDir();
	const cache = getProcessCache();
	const selection = cache.selection;
	let catalog: ManagedResource[] = [...cache.catalog];
	let baselineChanged = false;
	let normalizationQueued = false;

	function replaceSelection(next: ReadonlySet<string>) {
		selection.clear();
		for (const key of next) selection.add(key);
	}

	async function refreshCatalog(cwd: string): Promise<boolean> {
		const settings = SettingsManager.create(cwd, agentDir, { projectTrusted: false });
		const loadErrors = settings.drainErrors();
		if (loadErrors.length > 0) throw loadErrors[0].error;

		const packages = new DefaultPackageManager({ cwd, agentDir, settingsManager: settings });
		const resolved = await packages.resolve(async () => "skip");
		catalog = [
			...resolved.skills.map((resource) => ({ ...resource, type: "skill" as const })),
			...resolved.prompts.map((resource) => ({ ...resource, type: "prompt" as const })),
		]
			.filter((resource) => resource.metadata.scope === "user")
			.sort((left, right) =>
				`${left.type}\0${left.metadata.source}\0${left.path}`.localeCompare(
					`${right.type}\0${right.metadata.source}\0${right.path}`,
				),
			);

		const current = settings.getGlobalSettings();
		const next = buildDisabledBaseline(current as GlobalSettings, catalog, agentDir);
		const packagesChanged = !same(current.packages, next.packages);
		const skillsChanged = !same(current.skills ?? [], next.skills ?? []);
		const promptsChanged = !same(current.prompts ?? [], next.prompts ?? []);
		if (!packagesChanged && !skillsChanged && !promptsChanged) return false;

		if (packagesChanged) settings.setPackages(next.packages ?? []);
		if (skillsChanged) settings.setSkillPaths(next.skills ?? []);
		if (promptsChanged) settings.setPromptTemplatePaths(next.prompts ?? []);
		await settings.flush();
		const errors = settings.drainErrors();
		if (errors.length === 0) return true;

		if (packagesChanged) settings.setPackages(current.packages ?? []);
		if (skillsChanged) settings.setSkillPaths(current.skills ?? []);
		if (promptsChanged) settings.setPromptTemplatePaths(current.prompts ?? []);
		await settings.flush();
		const rollbackError = settings.drainErrors()[0]?.error;
		throw new Error(
			`Unable to normalize Pi resources: ${errors[0].error.message}` +
				(rollbackError ? `; rollback failed: ${rollbackError.message}` : ""),
		);
	}

	try {
		baselineChanged = await refreshCatalog(process.cwd());
	} catch {
		// resources_discover retries with a UI context for error reporting.
	}

	pi.on("resources_discover", async (event, ctx) => {
		try {
			const changed = await refreshCatalog(event.cwd);
			cache.catalog = [...catalog];
			cache.workingSelection = new Set(selection);
			const paths = selectedResourcePaths(catalog, selection);
			cache.skillPaths = paths.skillPaths;
			cache.promptPaths = paths.promptPaths;
			if (changed && !normalizationQueued && ctx.mode === "tui") {
				normalizationQueued = true;
				pi.sendUserMessage("/toggle --normalize", { expandPromptTemplates: true });
			}
			return paths;
		} catch (error) {
			catalog = [...cache.catalog];
			replaceSelection(cache.workingSelection);
			ctx.ui.notify(`Unable to discover toggle resources: ${error}`, "error");
			return { skillPaths: cache.skillPaths, promptPaths: cache.promptPaths };
		}
	});

	pi.registerCommand("toggle", {
		description: "Choose global skills and prompts for this Pi process",
		handler: async (args, ctx) => {
			if (args === "--normalize") {
				await ctx.reload();
				return;
			}
			if (ctx.mode !== "tui") {
				ctx.ui.notify("/toggle requires TUI mode", "error");
				return;
			}
			try {
				await refreshCatalog(ctx.cwd);
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				ctx.ui.notify(`Unable to load toggle resources: ${message}`, "error");
				return;
			}
			const draft = new Set(selection);
			const groups = groupResources(catalog);
			type ToggleRow =
				| { kind: "group"; group: ResourceGroup }
				| { kind: "resource"; group: ResourceGroup; resource: ManagedResource; flattened: boolean };
			const next = await ctx.ui.custom<Set<string>>((tui, theme, _keybindings, done) => {
				const search = new Input();
				search.focused = false;
				let searchMode = false;
				let selectedIndex = 0;

				const visibleRows = (): ToggleRow[] => {
					const query = search.getValue().toLowerCase();
					return groups.flatMap((group) => {
						const resources = group.resources.filter((resource) =>
							`${resource.type} ${group.label} ${label(resource)} ${resource.path} ${resource.metadata.source}`
								.toLowerCase()
								.includes(query),
						);
						if (resources.length === 0) return [];
						const children = resources.map((resource) => ({
							kind: "resource" as const,
							group,
							resource,
							flattened: !hasFolderRow(group),
						}));
						return hasFolderRow(group)
							? [{ kind: "group" as const, group }, ...children]
							: children;
					});
				};

				const marker = (state: "none" | "partial" | "all") => {
					if (state === "all") return theme.fg("success", "[x]");
					if (state === "partial") return theme.fg("warning", "[-]");
					return theme.fg("dim", "[ ]");
				};

				return {
					render(width: number) {
						const rows = visibleRows();
						selectedIndex = Math.min(selectedIndex, Math.max(0, rows.length - 1));
						const start = Math.max(0, Math.min(selectedIndex - 5, rows.length - 10));
						const lines = [theme.fg("accent", theme.bold("Skills & Prompts"))];
						const searchLabel = searchMode ? "Search (typing): " : "Search: ";
						lines.push(`${searchLabel}${search.render(Math.max(1, width - searchLabel.length))[0] ?? ""}`, "");
						for (let index = start; index < Math.min(start + 10, rows.length); index++) {
							const row = rows[index];
							const prefix = index === selectedIndex ? theme.fg("accent", "→") : " ";
							if (row.kind === "group") {
								const type = row.group.type === "skill" ? "Skills" : "Prompts";
								const detail = `${type} · ${safeText(row.group.source)}`;
								lines.push(truncateToWidth(
									`${prefix} ${marker(selectionState(row.group.resources, draft))} ${theme.bold(row.group.label)}  ${theme.fg("dim", detail)}`,
									width,
								));
								continue;
							}
							const path = relative(row.resource.metadata.baseDir ?? agentDir, row.resource.path);
							const detail = `${safeText(path)} · ${safeText(row.resource.metadata.source)}`;
							const state = draft.has(resourceKey(row.resource)) ? "all" : "none";
							const indent = row.flattened ? " " : "   ";
							lines.push(truncateToWidth(
								`${prefix}${indent}${marker(state)} ${label(row.resource)}  ${theme.fg("dim", detail)}`,
								width,
							));
						}
						if (rows.length === 0) lines.push(theme.fg("warning", "No matching resources"));
						lines.push("", truncateToWidth(
							theme.fg("dim", searchMode
								? "type to filter • tab navigate"
								: "/ search • ↑↓ or j/k navigate • space toggle • alt+a all • alt+n none • esc apply"),
							width,
						));
						return lines;
					},
					invalidate() {
						search.invalidate();
					},
					handleInput(data: string) {
						const rows = visibleRows();
						if (searchMode) {
							if (matchesKey(data, "tab")) {
								searchMode = false;
								search.focused = false;
							} else {
								search.handleInput(data);
								selectedIndex = 0;
							}
						} else if (matchesKey(data, "/")) {
							searchMode = true;
							search.focused = true;
						} else if (matchesKey(data, "escape") || matchesKey(data, "ctrl+c")) {
							done(draft);
						} else if (matchesKey(data, "alt+a")) {
							setAllSelected(draft, catalog, true);
						} else if (matchesKey(data, "alt+n")) {
							setAllSelected(draft, catalog, false);
						} else if (matchesKey(data, "up") || matchesKey(data, "k")) {
							selectedIndex = Math.max(0, selectedIndex - 1);
						} else if (matchesKey(data, "down") || matchesKey(data, "j")) {
							selectedIndex = Math.max(0, Math.min(rows.length - 1, selectedIndex + 1));
						} else if (matchesKey(data, "space") && rows[selectedIndex]) {
							const row = rows[selectedIndex];
							toggleSelection(draft, row.kind === "group" ? row.group.resources : [row.resource]);
						}
						tui.requestRender();
					},
				};
			});

			try {
				await applyProcessSelection(cache, next, () => ctx.reload());
				return;
			} catch (error) {
				ctx.ui.notify(`Unable to reload selected resources: ${error}`, "error");
			}
		},
	});

	pi.on("session_start", (event, ctx) => {
		if (baselineChanged && event.reason === "startup" && ctx.mode === "tui") {
			normalizationQueued = true;
			pi.sendUserMessage("/toggle --normalize", { expandPromptTemplates: true });
		}
	});
}
