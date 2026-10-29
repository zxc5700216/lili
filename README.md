# 粒粒lili

粒粒lili 本地可运行副本。数据全部是模拟的，不会连接 Amazon、广告接口、Shopify、Sorftime，也不会向官方客服或支付通道发任何请求。

侧栏副标题沿用了实拍里的 “Official launch Nov 1”，只为对照版式。这个仓库是粒粒lili（原 study-lab / 粒粒学习沙盒）准备投入使用的产品副本。

## 本地运行

```bash
docker compose up -d
npm i
npx prisma db push
npx prisma db seed
npm run dev
```

浏览器打开 [http://127.0.0.1:43123](http://127.0.0.1:43123) ，在登录页进入沙盒。

选品开品文档（目前唯一可演示的端到端工作流）：

```bash
npm run workflow:selection -- --keyword "arrow bag quiver"
```

产出在 `artifacts/selection-doc/arrow-bag-quiver/`。十二条一起跑（fixture，不需要密钥）：

```bash
npm run workflow:all
```

单条真调用（缺密钥会退出并写明缺哪一项，不会假装成功）：

```bash
npm run workflow:run -- --slug monday-review --live
```

密钥在网页 `/v2/tool-config` 填写，加密存在 `.secrets/`，口令在 `.env.local`。演示报告列表是 `/v2/workflows`。数据库连接写在 `.env.example`：

`postgresql://duobaoyu:duobaoyu@localhost:54329/duobaoyu`

## 页面

| 路径 | 对应实拍 |
| --- | --- |
| `/v2/start` | 开始使用：店铺、广告资料、连接 AI、试一试 |
| `/v2/cases` | 12 张工作流模板和分类筛选 |
| `/v2/cases/[slug]` | 单条模板的步骤、完整提示词、沙盒演练 |
| `/v2/skills` | 116 个技能，搜索和分类 |
| `/v2/skills/[slug]` | 单个技能 |
| `/v2/courses` | 日历、直播课、录像课 |
| `/v2/team` | 邀请和管理员 |
| `/v2/settings` | 只保留 Shopify 连接（模拟同意页） |
| `/v2/recharge` | 积分充值（不加真实款项） |
| `/v2/help` | 转到 `/v2/start` |
| `/v2/tools` | 学习用工具实验室，不在正式侧栏里 |
| `/v2/approvals` | 写入审批。执行开关默认关闭 |

顶栏：反馈、支持、帮助中心、积分 / 充值。侧栏底部：中文 / EN、退出。

逐条状态见 [COVERAGE.md](COVERAGE.md)。

## 覆盖清单

`GET /api/health` 应返回 `tools: 107`、`skills: 116`、`workflows: 12`、`stores: 2`。

实拍技能页当时是 All 114。上传的 `data/skill-names.txt` 有 116 个，页面全部可打开，分类数量按这份清单计算，所以和实拍的 114 不会逐项相等。

### 工作流（12）

| # | slug | 分类 |
| --- | --- | --- |
| 01 | `monday-review` | reports |
| 02 | `ads-stop-bleeding` | ads |
| 03 | `sales-drop` | data |
| 04 | `new-listing-to-ads` | listing |
| 05 | `selection-doc` | market |
| 06 | `competitor-teardown` | market |
| 07 | `restock-to-ship` | restock |
| 08 | `profit-checkup` | profit |
| 09 | `peak-prep` | ads |
| 10 | `sunset-sku` | ads |
| 11 | `returns-push` | returns |
| 12 | `monthly-report` | reports |

中文原文在 `data/workflows.txt`。英文卡片文案按实拍。

### 技能

116 条来自 `data/skill-names.txt`，中英文名称和步骤在 `data/skills.json`，分类在 `data/taxonomy.json`。筛选：全部、精选、广告、市场、Listing、利润、关键词、补货、数据、合规、退货、订单。

### 工具

107 个来自 `data/tools.json`，说明来自 `data/tool-docs.md`。每个工具在 `/v2/tools/[name]` 按 schema 填参数后模拟调用。也可以对 `POST /api/mcp` 发 `tools/list` 和 `tools/call`。

- 只读工具直接返回沙盒数据。
- `readOnly=false` 的工具，以及 `ads_prepare_changes`、`ads_prepare_apply`、`listing_prepare_change`、`restock_preview_shipment`、`restock_prepare_placement`、`restock_prepare_transportation`，只生成审批预览。
- `market_*`、`competitor_*`、`brand_get_search_query_performance` 在「允许市场调研」关闭时返回 403。
- 批准审批时，如果「允许 AI 执行操作」关闭，返回 409，不改数据。打开之后，批准只会改本地出价、货件草稿或 Listing 草稿。

两个开关都在「开始使用 → 连接你的 AI」那一行，默认关闭。

### 种子店铺

- NS店-北美-US
- TK店-US

含模拟 ASIN、库存、广告活动和浪费词。广告、补货、Listing 三条演练：打开对应工作流点「在沙盒里演练」，或在工具实验室调用 `ads_prepare_changes`、`restock_create_shipment_draft`、`listing_prepare_change`。

## 技术栈

Next.js 15 App Router、React 19、TypeScript 5、Prisma 7、PostgreSQL、`@prisma/adapter-pg`、Tailwind CSS 4、Zustand、lucide-react。Postgres 由 `docker-compose.yml` 提供。
