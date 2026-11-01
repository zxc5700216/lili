export type ProviderId = "sellersprite" | "xiyou" | "duobaoyu" | "sorftime";

export type FieldDef = {
  key: string;
  labelZh: string;
  labelEn: string;
  secret?: boolean;
  defaultValue?: string;
  helpZh: string;
  helpEn: string;
  inferred?: boolean;
  advanced?: boolean;
};

export type ProviderDef = {
  id: ProviderId;
  nameZh: string;
  nameEn: string;
  docs: { href: string; label: string }[];
  fields: FieldDef[];
  noteZh: string;
  noteEn: string;
};

export const PROVIDERS: ProviderDef[] = [
  {
    id: "sellersprite",
    nameZh: "卖家精灵 SellerSprite",
    nameEn: "SellerSprite",
    docs: [
      { href: "https://open.sellersprite.com/mcp/16", label: "MCP 文档" },
      { href: "https://open.sellersprite.com/api", label: "REST 文档" },
    ],
    noteZh: "请求头名固定为 secret-key，值是「我的密钥」里的字符串。也可把密钥放在 MCP URL 查询参数 secret-key。",
    noteEn: "The header name is secret-key. The value is the key string from My Keys. The same value can be passed as the secret-key query on the MCP URL.",
    fields: [
      { key: "mcpUrl", labelZh: "MCP URL", labelEn: "MCP URL", defaultValue: "https://mcp.sellersprite.com/mcp", helpZh: "官网 MCP 端点。", helpEn: "Official MCP endpoint." },
      { key: "restBase", labelZh: "REST 根地址", labelEn: "REST base", defaultValue: "https://api.sellersprite.com", helpZh: "连通性测试打 /v1/visits。", helpEn: "Connectivity test calls /v1/visits." },
      { key: "secretKey", labelZh: "secret-key", labelEn: "secret-key", secret: true, helpZh: "头名不是自定义的，就叫 secret-key。", helpEn: "Header name is literally secret-key." },
    ],
  },
  {
    id: "xiyou",
    nameZh: "西柚洞察（西柚找词）",
    nameEn: "Xiyou Insights (Xiyou Keywords)",
    docs: [
      { href: "https://platform.xydc.com/docs/mcp-access", label: "MCP 接入" },
      { href: "https://platform.xydc.com/mcp", label: "MCP 控制台" },
    ],
    noteZh: "按官方 MCP 接入教程，优先使用自动接入；也可使用 JSON 配置或 MCP 链接。本页填写官方 MCP 地址和控制台生成的 MCP Token，通过 Authorization: Bearer 请求头连接。OpenAPI 的 Client ID / Secret 不用于 MCP 接入。",
    noteEn: "The official guide recommends automatic setup, with JSON configuration and an MCP link as alternatives. On this page, enter the official MCP URL and the MCP Token from the console; the connection uses an Authorization: Bearer header. OpenAPI Client ID / Secret credentials are not used for MCP.",
    fields: [
      { key: "mcpUrl", labelZh: "远程 MCP 地址", labelEn: "Remote MCP URL", defaultValue: "https://mcp.xydc.com/mcp", helpZh: "本页使用请求头鉴权，地址不需要附带 Token；与下方 JSON 示例的 url 一致。", helpEn: "This page uses header authentication. Use the URL from the JSON example without adding a token to it." },
      { key: "mcpToken", labelZh: "MCP Token", labelEn: "MCP Token", secret: true, helpZh: "从西柚 MCP 控制台复制真实 Token，只填 Token 原文，不含 Bearer 前缀；不要填示例占位符或 OpenAPI 密钥。先保存，再测试连接。", helpEn: "Copy the real token from the Xiyou MCP console. Enter only the token, without the Bearer prefix; do not enter a placeholder or an OpenAPI key. Save before testing the connection." },
      { key: "openapiBase", labelZh: "OpenAPI 根地址", labelEn: "OpenAPI base", defaultValue: "https://openapi.xiyouzhaoci.com", advanced: true, helpZh: "独立 OpenAPI 配置，可选，不参与 MCP 连接测试。", helpEn: "Optional, separate OpenAPI configuration; not used by the MCP connection test." },
      { key: "clientId", labelZh: "OpenAPI Client ID", labelEn: "OpenAPI Client ID", advanced: true, helpZh: "仅供独立 OpenAPI 使用，不是 MCP Token。", helpEn: "For the separate OpenAPI only; this is not an MCP Token." },
      { key: "clientSecret", labelZh: "OpenAPI Client Secret", labelEn: "OpenAPI Client Secret", secret: true, advanced: true, helpZh: "仅供独立 OpenAPI 使用；已有配置继续保留。", helpEn: "For the separate OpenAPI only. Existing saved configuration is preserved." },
    ],
  },
  {
    id: "duobaoyu",
    nameZh: "粒粒lili MCP",
    nameEn: "粒粒lili MCP",
    docs: [{ href: "https://duobaoyu.ai", label: "duobaoyu.ai" }],
    noteZh: "inferred：公开营销页给出的连接地址是 https://listingapp.duobaoyu.ai/mcp，鉴权是浏览器登录，没有公开的静态 API Key 字段。下面的访问令牌是按常见 Bearer 方式预留的假设。",
    noteEn: "inferred: the public marketing page publishes https://listingapp.duobaoyu.ai/mcp and browser login. No static API key field is documented. The access token below assumes a Bearer header.",
    fields: [
      { key: "mcpUrl", labelZh: "MCP URL", labelEn: "MCP URL", defaultValue: "https://listingapp.duobaoyu.ai/mcp", helpZh: "inferred：来自公开产品页的连接地址。", helpEn: "inferred: connector URL from the public product page.", inferred: true },
      { key: "accessToken", labelZh: "访问令牌", labelEn: "Access token", secret: true, helpZh: "inferred：若登录后拿到令牌，以 Authorization: Bearer 发送。", helpEn: "inferred: sent as Authorization: Bearer when present.", inferred: true },
    ],
  },
  {
    id: "sorftime",
    nameZh: "Sorftime",
    nameEn: "Sorftime",
    docs: [{ href: "https://www.sorftime.com", label: "sorftime.com" }],
    noteZh: "inferred：没有查到给卖家单独使用的公开 MCP URL。12 条工作流里的 1688 / 多平台数据走粒粒lili工具 market_query_sorftime。这里的令牌只作保存，测试不会假装连上。",
    noteEn: "inferred: no public seller MCP URL was found. The workflows call Sorftime through 粒粒lili market_query_sorftime. A saved token is not treated as a successful connection.",
    fields: [
      { key: "token", labelZh: "Sorftime 令牌（可选）", labelEn: "Sorftime token (optional)", secret: true, helpZh: "inferred：无公开直连端点。", helpEn: "inferred: no public direct endpoint.", inferred: true },
    ],
  },
];

export type SecretMap = Record<string, string>;
export type ConfigShape = Partial<Record<ProviderId, SecretMap>>;

export function isProviderReady(id: ProviderId, values: SecretMap | undefined) {
  if (!values) return false;
  if (id === "sellersprite") return Boolean(values.secretKey);
  if (id === "xiyou") return Boolean(values.mcpToken);
  if (id === "duobaoyu") return Boolean(values.accessToken);
  if (id === "sorftime") return false;
  return false;
}

export const BUY_LINKS: Record<ProviderId, { buy: string; keys: string; buyInferred?: boolean; keysInferred?: boolean }> = {
  sellersprite: {
    buy: "https://www.sellersprite.com",
    keys: "https://open.sellersprite.com",
    buyInferred: true,
    keysInferred: true,
  },
  xiyou: {
    buy: "https://platform.xydc.com",
    keys: "https://platform.xydc.com/mcp",
  },
  duobaoyu: {
    buy: "https://listingapp.duobaoyu.ai/v2/recharge",
    keys: "https://listingapp.duobaoyu.ai/v2/start",
  },
  sorftime: {
    buy: "https://www.sorftime.com",
    keys: "https://www.sorftime.com",
    buyInferred: true,
    keysInferred: true,
  },
};

export function requiredProviders(slug: string): ProviderId[] {
  if (slug === "selection-doc") return ["duobaoyu", "sellersprite"];
  if (slug === "competitor-teardown") return ["duobaoyu", "xiyou"];
  return ["duobaoyu"];
}
