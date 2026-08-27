import { readFileSync } from "node:fs";
import { join } from "node:path";
import { clientConfigSchema, type ClientConfig } from "@/lib/client-config";

export function loadClientConfig(): ClientConfig {
  const path = join(process.cwd(), "content", "client.json");
  const raw = JSON.parse(readFileSync(path, "utf8")) as unknown;
  return clientConfigSchema.parse(raw);
}
