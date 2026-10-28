import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { ConfigShape, ProviderId } from "./providers";

const root = process.cwd();
const envFile = path.join(root, ".env.local");
const secretFile = path.join(root, ".secrets", "tool-config.json");

function readEnvValue(name: string) {
  if (process.env[name]) return process.env[name] as string;
  if (!fs.existsSync(envFile)) return "";
  const line = fs.readFileSync(envFile, "utf8").split("\n").find((row) => row.startsWith(`${name}=`));
  return line ? line.slice(name.length + 1).trim() : "";
}

function encryptionKey() {
  let raw = readEnvValue("TOOL_CONFIG_KEY");
  if (!raw) {
    raw = crypto.randomBytes(32).toString("hex");
    fs.appendFileSync(envFile, `${fs.existsSync(envFile) && fs.statSync(envFile).size ? "\n" : ""}TOOL_CONFIG_KEY=${raw}\n`);
    process.env.TOOL_CONFIG_KEY = raw;
  }
  return crypto.createHash("sha256").update(raw).digest();
}

export function loadConfig(): ConfigShape {
  if (!fs.existsSync(secretFile)) return {};
  const parsed = JSON.parse(fs.readFileSync(secretFile, "utf8")) as { iv: string; tag: string; data: string };
  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(parsed.iv, "base64"));
  decipher.setAuthTag(Buffer.from(parsed.tag, "base64"));
  const json = Buffer.concat([decipher.update(Buffer.from(parsed.data, "base64")), decipher.final()]).toString("utf8");
  return JSON.parse(json) as ConfigShape;
}

export function saveConfig(next: ConfigShape) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(next), "utf8"), cipher.final()]);
  fs.mkdirSync(path.dirname(secretFile), { recursive: true });
  fs.writeFileSync(
    secretFile,
    JSON.stringify({ v: 1, iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), data: encrypted.toString("base64") }),
  );
}

export function mergeProvider(id: ProviderId, patch: Record<string, string>) {
  const current = loadConfig();
  const prev = current[id] ?? {};
  const next = { ...prev };
  for (const [key, value] of Object.entries(patch)) {
    if (value === "__keep__") continue;
    next[key] = value;
  }
  current[id] = next;
  saveConfig(current);
  return current;
}

export function maskConfig(config: ConfigShape) {
  const out: Record<string, Record<string, string>> = {};
  for (const [id, fields] of Object.entries(config)) {
    out[id] = {};
    for (const [key, value] of Object.entries(fields ?? {})) {
      if (!value) out[id][key] = "";
      else if (/key|token|secret/i.test(key)) out[id][key] = `••••${value.slice(-4)}`;
      else out[id][key] = value;
    }
  }
  return out;
}
