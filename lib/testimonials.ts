// 本文件由 scripts/process-testimonials.mjs 自动生成，请勿手动编辑。
// 学员感谢 / 真实反馈 —— 图片素材数据映射（路径、分类、标签、文案）。
// 所有截图均已做隐私处理：身份证号 / 准考证号 / 校验码 / 姓名等敏感信息已遮挡。

export type TestimonialKind = "chat" | "poster" | "query" | "moments";

export interface Testimonial {
  id: string;
  /** 大图（点击放大查看） */
  src: string;
  /** 缩略图（网格展示，懒加载） */
  thumb: string;
  subject: "math" | "english" | "liberal";
  subjectLabel: string;
  kind: TestimonialKind;
  /** 角标文案 */
  kindLabel: string;
  /** 用于筛选的标签 */
  filterTags: string[];
  caption: string;
  /** 大图宽高（用于保持比例、避免布局抖动） */
  w: number;
  h: number;
}

export const testimonials: Testimonial[] = [
  {
    "id": "math-chat-01",
    "src": "/testimonials/math/full/math-chat-01.webp",
    "thumb": "/testimonials/math/thumb/math-chat-01.webp",
    "subject": "math",
    "subjectLabel": "数学",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "数学",
      "学员反馈"
    ],
    "caption": "“我哭了，太幸运能遇到你” · 数学逆袭上岸",
    "w": 1080,
    "h": 2341
  },
  {
    "id": "math-poster-01",
    "src": "/testimonials/math/full/math-poster-01.webp",
    "thumb": "/testimonials/math/thumb/math-poster-01.webp",
    "subject": "math",
    "subjectLabel": "数学",
    "kind": "poster",
    "kindLabel": "上岸喜报",
    "filterTags": [
      "数学",
      "上岸喜报"
    ],
    "caption": "理科总成绩 262 分",
    "w": 1080,
    "h": 1673
  },
  {
    "id": "liberal-arts-chat-01",
    "src": "/testimonials/liberal-arts/full/liberal-arts-chat-01.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-chat-01.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "文科",
      "学员反馈"
    ],
    "caption": "“遇到这样的好老师，是我最大的幸运”",
    "w": 1080,
    "h": 2132
  },
  {
    "id": "english-moments-01",
    "src": "/testimonials/english/full/english-moments-01.webp",
    "thumb": "/testimonials/english/thumb/english-moments-01.webp",
    "subject": "english",
    "subjectLabel": "英语",
    "kind": "moments",
    "kindLabel": "朋友圈",
    "filterTags": [
      "英语",
      "朋友圈截图"
    ],
    "caption": "“不求高歌猛进，但求百折不挠”",
    "w": 1080,
    "h": 560
  },
  {
    "id": "liberal-arts-poster-01",
    "src": "/testimonials/liberal-arts/full/liberal-arts-poster-01.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-poster-01.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "poster",
    "kindLabel": "上岸喜报",
    "filterTags": [
      "文科",
      "上岸喜报"
    ],
    "caption": "高分达人 · 总分 258",
    "w": 1080,
    "h": 2001
  },
  {
    "id": "math-chat-02",
    "src": "/testimonials/math/full/math-chat-02.webp",
    "thumb": "/testimonials/math/thumb/math-chat-02.webp",
    "subject": "math",
    "subjectLabel": "数学",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "数学",
      "学员反馈"
    ],
    "caption": "数学从 30 多分逆袭到 123 分",
    "w": 980,
    "h": 2140
  },
  {
    "id": "liberal-arts-moments-01",
    "src": "/testimonials/liberal-arts/full/liberal-arts-moments-01.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-moments-01.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "moments",
    "kindLabel": "朋友圈",
    "filterTags": [
      "文科",
      "朋友圈截图"
    ],
    "caption": "250 分上岸杭电 · 朋友圈报喜",
    "w": 1080,
    "h": 2096
  },
  {
    "id": "english-chat-01",
    "src": "/testimonials/english/full/english-chat-01.webp",
    "thumb": "/testimonials/english/thumb/english-chat-01.webp",
    "subject": "english",
    "subjectLabel": "英语",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "英语",
      "学员反馈"
    ],
    "caption": "“非常感谢两位老师集训的指导”",
    "w": 345,
    "h": 676
  },
  {
    "id": "math-poster-02",
    "src": "/testimonials/math/full/math-poster-02.webp",
    "thumb": "/testimonials/math/thumb/math-poster-02.webp",
    "subject": "math",
    "subjectLabel": "数学",
    "kind": "poster",
    "kindLabel": "上岸喜报",
    "filterTags": [
      "数学",
      "上岸喜报"
    ],
    "caption": "理科总成绩 265 分",
    "w": 1080,
    "h": 1640
  },
  {
    "id": "liberal-arts-chat-02",
    "src": "/testimonials/liberal-arts/full/liberal-arts-chat-02.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-chat-02.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "文科",
      "学员反馈"
    ],
    "caption": "“老师记得把我名字划掉” · 248 分",
    "w": 1080,
    "h": 2348
  },
  {
    "id": "english-chat-02",
    "src": "/testimonials/english/full/english-chat-02.webp",
    "thumb": "/testimonials/english/thumb/english-chat-02.webp",
    "subject": "english",
    "subjectLabel": "英语",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "英语",
      "学员反馈"
    ],
    "caption": "“中考试卷一样，老师还给我们练过”",
    "w": 626,
    "h": 577
  },
  {
    "id": "math-chat-03",
    "src": "/testimonials/math/full/math-chat-03.webp",
    "thumb": "/testimonials/math/thumb/math-chat-03.webp",
    "subject": "math",
    "subjectLabel": "数学",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "数学",
      "学员反馈"
    ],
    "caption": "数学考了 134 分，感谢老师",
    "w": 593,
    "h": 1500
  },
  {
    "id": "math-chat-04",
    "src": "/testimonials/math/full/math-chat-04.webp",
    "thumb": "/testimonials/math/thumb/math-chat-04.webp",
    "subject": "math",
    "subjectLabel": "数学",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "数学",
      "学员反馈"
    ],
    "caption": "数学第一次 58 分，最后一次 124 分",
    "w": 691,
    "h": 1500
  },
  {
    "id": "math-chat-05",
    "src": "/testimonials/math/full/math-chat-05.webp",
    "thumb": "/testimonials/math/thumb/math-chat-05.webp",
    "subject": "math",
    "subjectLabel": "数学",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "数学",
      "学员反馈"
    ],
    "caption": "“262 分，浙江财经我来也”",
    "w": 1080,
    "h": 2382
  },
  {
    "id": "math-poster-03",
    "src": "/testimonials/math/full/math-poster-03.webp",
    "thumb": "/testimonials/math/thumb/math-poster-03.webp",
    "subject": "math",
    "subjectLabel": "数学",
    "kind": "poster",
    "kindLabel": "上岸喜报",
    "filterTags": [
      "数学",
      "上岸喜报"
    ],
    "caption": "金榜题名 · 浙江财经大学",
    "w": 1080,
    "h": 2157
  },
  {
    "id": "math-chat-06",
    "src": "/testimonials/math/full/math-chat-06.webp",
    "thumb": "/testimonials/math/thumb/math-chat-06.webp",
    "subject": "math",
    "subjectLabel": "数学",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "数学",
      "学员反馈"
    ],
    "caption": "“数学有史以来最高分，多亏了你”",
    "w": 1080,
    "h": 2382
  },
  {
    "id": "math-chat-07",
    "src": "/testimonials/math/full/math-chat-07.webp",
    "thumb": "/testimonials/math/thumb/math-chat-07.webp",
    "subject": "math",
    "subjectLabel": "数学",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "数学",
      "学员反馈"
    ],
    "caption": "“没想到数学能考这么高”",
    "w": 1080,
    "h": 2341
  },
  {
    "id": "math-chat-08",
    "src": "/testimonials/math/full/math-chat-08.webp",
    "thumb": "/testimonials/math/thumb/math-chat-08.webp",
    "subject": "math",
    "subjectLabel": "数学",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "数学",
      "学员反馈"
    ],
    "caption": "数学 124 分，估分还以为只有 100",
    "w": 1080,
    "h": 2341
  },
  {
    "id": "math-chat-09",
    "src": "/testimonials/math/full/math-chat-09.webp",
    "thumb": "/testimonials/math/thumb/math-chat-09.webp",
    "subject": "math",
    "subjectLabel": "数学",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "数学",
      "学员反馈"
    ],
    "caption": "“老师我上了！”坚持终于成功",
    "w": 1080,
    "h": 2341
  },
  {
    "id": "math-poster-04",
    "src": "/testimonials/math/full/math-poster-04.webp",
    "thumb": "/testimonials/math/thumb/math-poster-04.webp",
    "subject": "math",
    "subjectLabel": "数学",
    "kind": "poster",
    "kindLabel": "上岸喜报",
    "filterTags": [
      "数学",
      "上岸喜报"
    ],
    "caption": "金榜题名 · 浙江财经大学",
    "w": 1080,
    "h": 2149
  },
  {
    "id": "math-query-01",
    "src": "/testimonials/math/full/math-query-01.webp",
    "thumb": "/testimonials/math/thumb/math-query-01.webp",
    "subject": "math",
    "subjectLabel": "数学",
    "kind": "query",
    "kindLabel": "成绩喜报",
    "filterTags": [
      "数学",
      "上岸喜报"
    ],
    "caption": "数学 124 · 总分 244（个人信息已隐去）",
    "w": 1080,
    "h": 317
  },
  {
    "id": "math-query-02",
    "src": "/testimonials/math/full/math-query-02.webp",
    "thumb": "/testimonials/math/thumb/math-query-02.webp",
    "subject": "math",
    "subjectLabel": "数学",
    "kind": "query",
    "kindLabel": "成绩喜报",
    "filterTags": [
      "数学",
      "上岸喜报"
    ],
    "caption": "数学 123 · 总分 246（个人信息已隐去）",
    "w": 589,
    "h": 1280
  },
  {
    "id": "math-query-03",
    "src": "/testimonials/math/full/math-query-03.webp",
    "thumb": "/testimonials/math/thumb/math-query-03.webp",
    "subject": "math",
    "subjectLabel": "数学",
    "kind": "query",
    "kindLabel": "成绩喜报",
    "filterTags": [
      "数学",
      "上岸喜报"
    ],
    "caption": "数学 118 · 总分 242（个人信息已隐去）",
    "w": 1080,
    "h": 2341
  },
  {
    "id": "math-query-04",
    "src": "/testimonials/math/full/math-query-04.webp",
    "thumb": "/testimonials/math/thumb/math-query-04.webp",
    "subject": "math",
    "subjectLabel": "数学",
    "kind": "query",
    "kindLabel": "成绩喜报",
    "filterTags": [
      "数学",
      "上岸喜报"
    ],
    "caption": "数学 124 · 总分 236（个人信息已隐去）",
    "w": 1080,
    "h": 1080
  },
  {
    "id": "math-query-05",
    "src": "/testimonials/math/full/math-query-05.webp",
    "thumb": "/testimonials/math/thumb/math-query-05.webp",
    "subject": "math",
    "subjectLabel": "数学",
    "kind": "query",
    "kindLabel": "成绩喜报",
    "filterTags": [
      "数学",
      "上岸喜报"
    ],
    "caption": "数学 134 · 总分 258（个人信息已隐去）",
    "w": 1080,
    "h": 2337
  },
  {
    "id": "liberal-arts-poster-02",
    "src": "/testimonials/liberal-arts/full/liberal-arts-poster-02.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-poster-02.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "poster",
    "kindLabel": "上岸喜报",
    "filterTags": [
      "文科",
      "上岸喜报"
    ],
    "caption": "学员好评 · 真实聊天反馈",
    "w": 1080,
    "h": 1928
  },
  {
    "id": "liberal-arts-chat-03",
    "src": "/testimonials/liberal-arts/full/liberal-arts-chat-03.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-chat-03.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "文科",
      "学员反馈"
    ],
    "caption": "“最离不开的，就是您一路的悉心教导”",
    "w": 1080,
    "h": 2392
  },
  {
    "id": "liberal-arts-chat-04",
    "src": "/testimonials/liberal-arts/full/liberal-arts-chat-04.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-chat-04.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "文科",
      "学员反馈"
    ],
    "caption": "语文 128，全省 31 名上岸",
    "w": 1080,
    "h": 2337
  },
  {
    "id": "liberal-arts-poster-03",
    "src": "/testimonials/liberal-arts/full/liberal-arts-poster-03.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-poster-03.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "poster",
    "kindLabel": "上岸喜报",
    "filterTags": [
      "文科",
      "上岸喜报"
    ],
    "caption": "金榜题名 · 中国计量大学",
    "w": 1080,
    "h": 1958
  },
  {
    "id": "liberal-arts-poster-04",
    "src": "/testimonials/liberal-arts/full/liberal-arts-poster-04.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-poster-04.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "poster",
    "kindLabel": "上岸喜报",
    "filterTags": [
      "文科",
      "上岸喜报"
    ],
    "caption": "金榜题名 · 中国计量大学",
    "w": 1080,
    "h": 1991
  },
  {
    "id": "liberal-arts-poster-05",
    "src": "/testimonials/liberal-arts/full/liberal-arts-poster-05.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-poster-05.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "poster",
    "kindLabel": "上岸喜报",
    "filterTags": [
      "文科",
      "上岸喜报"
    ],
    "caption": "高分达人 · 总分 253",
    "w": 1080,
    "h": 1997
  },
  {
    "id": "liberal-arts-chat-05",
    "src": "/testimonials/liberal-arts/full/liberal-arts-chat-05.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-chat-05.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "文科",
      "学员反馈"
    ],
    "caption": "“老师我考了 127 分！”",
    "w": 1080,
    "h": 2403
  },
  {
    "id": "liberal-arts-moments-02",
    "src": "/testimonials/liberal-arts/full/liberal-arts-moments-02.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-moments-02.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "moments",
    "kindLabel": "朋友圈",
    "filterTags": [
      "文科",
      "朋友圈截图"
    ],
    "caption": "霸气回校 · 朋友圈报喜",
    "w": 1080,
    "h": 2348
  },
  {
    "id": "liberal-arts-chat-06",
    "src": "/testimonials/liberal-arts/full/liberal-arts-chat-06.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-chat-06.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "文科",
      "学员反馈"
    ],
    "caption": "“回母校再发光发热两年”",
    "w": 1080,
    "h": 2348
  },
  {
    "id": "liberal-arts-chat-07",
    "src": "/testimonials/liberal-arts/full/liberal-arts-chat-07.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-chat-07.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "文科",
      "学员反馈"
    ],
    "caption": "上岸浙艺，第一志愿稳稳上",
    "w": 1080,
    "h": 2348
  },
  {
    "id": "liberal-arts-poster-06",
    "src": "/testimonials/liberal-arts/full/liberal-arts-poster-06.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-poster-06.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "poster",
    "kindLabel": "上岸喜报",
    "filterTags": [
      "文科",
      "上岸喜报"
    ],
    "caption": "金榜题名 · 浙江财经大学 · 日语",
    "w": 1080,
    "h": 2146
  },
  {
    "id": "liberal-arts-chat-08",
    "src": "/testimonials/liberal-arts/full/liberal-arts-chat-08.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-chat-08.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "文科",
      "学员反馈"
    ],
    "caption": "“集训时就想转专业到汉语言了”",
    "w": 1080,
    "h": 2337
  },
  {
    "id": "liberal-arts-chat-09",
    "src": "/testimonials/liberal-arts/full/liberal-arts-chat-09.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-chat-09.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "文科",
      "学员反馈"
    ],
    "caption": "全省 38 名，把名著都看了一遍",
    "w": 1080,
    "h": 2337
  },
  {
    "id": "liberal-arts-chat-10",
    "src": "/testimonials/liberal-arts/full/liberal-arts-chat-10.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-chat-10.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "文科",
      "学员反馈"
    ],
    "caption": "“谢谢老师，我哭了”",
    "w": 1080,
    "h": 2128
  },
  {
    "id": "liberal-arts-query-01",
    "src": "/testimonials/liberal-arts/full/liberal-arts-query-01.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-query-01.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "query",
    "kindLabel": "成绩喜报",
    "filterTags": [
      "文科",
      "上岸喜报"
    ],
    "caption": "录取查询 · 音乐学（师范）（个人信息已隐去）",
    "w": 1080,
    "h": 2341
  },
  {
    "id": "liberal-arts-query-02",
    "src": "/testimonials/liberal-arts/full/liberal-arts-query-02.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-query-02.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "query",
    "kindLabel": "成绩喜报",
    "filterTags": [
      "文科",
      "上岸喜报"
    ],
    "caption": "语文 123 · 总分 248（个人信息已隐去）",
    "w": 1080,
    "h": 326
  },
  {
    "id": "liberal-arts-query-03",
    "src": "/testimonials/liberal-arts/full/liberal-arts-query-03.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-query-03.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "query",
    "kindLabel": "成绩喜报",
    "filterTags": [
      "文科",
      "上岸喜报"
    ],
    "caption": "语文 111 · 总分 244（个人信息已隐去）",
    "w": 1080,
    "h": 675
  },
  {
    "id": "liberal-arts-poster-07",
    "src": "/testimonials/liberal-arts/full/liberal-arts-poster-07.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-poster-07.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "poster",
    "kindLabel": "上岸喜报",
    "filterTags": [
      "文科",
      "上岸喜报"
    ],
    "caption": "高分达人 · 总分 250",
    "w": 1080,
    "h": 2052
  },
  {
    "id": "liberal-arts-moments-03",
    "src": "/testimonials/liberal-arts/full/liberal-arts-moments-03.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-moments-03.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "moments",
    "kindLabel": "朋友圈",
    "filterTags": [
      "文科",
      "朋友圈截图"
    ],
    "caption": "致未来 · 朋友圈报喜",
    "w": 1080,
    "h": 2348
  },
  {
    "id": "liberal-arts-chat-11",
    "src": "/testimonials/liberal-arts/full/liberal-arts-chat-11.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-chat-11.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "文科",
      "学员反馈"
    ],
    "caption": "全省前 50 名，被采访报道",
    "w": 1002,
    "h": 2292
  },
  {
    "id": "liberal-arts-chat-12",
    "src": "/testimonials/liberal-arts/full/liberal-arts-chat-12.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-chat-12.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "文科",
      "学员反馈"
    ],
    "caption": "“早开始积累，文科就是耐力战”",
    "w": 1016,
    "h": 2284
  },
  {
    "id": "liberal-arts-chat-13",
    "src": "/testimonials/liberal-arts/full/liberal-arts-chat-13.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-chat-13.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "文科",
      "学员反馈"
    ],
    "caption": "“反反复复地积累，最后如鱼得水”",
    "w": 1002,
    "h": 2292
  },
  {
    "id": "liberal-arts-chat-14",
    "src": "/testimonials/liberal-arts/full/liberal-arts-chat-14.webp",
    "thumb": "/testimonials/liberal-arts/thumb/liberal-arts-chat-14.webp",
    "subject": "liberal",
    "subjectLabel": "文科",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "文科",
      "学员反馈"
    ],
    "caption": "“离不开机构老师的优秀教学质量”",
    "w": 1010,
    "h": 2306
  },
  {
    "id": "english-chat-03",
    "src": "/testimonials/english/full/english-chat-03.webp",
    "thumb": "/testimonials/english/thumb/english-chat-03.webp",
    "subject": "english",
    "subjectLabel": "英语",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "英语",
      "学员反馈"
    ],
    "caption": "“焦虑时您安慰我，考出了理想的成绩”",
    "w": 756,
    "h": 517
  },
  {
    "id": "english-chat-04",
    "src": "/testimonials/english/full/english-chat-04.webp",
    "thumb": "/testimonials/english/thumb/english-chat-04.webp",
    "subject": "english",
    "subjectLabel": "英语",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "英语",
      "学员反馈"
    ],
    "caption": "“您是世界上最好的英语老师”",
    "w": 710,
    "h": 997
  },
  {
    "id": "english-chat-05",
    "src": "/testimonials/english/full/english-chat-05.webp",
    "thumb": "/testimonials/english/thumb/english-chat-05.webp",
    "subject": "english",
    "subjectLabel": "英语",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "英语",
      "学员反馈"
    ],
    "caption": "“四点一阅读、完形，都找到了答案”",
    "w": 336,
    "h": 744
  },
  {
    "id": "english-chat-06",
    "src": "/testimonials/english/full/english-chat-06.webp",
    "thumb": "/testimonials/english/thumb/english-chat-06.webp",
    "subject": "english",
    "subjectLabel": "英语",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "英语",
      "学员反馈"
    ],
    "caption": "“英语阅读很诡异，感觉都能找到答案”",
    "w": 399,
    "h": 520
  },
  {
    "id": "english-moments-02",
    "src": "/testimonials/english/full/english-moments-02.webp",
    "thumb": "/testimonials/english/thumb/english-moments-02.webp",
    "subject": "english",
    "subjectLabel": "英语",
    "kind": "moments",
    "kindLabel": "朋友圈",
    "filterTags": [
      "英语",
      "朋友圈截图"
    ],
    "caption": "英语 110 · 总分 233 · 朋友圈报喜",
    "w": 1080,
    "h": 386
  },
  {
    "id": "english-chat-07",
    "src": "/testimonials/english/full/english-chat-07.webp",
    "thumb": "/testimonials/english/thumb/english-chat-07.webp",
    "subject": "english",
    "subjectLabel": "英语",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "英语",
      "学员反馈"
    ],
    "caption": "上岸报喜，坚持就有结果",
    "w": 547,
    "h": 1176
  },
  {
    "id": "english-chat-08",
    "src": "/testimonials/english/full/english-chat-08.webp",
    "thumb": "/testimonials/english/thumb/english-chat-08.webp",
    "subject": "english",
    "subjectLabel": "英语",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "英语",
      "学员反馈"
    ],
    "caption": "“您是很好很好的班主任，谢谢您”",
    "w": 325,
    "h": 650
  },
  {
    "id": "english-chat-09",
    "src": "/testimonials/english/full/english-chat-09.webp",
    "thumb": "/testimonials/english/thumb/english-chat-09.webp",
    "subject": "english",
    "subjectLabel": "英语",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "英语",
      "学员反馈"
    ],
    "caption": "“其实我是个很脆弱的人……谢谢您”",
    "w": 333,
    "h": 638
  },
  {
    "id": "english-chat-10",
    "src": "/testimonials/english/full/english-chat-10.webp",
    "thumb": "/testimonials/english/thumb/english-chat-10.webp",
    "subject": "english",
    "subjectLabel": "英语",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "英语",
      "学员反馈"
    ],
    "caption": "“我以为是在做梦，考到点上了”",
    "w": 329,
    "h": 706
  },
  {
    "id": "english-chat-11",
    "src": "/testimonials/english/full/english-chat-11.webp",
    "thumb": "/testimonials/english/thumb/english-chat-11.webp",
    "subject": "english",
    "subjectLabel": "英语",
    "kind": "chat",
    "kindLabel": "学员反馈",
    "filterTags": [
      "英语",
      "学员反馈"
    ],
    "caption": "“这次英语很简单，提前 40 分钟做完”",
    "w": 405,
    "h": 788
  },
  {
    "id": "english-query-01",
    "src": "/testimonials/english/full/english-query-01.webp",
    "thumb": "/testimonials/english/thumb/english-query-01.webp",
    "subject": "english",
    "subjectLabel": "英语",
    "kind": "query",
    "kindLabel": "成绩喜报",
    "filterTags": [
      "英语",
      "上岸喜报"
    ],
    "caption": "英语 130 · 总分 254（个人信息已隐去）",
    "w": 698,
    "h": 280
  },
  {
    "id": "english-query-02",
    "src": "/testimonials/english/full/english-query-02.webp",
    "thumb": "/testimonials/english/thumb/english-query-02.webp",
    "subject": "english",
    "subjectLabel": "英语",
    "kind": "query",
    "kindLabel": "成绩喜报",
    "filterTags": [
      "英语",
      "上岸喜报"
    ],
    "caption": "英语 130 · 总分 257（个人信息已隐去）",
    "w": 677,
    "h": 302
  },
  {
    "id": "english-query-03",
    "src": "/testimonials/english/full/english-query-03.webp",
    "thumb": "/testimonials/english/thumb/english-query-03.webp",
    "subject": "english",
    "subjectLabel": "英语",
    "kind": "query",
    "kindLabel": "成绩喜报",
    "filterTags": [
      "英语",
      "上岸喜报"
    ],
    "caption": "英语 122 · 总分 260（个人信息已隐去）",
    "w": 654,
    "h": 300
  }
];

/** 筛选标签的展示顺序（仅展示实际存在的标签） */
export const TESTIMONIAL_FILTERS = [
  "全部",
  "数学",
  "英语",
  "文科",
  "学员反馈",
  "上岸喜报",
  "朋友圈截图",
];
