import * as os from "os";
import { execFile } from "child_process";
import { promisify } from "util";
import { EnvironmentContext } from "../schema/investigation";

const execFileAsync = promisify(execFile);

async function tryVersion(cmd: string, args: string[]): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync(cmd, args, { timeout: 3000 });
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

async function detectPackageManager(): Promise<EnvironmentContext["packageManager"]> {
  if (await tryVersion("pnpm", ["--version"])) return "pnpm";
  if (await tryVersion("yarn", ["--version"])) return "yarn";
  if (await tryVersion("bun", ["--version"])) return "bun";
  if (await tryVersion("npm", ["--version"])) return "npm";
  if (await tryVersion("poetry", ["--version"])) return "poetry";
  if (await tryVersion("pip", ["--version"])) return "pip";
  return "unknown";
}

/** Collects environment metadata silently - never asks the developer "what Node version are you on?" */
export async function collectEnvironmentContext(): Promise<EnvironmentContext> {
  const [nodeVersion, pythonVersion, packageManager] = await Promise.all([
    tryVersion("node", ["--version"]),
    tryVersion("python3", ["--version"]).then((v) => v ?? tryVersion("python", ["--version"])),
    detectPackageManager(),
  ]);

  return {
    nodeVersion,
    pythonVersion,
    packageManager,
    operatingSystem: `${os.platform()} ${os.release()}`,
  };
}
