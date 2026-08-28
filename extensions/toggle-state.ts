import { normalize, relative, resolve } from "node:path";

export type ResourceType = "skill" | "prompt";

export interface ManagedResource {
	type: ResourceType;
	path: string;
	enabled: boolean;
	metadata: {
		source: string;
		scope: "user" | "project" | "temporary";
		origin: "package" | "top-level";
		baseDir?: string;
	};
}

type PackageSetting = string | {
	source: string;
	extensions?: string[];
	skills?: string[];
	prompts?: string[];
	themes?: string[];
	[key: string]: unknown;
};

export interface GlobalSettings {
	packages?: PackageSetting[];
	skills?: string[];
	prompts?: string[];
	[key: string]: unknown;
}

export interface ProcessCache {
	catalog: ManagedResource[];
	selection: Set<string>;
	workingSelection: Set<string>;
	skillPaths: string[];
	promptPaths: string[];
}

const cacheKey = Symbol.for("dotai.toggle.cache");

export function getProcessCache(host: object = globalThis): ProcessCache {
	const state = host as Record<PropertyKey, unknown>;
	if (!state[cacheKey]) {
		state[cacheKey] = {
			catalog: [],
			selection: new Set<string>(),
			workingSelection: new Set<string>(),
			skillPaths: [],
			promptPaths: [],
		};
	}
	return state[cacheKey] as ProcessCache;
}

export function getProcessSelection(host: object = globalThis): Set<string> {
	return getProcessCache(host).selection;
}

export async function applyProcessSelection(
	cache: ProcessCache,
	next: ReadonlySet<string>,
	reload: () => Promise<void>,
): Promise<boolean> {
	const selection = cache.selection;
	if (selection.size === next.size && [...selection].every((key) => next.has(key))) return false;
	const previous = {
		catalog: [...cache.catalog],
		selection: new Set(selection),
		workingSelection: new Set(cache.workingSelection),
		skillPaths: [...cache.skillPaths],
		promptPaths: [...cache.promptPaths],
	};
	selection.clear();
	for (const key of next) selection.add(key);
	try {
		await reload();
		return true;
	} catch (error) {
		cache.catalog = previous.catalog;
		cache.workingSelection = previous.workingSelection;
		cache.skillPaths = previous.skillPaths;
		cache.promptPaths = previous.promptPaths;
		selection.clear();
		for (const key of previous.selection) selection.add(key);
		throw error;
	}
}

export function resourceKey(resource: ManagedResource): string {
	return [resource.type, resource.metadata.source, normalize(resolve(resource.path))].join("\0");
}

export type SelectionState = "none" | "partial" | "all";

export interface ResourceGroup {
	key: string;
	label: string;
	type: ResourceType;
	source: string;
	resources: ManagedResource[];
}

function firstFolder(resource: ManagedResource): string {
	const root = resource.type === "skill" ? "skills" : "prompts";
	const relativeParts = resource.metadata.baseDir
		? relative(resource.metadata.baseDir, resource.path).split(/[\\/]+/)
		: [];
	const parts = relativeParts.includes(root)
		? relativeParts
		: normalize(resource.path).split(/[\\/]+/);
	const rootIndex = parts.indexOf(root);
	const descendants = rootIndex >= 0 ? parts.slice(rootIndex + 1) : [];
	return descendants.length > 1 ? descendants[0] : "(root)";
}

export function groupResources(resources: ManagedResource[]): ResourceGroup[] {
	const groups = new Map<string, ResourceGroup>();
	for (const resource of resources) {
		const folder = firstFolder(resource);
		const key = [resource.type, resource.metadata.source, folder].join("\0");
		const group = groups.get(key) ?? {
			key,
			label: folder,
			type: resource.type,
			source: resource.metadata.source,
			resources: [],
		};
		group.resources.push(resource);
		groups.set(key, group);
	}
	return [...groups.values()];
}

export function hasFolderRow(group: ResourceGroup): boolean {
	return group.resources.length > 1;
}

export function selectionState(resources: ManagedResource[], selected: ReadonlySet<string>): SelectionState {
	const count = resources.filter((resource) => selected.has(resourceKey(resource))).length;
	if (count === 0) return "none";
	return count === resources.length ? "all" : "partial";
}

export function setAllSelected(
	selected: Set<string>,
	resources: ManagedResource[],
	enabled: boolean,
): void {
	for (const resource of resources) {
		const key = resourceKey(resource);
		enabled ? selected.add(key) : selected.delete(key);
	}
}

export function toggleSelection(selected: Set<string>, resources: ManagedResource[]): void {
	setAllSelected(selected, resources, selectionState(resources, selected) !== "all");
}

export function selectedResourcePaths(resources: ManagedResource[], selected: ReadonlySet<string>) {
	const skillPaths: string[] = [];
	const promptPaths: string[] = [];
	for (const resource of resources) {
		if (resource.metadata.scope !== "user" || !selected.has(resourceKey(resource))) continue;
		(resource.type === "skill" ? skillPaths : promptPaths).push(resource.path);
	}
	return { skillPaths, promptPaths };
}

function replacePattern(entries: string[], pattern: string): string[] {
	const next = entries.filter((entry) => entry.replace(/^[!+-]/, "") !== pattern);
	next.push(`-${pattern}`);
	return next;
}

export function buildDisabledBaseline(
	settings: GlobalSettings,
	resources: ManagedResource[],
	agentDir?: string,
): GlobalSettings {
	const next: GlobalSettings = { ...settings };
	if (settings.packages) {
		next.packages = settings.packages.map((entry) =>
			typeof entry === "string" ? entry : { ...entry },
		);
	}
	if (settings.skills) next.skills = [...settings.skills];
	if (settings.prompts) next.prompts = [...settings.prompts];
	const packageSources = new Set<string>();

	for (const resource of resources) {
		if (resource.metadata.scope !== "user") continue;
		if (resource.metadata.origin === "package") {
			packageSources.add(resource.metadata.source);
			continue;
		}

		const baseDir = resource.metadata.baseDir ?? agentDir;
		if (!baseDir) throw new Error(`Missing base directory for ${resource.path}`);
		const pattern = relative(baseDir, resource.path);
		const key = resource.type === "skill" ? "skills" : "prompts";
		next[key] = replacePattern(next[key] ?? [], pattern);
	}

	if (next.packages) {
		next.packages = next.packages.map((entry) => {
			const source = typeof entry === "string" ? entry : entry.source;
			if (!packageSources.has(source)) return entry;
			const object = typeof entry === "string" ? { source: entry } : entry;
			return { ...object, skills: [], prompts: [] };
		});
	}

	return next;
}
