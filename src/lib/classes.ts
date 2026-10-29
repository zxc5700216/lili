export type ClassItem = {
  slug: string;
  kind: "live" | "recorded";
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  summaryEn: string;
  whenZh: string;
  whenEn: string;
  metaZh: string;
  metaEn: string;
  priceZh: string;
  priceEn: string;
  wasZh?: string;
  wasEn?: string;
  noteZh?: string;
  noteEn?: string;
  cta: "wecom" | "signup" | "contact";
  month: number;
  days: number[];
  outlineZh: string[];
  outlineEn: string[];
};

export const CLASSES: ClassItem[] = [
  {
    slug: "setup-qa",
    kind: "live",
    titleZh: "粒粒lili安装与使用答疑",
    titleEn: "粒粒lili setup and usage Q&A",
    summaryZh: "每周四晚，把安装、授权和第一次提问里卡住的地方过一遍。",
    summaryEn: "Every Thursday. Install, authorization, and the first questions people get stuck on.",
    whenZh: "10 月 29 日 · 周四",
    whenEn: "Oct 29 Thu",
    metaZh: "20:00 · 60 分钟 · 线上直播 · 视频号 / 抖音",
    metaEn: "20:00 · 60 min · Live online · WeChat Channels / Douyin",
    priceZh: "免费",
    priceEn: "Free",
    noteZh: "每周四",
    noteEn: "Every Thursday",
    cta: "wecom",
    month: 10,
    days: [15, 22, 29],
    outlineZh: ["连接地址加在哪", "店铺授权和广告资料要分开", "为什么必须新开一个对话", "写入默认关闭时，预览长什么样"],
    outlineEn: [
      "Where the connector URL goes",
      "Store auth and ads profiles are separate",
      "Why the next question has to be a new chat",
      "What a preview looks like while execute stays off",
    ],
  },
  {
    slug: "bootcamp",
    kind: "live",
    titleZh: "AI + 跨境电商三日实战",
    titleEn: "3-day AI cross-border bootcamp",
    summaryZh: "三天线下，把选品、Listing、广告和补货走成能复用的流程。",
    summaryEn: "Three days in person. Selection, listing, ads, and restock as workflows you can reuse.",
    whenZh: "11 月 13–15 日",
    whenEn: "Nov 13–15",
    metaZh: "线下 · 深圳 / 杭州 · 日期暂定",
    metaEn: "In person · Shenzhen / Hangzhou",
    priceZh: "¥5,888",
    priceEn: "¥5,888",
    wasZh: "¥12,888",
    wasEn: "¥12,888",
    noteZh: "日期暂定 · 仅首期",
    noteEn: "Dates tentative · First cohort only",
    cta: "signup",
    month: 11,
    days: [13, 14, 15],
    outlineZh: ["第 1 天：店铺数据和技能", "第 2 天：Listing 与广告漏斗", "第 3 天：补货、利润和审批"],
    outlineEn: [
      "Day 1: store data and skills",
      "Day 2: listings and the ads funnel",
      "Day 3: restock, profit, and approvals",
    ],
  },
  {
    slug: "codex-listings",
    kind: "recorded",
    titleZh: "用 Codex 做 Listing 和广告",
    titleEn: "Codex for listings and ads",
    summaryZh: "录像课。看怎样把图片和卖点写成 Listing，并搭一组起步广告。",
    summaryEn: "Recorded, watch any time",
    whenZh: "录像",
    whenEn: "Recorded",
    metaZh: "随时看",
    metaEn: "Recorded, watch any time",
    priceZh: "¥399",
    priceEn: "¥399",
    cta: "contact",
    month: 0,
    days: [],
    outlineZh: ["主图和五点怎么分工", "后台搜索词不重复标题", "起步广告：自动加少量精确", "每一步先预览"],
    outlineEn: [
      "What the main image does, and what the bullets do",
      "Backend terms that are not already in the title",
      "Starter ads: auto plus a few exact terms",
      "Preview before any write",
    ],
  },
  {
    slug: "codex-basics",
    kind: "recorded",
    titleZh: "Codex / AI 基础",
    titleEn: "Codex / AI basics",
    summaryZh: "录像课。第一次把助手接上店铺时，对话该怎么开。",
    summaryEn: "Recorded, watch any time",
    whenZh: "录像",
    whenEn: "Recorded",
    metaZh: "随时看",
    metaEn: "Recorded, watch any time",
    priceZh: "¥199",
    priceEn: "¥199",
    wasZh: "¥399",
    wasEn: "¥399",
    cta: "contact",
    month: 0,
    days: [],
    outlineZh: ["新对话才看得到店铺", "查询和写入的差别", "市场调研开关和执行开关", "积分不够时会怎样"],
    outlineEn: [
      "The store shows up only in a new chat",
      "Reads versus writes",
      "The market-research toggle and the execute toggle",
      "What happens when credits run out",
    ],
  },
  {
    slug: "selection-workflow",
    kind: "recorded",
    titleZh: "跨境选品工作流",
    titleEn: "Building a cross-border product selection workflow",
    summaryZh: "录像课。从一个方向收到能交给工厂的开品文档。",
    summaryEn: "Recorded, watch any time",
    whenZh: "录像",
    whenEn: "Recorded",
    metaZh: "随时看",
    metaEn: "Recorded, watch any time",
    priceZh: "¥399",
    priceEn: "¥399",
    cta: "contact",
    month: 0,
    days: [],
    outlineZh: ["先收窄到 3 个细分", "差评里的痛点", "关税和到岸成本", "做或不做的结论"],
    outlineEn: [
      "Narrow a direction to three niches",
      "Pains taken from critical reviews",
      "Duty and landed cost",
      "A go or no-go",
    ],
  },
];
