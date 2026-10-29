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
    nameEn: "Xiyou",
    docs: [
      { href: "https://platform.xydc.com/docs/mcp-access", label: "MCP 接入" },
      { href: "https://platform.xydc.com/mcp", label: "MCP 控制台" },
    ],
    noteZh: "MCP 用 Authorization: Bearer <MCP Token>，或 URL 上的 mcp_token。OpenAPI（openapi.xiyouzhaoci.com）是另一套 Client ID / Secret，用于开放接口而不是这条 MCP。",
    noteEn: "MCP uses Authorization: Bearer <MCP Token>, or mcp_token on the URL. OpenAPI at openapi.xiyouzhaoci.com is a separate Client ID / Secret pair.",
    fields: [
      { key: "mcpUrl", labelZh: "MCP URL", labelEn: "MCP URL", defaultValue: "https://mcp.xydc.com/mcp", helpZh: "官网 MCP 端点。", helpEn: "Official MCP endpoint." },
      { key: "mcpToken", labelZh: "MCP Token", labelEn: "MCP Token", secret: true, helpZh: "Bearer 令牌。", helpEn: "Bearer token." },
      { key: "openapiBase", labelZh: "OpenAPI 根地址", labelEn: "OpenAPI base", defaultValue: "https://openapi.xiyouzhaoci.com", helpZh: "与 MCP Token 分开。", helpEn: "Separate from the MCP token." },
      { key: "clientId", labelZh: "OpenAPI Client ID", labelEn: "OpenAPI Client ID", helpZh: "开放接口客户端。", helpEn: "OpenAPI client id." },
      { key: "clientSecret", labelZh: "OpenAPI Client Secret", labelEn: "OpenAPI Client Secret", secret: true, helpZh: "开放接口密钥。", helpEn: "OpenAPI client secret." },
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
