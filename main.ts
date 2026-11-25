import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 200;

const ENTRY_LINE: string =
  "I gave my son a broken compass for his camping trip. Not to be mean—I just wanted him to find his own direction in life.";

function resolveOutputDir(): string {
  const configured = process.env.MAKEFUN_OUTPUT_DIR?.trim();
  return configured && configured.length > 0 ? configured : "/output";
}

function main(): void {
  const trimmed = ENTRY_LINE.trim();
  if (trimmed.length === 0 || ENTRY_LINE.length > MAX_CHARS) {
    process.exitCode = 1;
    return;
  }

  try {
    const outputDir = resolveOutputDir();
    mkdirSync(outputDir, { recursive: true });
    const outputPath = join(outputDir, "entry.txt");
    writeFileSync(outputPath, ENTRY_LINE, { encoding: "utf8", mode: 0o644 });
    chmodSync(outputPath, 0o644);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`Failed to write entry: ${message}\n`);
    process.exitCode = 1;
  }
}

main();
