# 金样对照：arrow bag quiver 选品开品

左边是用户提供的金样流程树，右边是本沙盒 `npm run workflow:selection` 生成的 `flow-tree.md`。两边都放在本目录。

## 结构对齐

- 章节标题覆盖金样 ##01–##16：流程树、角色、技能表、27 次请求账本、因果表、评论链、税费情景、成本因果、评分不直接变“做”、痛点→BOM、JSON 数据流、HTML 分层、失败修正、事后证据边界、未完成条件树、离线入口。
- 五步链一致：niche-finder → product-research → review-analyzer → tariff-calculator-amazon → product-selection。
- 暂停门：不传细分时停在第 1 步；选定 A 且数量 300 后交付评审稿，结论 HOLD，不是 GO。
- 工具名和参数形状按金样 §04：M03 `sort_by=units` 记为失败，M10 节点路径，M18–M24 评论星级，M25–M27 Sorftime 1688。
- A1 本地算术与金样同口径：到岸 5.9928、单位贡献约 4.23、贡献率约 15.1%、最差格约 2.28、现金约 4562.62、分数 59。
- 评论链保留 15 → 排除 2 条 Vine → 排除 1 条无正文 → 分母 12，并标低置信度。
- HTML 自包含、内联 CSS、水印、来源，无远程字体。

## 故意简化

- 正文比金样短。评论只留证据 ID、日期、摘录和主题，不重复贴出金样里的整段原文。
- 没有金样 ##17 的 `build_report.py` 全文，也没有 13MB 会话档案。生成器是 `src/lib/selection-doc/`。
- A0/A2 的售价和 FOB 是为了演示 NO-GO 的规划数，美元贡献不逐位复刻金样 A0 的 -1.02。A1 才对齐公开公式。
- 六维权重标 `inferred`：公开 nexscope 库没有 `amazon-product-selection`，用 private-label、profit-analyzer 和金样硬门槛合成。
- 节点 100 条商品明细没有逐行展开，只保留“第一页 100 行”这一请求事实。

## 仍缺真实 MCP

- 运行新增付费请求 0 次。账本是金样回放，不是本机再次调用 `market_*`。
- 没有卖家精灵或 Sorftime 密钥，也没有上游 HTTP 日志。
- 1688 的 price/MOQ 仍按金样记为缺失，沙盒不会补一条假报价。
- 税目 4202.92.91.00 与 17.6% 来自金样对 USITC 的转述，本回合没有重新打开 USITC。
