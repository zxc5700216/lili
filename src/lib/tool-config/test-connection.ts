import { isProviderReady, type ProviderId } from "./providers";
import { loadConfig } from "./store";

export type TestResult = { ok: boolean; status: number | null; message: string };

async function readBody(res: Response) {
  const text = await res.text();
  return text.slice(0, 280);
}

export async function testProvider(id: ProviderId): Promise<TestResult> {
  const config = loadConfig()[id] ?? {};
  if (id === "sorftime") {
    return {
      ok: false,
      status: null,
      message: "inferred：没有公开的 Sorftime 直连端点可供测试。选品里的 1688 请求应走已配置的粒粒lili market_query_sorftime。保存令牌不会被当成连接成功。",
    };
  }
  if (!isProviderReady(id, config)) {
    return { ok: false, status: null, message: "缺配置：没有可用的密钥或令牌，未发出请求。" };
  }
  try {
    if (id === "sellersprite") {
      const base = config.restBase || "https://api.sellersprite.com";
      const res = await fetch(`${base.replace(/\/$/, "")}/v1/visits`, {
        headers: { "secret-key": config.secretKey, accept: "application/json" },
        signal: AbortSignal.timeout(12000),
      });
      const body = await readBody(res);
      return { ok: res.ok, status: res.status, message: res.ok ? "卖家精灵 /v1/visits 已响应。" : `卖家精灵返回 ${res.status}。${body}` };
    }
    if (id === "xiyou") {
      const url = config.mcpUrl || "https://mcp.xydc.com/mcp";
      const res = await fetch(url, {
        method: "POST",
        headers: { authorization: `Bearer ${config.mcpToken}`, "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "lili", version: "0.1.0" } } }),
        signal: AbortSignal.timeout(12000),
      });
      const body = await readBody(res);
      return { ok: res.ok, status: res.status, message: res.ok ? "西柚 MCP initialize 已响应。" : `西柚 MCP 返回 ${res.status}。${body}` };
    }
    const url = config.mcpUrl || "https://listingapp.duobaoyu.ai/mcp";
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (config.accessToken) headers.authorization = `Bearer ${config.accessToken}`;
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "lili", version: "0.1.0" } } }),
      signal: AbortSignal.timeout(12000),
    });
    const body = await readBody(res);
    return { ok: res.ok, status: res.status, message: res.ok ? "粒粒lili MCP initialize 已响应。" : `粒粒lili MCP 返回 ${res.status}。inferred：公开文档只说明浏览器登录。${body}` };
  } catch (error) {
    return { ok: false, status: null, message: error instanceof Error ? error.message : "连接失败" };
  }
}

export class MissingConfigError extends Error {
  missing: ProviderId[];
  constructor(missing: ProviderId[]) {
    super(`缺配置：${missing.join("、")}。到 /v2/tool-config 填写后再用 --live。没有静默改走假数据。`);
    this.missing = missing;
  }
}
