// 学员感谢 / 真实反馈 —— 图片素材处理脚本（一次性本地工具）
//
// 作用：
//   1. 从微信导出的原始截图目录读取素材（路径见 SRC_BASE，可用环境变量覆盖）
//   2. 按"分类 / 类型"重命名为干净的 ASCII 文件名
//   3. 对含敏感信息（身份证号 / 准考证号 / 校验码 / 姓名）的截图做遮挡（实心条 / 模糊）
//   4. 生成网页用的压缩大图（webp, 宽≤1080）+ 缩略图（webp, 宽≤540）
//   5. 生成数据映射文件 lib/testimonials.ts
//
// 运行：node scripts/process-testimonials.mjs
// 依赖：sharp（本地已通过 npm install sharp --no-save 安装；不计入 package.json）
//
// 说明：原始微信截图不会被修改；本脚本只读取它们并在 public/ 下生成处理后的副本。

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC_BASE =
  process.env.TESTIMONIALS_SRC ||
  "c:/Users/Administrator/Documents/xwechat_files/wxid_yvwud6le6qfm12_b24d/msg/file/2026-06";

const ROOT = path.resolve(process.cwd());
const OUT_PUBLIC = path.join(ROOT, "public", "testimonials");
const OUT_MANIFEST = path.join(ROOT, "lib", "testimonials.ts");

// 分类 → 目录名 / 中文标签
const SUBJECTS = {
  math: { dir: "math", label: "数学" },
  english: { dir: "english", label: "英语" },
  liberal: { dir: "liberal-arts", label: "文科" },
};
// 类型 → 卡片角标文案 / 用于筛选的标签
const KINDS = {
  chat: { badge: "学员反馈", filter: "学员反馈" },
  poster: { badge: "上岸喜报", filter: "上岸喜报" },
  query: { badge: "成绩喜报", filter: "上岸喜报" },
  moments: { badge: "朋友圈", filter: "朋友圈截图" },
};

// 遮挡区域用归一化坐标 [x, y, w, h]（占整图宽/高的比例），mode: "solid"（实心条，保证遮死）| "blur"（模糊）
// chat 类型默认遮挡顶部姓名条；poster 不遮挡；query / moments 按图指定。
const TOPBAR = [0, 0, 1, 0.1, "blur"];

// 素材清单（已人工分类 + 隐私标注 + 文案）。f = 相对 SRC_BASE 的路径。
const ITEMS = [
  // ====== 开头：跨科目 / 跨类型穿插，保证默认前 12 张视觉丰富 ======
  { f: "数学/周老师学员/周雪/ae79143837a8c79a0e60bb6a6d588ca9.jpg", subject: "math", kind: "chat", caption: "“我哭了，太幸运能遇到你” · 数学逆袭上岸" },
  { f: "数学/乔老师学员/占舒茹/3f896ac6b044ae4ce5622169d075e2dc.png", subject: "math", kind: "poster", caption: "理科总成绩 262 分" },
  { f: "文科案例/文科案例/王池一阳/感谢/73dcc3027a6ca299dfdf129d265a3dbc.jpg", subject: "liberal", kind: "chat", caption: "“遇到这样的好老师，是我最大的幸运”" },
  { f: "英语/郭岚/录取及成绩/77db63ef789abef021e6bbad6c8ced90.jpg", subject: "english", kind: "moments", caption: "“不求高歌猛进，但求百折不挠”", redact: [[0, 0, 1, 0.2, "blur"], [0.1, 0.42, 0.56, 0.46, "solid"]] },
  { f: "文科案例/文科案例/李依璐/成绩及录取/2bf910e71b4f91f639ad7bfae0a1432c.jpg", subject: "liberal", kind: "poster", caption: "高分达人 · 总分 258" },
  { f: "数学/乔老师学员/徐耀威/b9b60f05c825393605c49ed0daa5918d.jpg", subject: "math", kind: "chat", caption: "数学从 30 多分逆袭到 123 分" },
  { f: "文科案例/文科案例/王茹颖/成绩及录取/e419cbb4a6d0e4b001a19c0bcbc7e64c.jpg", subject: "liberal", kind: "moments", caption: "250 分上岸杭电 · 朋友圈报喜", redact: [[0, 0, 1, 0.26, "solid"]] },
  { f: "英语/孟德丽/感谢/dd05760eb56dc02166bfae2529bd4b56.jpg", subject: "english", kind: "chat", caption: "“非常感谢两位老师集训的指导”" },
  { f: "数学/周老师学员/郁桓/3c1f7cb104795b42b553a9a40ec358dd.jpg", subject: "math", kind: "poster", caption: "理科总成绩 265 分" },
  { f: "文科案例/文科案例/何诗涵/录取及成绩/df61055fecba6a760437f9682315b3c6.jpg", subject: "liberal", kind: "chat", caption: "“老师记得把我名字划掉” · 248 分", redact: [[0, 0, 1, 0.12, "blur"], [0.12, 0.55, 0.56, 0.17, "solid"]] },
  { f: "英语/黄恬恬/感谢/d596c68a8e3b85afc7265432a1503fb4.png", subject: "english", kind: "chat", caption: "“中考试卷一样，老师还给我们练过”" },
  { f: "数学/周老师学员/张一佳/a2e62d8c168fba122bad621539a82a14.jpg", subject: "math", kind: "chat", caption: "数学考了 134 分，感谢老师" },

  // ====== 数学 ======
  { f: "数学/乔老师学员/冯飞扬/8eb74b7024e5f953604af3e39b9404c3.jpg", subject: "math", kind: "chat", caption: "数学第一次 58 分，最后一次 124 分" },
  { f: "数学/乔老师学员/占舒茹/45ef83d6c8f1f7358236fc1e2bc68a26.jpg", subject: "math", kind: "chat", caption: "“262 分，浙江财经我来也”" },
  { f: "数学/乔老师学员/占舒茹/21.jpg", subject: "math", kind: "poster", caption: "金榜题名 · 浙江财经大学" },
  { f: "数学/乔老师学员/裴梦然/be623d97985c16b813ba6ed323e62a4b.jpg", subject: "math", kind: "chat", caption: "“数学有史以来最高分，多亏了你”" },
  { f: "数学/周老师学员/尹丹/953ef6019aea1593ee619219abf06be4.jpg", subject: "math", kind: "chat", caption: "“没想到数学能考这么高”" },
  { f: "数学/周老师学员/王晓颖/61195c8ded89dd43b96bba294edd8168.jpg", subject: "math", kind: "chat", caption: "数学 124 分，估分还以为只有 100" },
  { f: "数学/周老师学员/郁桓/7c1cd877b2fd481fa632e55a35564cbf.jpg", subject: "math", kind: "chat", caption: "“老师我上了！”坚持终于成功" },
  { f: "数学/周老师学员/郁桓/7c2cadb83fb9d79dbff274ecf19c9f35.jpg", subject: "math", kind: "poster", caption: "金榜题名 · 浙江财经大学" },
  // 数学 · 查分截图（个人信息已遮挡）
  { f: "数学/乔老师学员/冯飞扬/95edd28c634545a1f9d7f022fa6af59f.jpg", subject: "math", kind: "query", caption: "数学 124 · 总分 244（个人信息已隐去）", redact: [[0.06, 0.08, 0.47, 0.3, "solid"], [0.73, 0.0, 0.27, 0.08, "solid"]] },
  { f: "数学/乔老师学员/徐耀威/b33080f9e54735125a3f884c1a9bf9f1.jpg", subject: "math", kind: "query", caption: "数学 123 · 总分 246（个人信息已隐去）", redact: [[0.0, 0.1, 0.62, 0.1, "solid"], [0.68, 0.05, 0.32, 0.05, "solid"]] },
  { f: "数学/乔老师学员/裴梦然/d04125cf3fe98b4516668a2b63ec285a.jpg", subject: "math", kind: "query", caption: "数学 118 · 总分 242（个人信息已隐去）", redact: [[0.0, 0.0, 0.56, 0.26, "solid"], [0.0, 0.26, 0.47, 0.11, "solid"]] },
  { f: "数学/周老师学员/周雪/e41aa7218f90feb89f8c65be46befeca.jpg", subject: "math", kind: "query", caption: "数学 124 · 总分 236（个人信息已隐去）", redact: [[0.0, 0.1, 0.46, 0.26, "solid"]] },
  { f: "数学/周老师学员/张一佳/e1c2d46c282f2ea5fa771ba4e1e0d01e.jpg", subject: "math", kind: "query", caption: "数学 134 · 总分 258（个人信息已隐去）", redact: [[0.04, 0.14, 0.57, 0.09, "solid"], [0.55, 0.04, 0.45, 0.055, "solid"]] },
  // 王晓颖查分截图与周雪查分截图为同一张（成绩 124/236、位次 5-006727 完全一致），去重移除。

  // ====== 文科 ======
  { f: "文科案例/文科案例/何诗涵/感谢/a5a87b6eec44b13caa72867a055b9b14.jpg", subject: "liberal", kind: "poster", caption: "学员好评 · 真实聊天反馈" },
  { f: "文科案例/文科案例/张为杰/感谢/ea279c00f871659f67d7ab3f6ea53f9d.png", subject: "liberal", kind: "chat", caption: "“最离不开的，就是您一路的悉心教导”" },
  { f: "文科案例/文科案例/李依璐/感谢/913a4f88f87a337568692f9a58d26775.png", subject: "liberal", kind: "chat", caption: "语文 128，全省 31 名上岸" },
  { f: "文科案例/文科案例/李依璐/成绩及录取/e27e26001349b6b88bd9345b2e766e93.jpg", subject: "liberal", kind: "poster", caption: "金榜题名 · 中国计量大学" },
  { f: "文科案例/文科案例/洪祯遥/录取及成绩/4ae15bdcddcb5beb763f07e1f5447c68.jpg", subject: "liberal", kind: "poster", caption: "金榜题名 · 中国计量大学" },
  { f: "文科案例/文科案例/洪祯遥/录取及成绩/a2c89710945b90012201d218c9147717.jpg", subject: "liberal", kind: "poster", caption: "高分达人 · 总分 253" },
  { f: "文科案例/文科案例/洪祯遥/感谢/c7c3692bb35d265ea1d2a6a7f5c48e4c.jpg", subject: "liberal", kind: "chat", caption: "“老师我考了 127 分！”" },
  { f: "文科案例/文科案例/王彤彤/录取及成绩/b5b59eb9714067379bb64a9e6181eee1.png", subject: "liberal", kind: "moments", caption: "霸气回校 · 朋友圈报喜", redact: [[0, 0, 1, 0.21, "solid"], [0.06, 0.235, 0.5, 0.065, "solid"]] },
  { f: "文科案例/文科案例/王彤彤/感谢/90b1eeaf40f35c147023c4dc27a4f4c5.png", subject: "liberal", kind: "chat", caption: "“回母校再发光发热两年”" },
  { f: "文科案例/文科案例/王彤彤/感谢/aebfee4fa73be4ecf7c0276cc6f4ad4a.png", subject: "liberal", kind: "chat", caption: "上岸浙艺，第一志愿稳稳上" },
  { f: "文科案例/文科案例/王池一阳/成绩及录取/7a5cc924c7318ddbe3e971c86b263102.jpg", subject: "liberal", kind: "poster", caption: "金榜题名 · 浙江财经大学 · 日语" },
  { f: "文科案例/文科案例/王茹颖/感谢/2bfbe23c3208cb385b08397c9422e5f8.png", subject: "liberal", kind: "chat", caption: "“集训时就想转专业到汉语言了”" },
  { f: "文科案例/文科案例/王茹颖/感谢/79e5bbb2c1ac66d6af17495ffa2e083e.png", subject: "liberal", kind: "chat", caption: "全省 38 名，把名著都看了一遍" },
  { f: "文科案例/文科案例/胡雅楠/感谢/0882dda8bbe3e746eb521ac7d36665a9.jpg", subject: "liberal", kind: "chat", caption: "“谢谢老师，我哭了”" },
  { f: "文科案例/文科案例/胡雅楠/录取及成绩/9c5f0fcdd988c4372d5b76bddae3cbe9.jpg", subject: "liberal", kind: "query", caption: "录取查询 · 音乐学（师范）（个人信息已隐去）", redact: [[0.27, 0.395, 0.40, 0.105, "solid"]] },
  { f: "文科案例/文科案例/何诗涵/录取及成绩/da3f64f12c74aaba35184c137cefbdad.jpg", subject: "liberal", kind: "query", caption: "语文 123 · 总分 248（个人信息已隐去）", redact: [[0.02, 0.08, 0.57, 0.32, "solid"]] },
  { f: "文科案例/文科案例/张为杰/录取及成绩/98d9a15d8c91ae69b6613181cc32fa4b.jpg", subject: "liberal", kind: "query", caption: "语文 111 · 总分 244（个人信息已隐去）", redact: [[0.2, 0.26, 0.12, 0.11, "solid"], [0.84, 0.1, 0.16, 0.05, "solid"]] },
  { f: "文科案例/文科案例/郭岚/录取及成绩/2b0a8e4aa90326643b85d77ddebb2e77.jpg", subject: "liberal", kind: "poster", caption: "高分达人 · 总分 250" },
  { f: "文科案例/文科案例/郭岚/录取及成绩/70ec166bb7d3176cc7e56b784e8c267a.jpg", subject: "liberal", kind: "moments", caption: "致未来 · 朋友圈报喜", redact: [[0, 0.08, 1, 0.27, "solid"]] },
  { f: "文科案例/文科案例/郭岚/感谢/16a585247812d46dc3ef19f1e50cd4dc.jpg", subject: "liberal", kind: "chat", caption: "全省前 50 名，被采访报道" },
  { f: "文科案例/文科案例/郭岚/感谢/788dba8ba0103e9718879510e5414ce9.jpg", subject: "liberal", kind: "chat", caption: "“早开始积累，文科就是耐力战”" },
  { f: "文科案例/文科案例/郭岚/感谢/a07996f3d94c84e26015f514d4fbf8c3.jpg", subject: "liberal", kind: "chat", caption: "“反反复复地积累，最后如鱼得水”" },
  { f: "文科案例/文科案例/郭岚/感谢/d7bc36c582aef97e1f3730375a491f4b.jpg", subject: "liberal", kind: "chat", caption: "“离不开机构老师的优秀教学质量”" },

  // ====== 英语 ======
  { f: "英语/刘向丽/感谢/9f9a090cd7e6f77311147d7c4ae4a79a.png", subject: "english", kind: "chat", caption: "“焦虑时您安慰我，考出了理想的成绩”" },
  { f: "英语/徐炜煜/感谢/d37a4de85faccc138b9327eeba9c69d5.png", subject: "english", kind: "chat", caption: "“您是世界上最好的英语老师”" },
  { f: "英语/李依璐/感谢/6dbed62c8334924d3d188466bb2a6ab7.jpg", subject: "english", kind: "chat", caption: "“四点一阅读、完形，都找到了答案”" },
  { f: "英语/洪祯遥/感谢/76bce60a9fede606958ab1a08407f6ad.png", subject: "english", kind: "chat", caption: "“英语阅读很诡异，感觉都能找到答案”" },
  { f: "英语/王彤彤/录取及成绩/2cec1c37ba70770b4d66de7a5d4f9c20.jpg", subject: "english", kind: "moments", caption: "英语 110 · 总分 233 · 朋友圈报喜", redact: [[0, 0, 1, 0.28, "solid"], [0.1, 0.46, 0.62, 0.42, "solid"]] },
  { f: "英语/王彤彤/感谢/b5cc2fbda714fecc885d072ce7221fd9.png", subject: "english", kind: "chat", caption: "上岸报喜，坚持就有结果" },
  { f: "英语/王茹颖/感谢/53762aff468cf9bf9bd8eb6939abc4a0.jpg", subject: "english", kind: "chat", caption: "“您是很好很好的班主任，谢谢您”" },
  { f: "英语/王茹颖/感谢/a32f10055752f4de37bdbb424ecefd6b.jpg", subject: "english", kind: "chat", caption: "“其实我是个很脆弱的人……谢谢您”" },
  { f: "英语/胡雅楠/感谢/24d8430fc3f25ca2df1108ff04cdd5f0.jpg", subject: "english", kind: "chat", caption: "“我以为是在做梦，考到点上了”" },
  { f: "英语/郭岚/感谢/6473c28bbc739503143c1ea9a35ad007.jpg", subject: "english", kind: "chat", caption: "“这次英语很简单，提前 40 分钟做完”" },
  { f: "英语/刘向丽/成绩及录取/033aea757db7d7108979e06358147b6c.png", subject: "english", kind: "query", caption: "英语 130 · 总分 254（个人信息已隐去）", redact: [[0.0, 0.0, 0.53, 1.0, "solid"]] },
  { f: "英语/孟德丽/录取及成绩/729cc9bae8f6ae334ff7baab38bddd5d.png", subject: "english", kind: "query", caption: "英语 130 · 总分 257（个人信息已隐去）", redact: [[0.0, 0.04, 0.6, 0.42, "solid"]] },
  { f: "英语/黄恬恬/录取及成绩/3b51771af356acb008835ccb9a8adce7.png", subject: "english", kind: "query", caption: "英语 122 · 总分 260（个人信息已隐去）", redact: [[0.0, 0.08, 0.6, 0.45, "solid"], [0.7, 0.0, 0.3, 0.07, "solid"]] },
];

const SOLID_COLOR = { r: 15, g: 23, b: 42, alpha: 1 }; // slate-900

function clampRect(x, y, w, h, W, H) {
  let left = Math.round(x * W);
  let top = Math.round(y * H);
  let width = Math.round(w * W);
  let height = Math.round(h * H);
  left = Math.max(0, Math.min(left, W - 1));
  top = Math.max(0, Math.min(top, H - 1));
  width = Math.max(1, Math.min(width, W - left));
  height = Math.max(1, Math.min(height, H - top));
  return { left, top, width, height };
}

async function buildRedactionOverlays(baseBuf, W, H, rects) {
  const overlays = [];
  for (const [x, y, w, h, mode] of rects) {
    const { left, top, width, height } = clampRect(x, y, w, h, W, H);
    if (mode === "blur") {
      const region = await sharp(baseBuf)
        .extract({ left, top, width, height })
        .blur(Math.max(12, Math.round(width * 0.08)))
        .toBuffer();
      overlays.push({ input: region, left, top });
    } else {
      const bar = await sharp({
        create: { width, height, channels: 4, background: SOLID_COLOR },
      })
        .png()
        .toBuffer();
      overlays.push({ input: bar, left, top });
    }
  }
  return overlays;
}

async function run() {
  const counters = {};
  const manifest = [];

  for (const item of ITEMS) {
    const srcPath = path.join(SRC_BASE, item.f);
    if (!fs.existsSync(srcPath)) {
      console.warn("⚠️  缺失源文件，跳过：", item.f);
      continue;
    }
    const subj = SUBJECTS[item.subject];
    const kindKey = `${item.subject}-${item.kind}`;
    counters[kindKey] = (counters[kindKey] || 0) + 1;
    const idx = String(counters[kindKey]).padStart(2, "0");
    const name = `${subj.dir}-${item.kind}-${idx}`;

    const fullDir = path.join(OUT_PUBLIC, subj.dir, "full");
    const thumbDir = path.join(OUT_PUBLIC, subj.dir, "thumb");
    fs.mkdirSync(fullDir, { recursive: true });
    fs.mkdirSync(thumbDir, { recursive: true });

    // 读取并按 EXIF 旋转校正
    const baseBuf = await sharp(srcPath).rotate().toBuffer();
    const meta = await sharp(baseBuf).metadata();
    const W = meta.width;
    const H = meta.height;

    // 遮挡：chat 默认遮顶部姓名条；poster 不遮；其余按 item.redact
    let rects = item.redact;
    if (!rects) rects = item.kind === "chat" ? [TOPBAR] : [];
    const overlays = rects.length
      ? await buildRedactionOverlays(baseBuf, W, H, rects)
      : [];

    const redacted = overlays.length
      ? await sharp(baseBuf).composite(overlays).toBuffer()
      : baseBuf;

    // 大图（点击放大用）
    const fullOut = path.join(fullDir, `${name}.webp`);
    const fullInfo = await sharp(redacted)
      .resize({ width: 1080, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(fullOut);

    // 缩略图（网格用）
    const thumbOut = path.join(thumbDir, `${name}.webp`);
    await sharp(redacted)
      .resize({ width: 540, withoutEnlargement: true })
      .webp({ quality: 74 })
      .toFile(thumbOut);

    manifest.push({
      id: name,
      src: `/testimonials/${subj.dir}/full/${name}.webp`,
      thumb: `/testimonials/${subj.dir}/thumb/${name}.webp`,
      subject: item.subject,
      subjectLabel: subj.label,
      kind: item.kind,
      kindLabel: KINDS[item.kind].badge,
      filterTags: [subj.label, KINDS[item.kind].filter],
      caption: item.caption,
      w: fullInfo.width,
      h: fullInfo.height,
    });

    console.log(`✓ ${name}  (${W}x${H} → ${fullInfo.width}x${fullInfo.height})  ${item.f}`);
  }

  // 生成 lib/testimonials.ts
  const header = `// 本文件由 scripts/process-testimonials.mjs 自动生成，请勿手动编辑。
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

export const testimonials: Testimonial[] = ${JSON.stringify(manifest, null, 2)};

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
`;
  fs.writeFileSync(OUT_MANIFEST, header, "utf8");
  console.log(`\n生成 ${manifest.length} 张，清单写入 ${path.relative(ROOT, OUT_MANIFEST)}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
