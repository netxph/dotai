import { cpSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const source = join(dirname(fileURLToPath(import.meta.url)), "..", "agents");
const agentDir = process.env.PI_CODING_AGENT_DIR || join(homedir(), ".pi", "agent");
const destination = join(agentDir, "agents");

mkdirSync(destination, { recursive: true });
cpSync(source, destination, { recursive: true });
console.log(`Installed pi-subagent profiles to ${destination}`);
