import { cpSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function installAgents(pi: ExtensionAPI) {
	pi.on("session_start", () => {
		const source = join(dirname(fileURLToPath(import.meta.url)), "..", "agents");
		const agentDir = process.env.PI_CODING_AGENT_DIR || join(homedir(), ".pi", "agent");
		const destination = join(agentDir, "agents");
		mkdirSync(destination, { recursive: true });
		cpSync(source, destination, { recursive: true });
	});
}
