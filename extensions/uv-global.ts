import { isToolCallEventType, type ExtensionAPI } from "@earendil-works/pi-coding-agent";

const UV_PROMPT = `
IMPORTANT: Prefer a uv-first Python workflow unless the repository explicitly requires something else.
- Use \`uv run python ...\` instead of bare \`python ...\` or \`python3 ...\`.
- Use \`uv pip ...\` instead of bare \`pip ...\`.
- For projects with \`pyproject.toml\`, prefer \`uv sync\` for dependency setup and \`uv add ...\` for adding dependencies.
- Avoid manual virtualenv creation unless the repository docs or existing scripts explicitly require a non-uv workflow.
- If project documentation, scripts, or CI already standardize on another Python toolchain, follow the project convention.
`.trim();

const BASH_PREFIX = [
	"shopt -s expand_aliases",
	"alias python='uv run python'",
	"alias python3='uv run python'",
	"alias pip='uv pip'",
].join("\n");

function shouldSkipPrefix(command: string): boolean {
	const trimmed = command.trim();
	if (!trimmed) return true;
	if (trimmed.startsWith("uv ")) return true;
	if (trimmed.includes(BASH_PREFIX)) return true;
	if (/\b(source|\.)\s+[^\n]*activate\b/.test(trimmed)) return true;
	if (/(^|\s)(?:[A-Za-z]:)?\/[^\s]*(?:python|python3|pip)(?:[\d.]*)?(?=\s|$)/.test(trimmed)) return true;
	return false;
}

export default function uvGlobal(pi: ExtensionAPI) {
	pi.on("before_agent_start", async (event) => ({
		systemPrompt: `${event.systemPrompt}\n\n${UV_PROMPT}`,
	}));

	pi.on("tool_call", async (event) => {
		if (!isToolCallEventType("bash", event)) return;
		if (shouldSkipPrefix(event.input.command)) return;
		event.input.command = `${BASH_PREFIX}\n${event.input.command}`;
	});
}
