import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import type { Metadata } from "next";
import {
  aboutHero,
  nationalLayout,
  historyTimeline,
  whatIsZsb,
  comparison,
  policyPoints,
  policyDisclaimer,
  policyTimeline,
  provincialLines,
  teacherLinks,
  productPlans,
  priceDisclaimer,
  videoLinks,
} from "@/data/aboutHaolaoshi";
import {
  filterRecords,
  getSummary,
  getSchoolGroups,
  formatPercent,
} from "@/lib/admissionData";

export const metadata: Metadata = {
  title: "好老师专升本机构介绍 · 专注浙江专升本升学",
  description:
    "好老师专升本：专注浙江专升本升学的教育机构。全国布局、本地化教研、分层班型、数据化升学结果与全周期陪伴。",
};

function listAssets(sub: string, exts: string[]): string[] {
  try {
    const dir = path.join(process.cwd(), "public", "haolaoshi-assets", sub);
    return fs.readdirSync(dir).filter((f) => exts.some((e) => f.toLowerCase().endsWith(e))).sort();
  } catch {
    return [];
  }
}
const src = (p: string) => encodeURI(p);

/** 自动查找品牌 Logo：把 logo.png/.svg/.jpg/.webp 放进 public/haolaoshi-assets/ 即可生效 */
function findLogo(): string | null {
  try {
    const dir = path.join(process.cwd(), "public", "haolaoshi-assets");
    const f = fs.readdirSync(dir).find((x) => /^logo\.(png|jpe?g|svg|webp)$/i.test(x));
    return f ? `/haolaoshi-assets/${f}` : null;
  } catch {
    return null;
  }
}

const heroBackground: React.CSSProperties = {
  background:
    "radial-gradient(circle at 82% 18%, rgba(250,204,21,0.18), transparent 30%)," +
    "radial-gradient(circle at 16% 28%, rgba(59,130,246,0.38), transparent 34%)," +
    "linear-gradient(135deg, #1E3A8A 0%, #2563EB 48%, #1D4ED8 100%)",
};
const heroGrid: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)," +
    "linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
  backgroundSize: "44px 44px",
};

export default function AboutHaolaoshiPage() {
  const liRecords = filterRecords({});
  const li = liRecords.length ? getSummary(liRecords) : null;
  const liSchools = getSchoolGroups(liRecords).slice(0, 6).map((g) => g.school);
  const caseImages = listAssets("cases", [".jpg", ".jpeg", ".png", ".webp"]);
  const logo = findLogo();
  const heroStats = nationalLayout.stats;
  const brandTags = ["浙江本地化教研", "分层课程体系", "老师结果可追踪"];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 顶部导航 */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 text-sm">
          <Link href="/" className="font-medium text-slate-500 hover:text-brand-700">← 返回首页</Link>
          <span className="font-bold text-brand-800">好老师专升本机构介绍</span>
        </div>
      </div>

      {/* 1. 顶部封面 Hero（品牌官网级 · 动态版） */}
      <section className="relative overflow-hidden text-white" style={heroBackground}>
        <div className="pointer-events-none absolute inset-0" style={heroGrid} aria-hidden="true" />
        <div className="glow-slow pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-300/15 blur-3xl" aria-hidden="true" />
        <div className="glow-slow pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-white/10 blur-3xl" style={{ animationDelay: "6s" }} aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-20 sm:pt-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* 左：品牌表达 */}
            <div>
              <span className="hero-fade inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium ring-1 ring-white/20 backdrop-blur" style={{ animationDelay: "0.05s" }}>
                浙江专升本 · 升学服务机构
              </span>
              <h1
                className="hero-fade mt-5 text-5xl font-extrabold leading-tight sm:text-6xl"
                style={{ textShadow: "0 2px 14px rgba(0,0,0,0.18)", animationDelay: "0.15s" }}
              >
                {aboutHero.title}
              </h1>
              <p className="hero-fade mt-3 text-xl font-medium text-blue-50 sm:text-2xl" style={{ animationDelay: "0.25s" }}>{aboutHero.subtitle}</p>
              <p className="hero-fade mt-5 max-w-[680px] text-[15px] leading-8 text-white/90" style={{ animationDelay: "0.33s" }}>{aboutHero.description}</p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {aboutHero.tags.map((t, i) => (
                  <span
                    key={t}
                    className="hero-fade rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/20"
                    style={{ animationDelay: `${0.42 + i * 0.07}s` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 右：品牌 Logo 视觉卡片 */}
            <div className="hero-fade relative" style={{ animationDelay: "0.2s" }}>
              <div className="absolute -right-3 -top-3 h-16 w-16 rounded-2xl bg-amber-400/90 shadow-lg" aria-hidden="true" />
              <div className="hero-float group relative overflow-hidden rounded-3xl bg-white/95 p-7 text-slate-800 shadow-2xl ring-1 ring-white/40 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.35)]">
                <span className="absolute left-0 top-8 h-10 w-1.5 rounded-r bg-amber-400 transition group-hover:h-14 group-hover:bg-amber-500" aria-hidden="true" />
                <p className="text-center text-xs font-semibold tracking-widest text-brand-600">专升本全国连锁品牌</p>

                <div className="my-5 flex items-center justify-center">
                  {logo ? (
                    <img src={src(logo)} alt="好老师升学帮 Logo" className="h-20 w-auto max-w-[240px] object-contain" />
                  ) : (
                    <div className="text-center">
                      <p className="text-3xl font-black tracking-tight text-brand-700">好老师<span className="text-amber-500">升学帮</span></p>
                      <p className="mt-1 text-sm font-bold text-slate-500">HAO LAO SHI · 专升本</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {brandTags.map((t) => (
                    <span key={t} className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">{t}</span>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
                  {[heroStats[0], heroStats[1], heroStats[4]].map((s) => (
                    <div key={s.label}>
                      <p className="text-lg font-extrabold text-brand-700">{s.value}</p>
                      <p className="mt-0.5 text-[11px] leading-4 text-slate-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 底部品牌实力条 */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {heroStats.map((s, i) => (
              <div
                key={s.label}
                className="hero-fade rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/15"
                style={{ animationDelay: `${0.55 + i * 0.08}s` }}
              >
                <p className="text-2xl font-extrabold">
                  {s.value.replace("+", "")}
                  <span className="text-amber-300">+</span>
                </p>
                <p className="mt-0.5 text-xs text-white/80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. 全国布局（网页文案 + 全国校区分布图整块） */}
      <SectionShell title={nationalLayout.title} subtitle={nationalLayout.subtitle}>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <p className="text-xs font-semibold tracking-widest text-brand-600">{nationalLayout.profileTitle}</p>
            <p className="mt-3 leading-8 text-slate-700">{nationalLayout.profile}</p>
            <p className="mt-3 text-sm text-slate-500">覆盖全国 20+ 省级区域的教学服务网络，浙江滨江校区专注本地化升本服务。</p>
          </div>
          <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-700 to-brand-600 p-6 text-white shadow-sm">
            <p className="text-xs font-semibold tracking-widest text-brand-100">{nationalLayout.spiritTitle}</p>
            <ul className="mt-4 space-y-3">
              {nationalLayout.spirit.map((s) => (
                <li key={s} className="flex items-center gap-2 text-lg font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 全国校区分布图整块（Geographical Layout + 数据 + 中国地图） */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <img
            src={src(nationalLayout.geoImage)}
            alt="好老师专升本全国校区分布图（Geographical Layout，覆盖 20+ 省级区域、600+ 教学网点）"
            loading="lazy"
            className="mx-auto block w-full max-w-[880px] rounded-xl"
          />
        </div>
      </SectionShell>

      {/* 3. 发展时间线 */}
      <SectionShell title="一路深耕专升本，只做升学这件事">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <ol className="relative border-l-2 border-brand-200">
            {historyTimeline.map((it) => (
              <li key={it.year} className="mb-8 ml-6 last:mb-0">
                <span className="absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 ring-4 ring-white" />
                <p className="text-base font-extrabold text-brand-800">{it.year} 年</p>
                <p className="mt-1.5 text-[15px] leading-8 text-slate-800">{it.content}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {it.tags.map((tg) => (
                    <span key={tg} className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">{tg}</span>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </SectionShell>

      {/* 4. 什么是专升本 */}
      <SectionShell title={whatIsZsb.title}>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {whatIsZsb.paragraphs.map((p, i) => (
            <p key={i} className="leading-8 text-slate-700">{p}</p>
          ))}
          <div className="mt-4 rounded-xl border-l-4 border-brand-500 bg-brand-50 p-4">
            <p className="leading-8 text-brand-800">{whatIsZsb.highlight}</p>
          </div>
        </div>
      </SectionShell>

      {/* 5. 全日制 vs 非全日制对比 */}
      <SectionShell title={comparison.title} subtitle={comparison.subtitle}>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="bg-brand-50 text-left text-brand-900">
                <th className="px-4 py-3 font-bold">对比维度</th>
                <th className="px-4 py-3 font-bold">全日制普通专升本（统招）</th>
                <th className="px-4 py-3 font-bold">非全日制成人专升本</th>
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((r) => (
                <tr key={r.dim} className="border-t border-slate-100 align-top odd:bg-white even:bg-slate-50/70">
                  <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-900">{r.dim}</td>
                  <td className="px-4 py-3 leading-7 text-slate-900">
                    <span className="mr-1 inline-block h-1.5 w-1.5 -translate-y-0.5 rounded-full bg-brand-500" />
                    {r.full}
                  </td>
                  <td className="px-4 py-3 leading-7 text-slate-600">{r.part}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-600 p-6 text-white shadow-sm">
          <p className="text-xs font-semibold tracking-widest text-brand-100">结论</p>
          <p className="mt-2 text-lg font-bold leading-8">{comparison.conclusion}</p>
        </div>
        <p className="mt-3 text-xs leading-6 text-slate-400">{comparison.note}</p>
      </SectionShell>

      {/* 6. 政策介绍 */}
      <SectionShell title="浙江统招专升本政策介绍">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <dl className="grid gap-4 sm:grid-cols-2">
            {policyPoints.map((p) => (
              <div key={p.label} className="rounded-xl bg-slate-50 p-4">
                <dt className="text-sm font-bold text-brand-700">{p.label}</dt>
                <dd className="mt-1 text-[15px] leading-7 text-slate-700">{p.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-6 text-amber-700">{policyDisclaimer}</p>
        </div>
      </SectionShell>

      {/* 7. 备考时间节点 */}
      <SectionShell title="浙江专升本备考时间节点">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {policyTimeline.map((t, i) => (
            <div key={t.stage} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="absolute right-4 top-3 text-3xl font-black text-brand-50">{String(i + 1).padStart(2, "0")}</span>
              <span className="inline-block rounded-lg bg-brand-600 px-3 py-1 text-sm font-bold text-white">{t.stage}</span>
              <p className="relative mt-3 text-[15px] leading-7 text-slate-700">{t.content}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* 8. 2020-2026 省控线 */}
      <SectionShell
        title="2020-2026 浙江专升本各类别省控线"
        subtitle="省控线是进入录取环节的最低控制线，实际院校和专业录取分数通常会高于省控线。"
      >
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="bg-brand-50 text-brand-900">
                <th className="px-4 py-3 text-left font-bold">类别</th>
                {provincialLines.years.map((y) => (
                  <th
                    key={y}
                    className={`px-3 py-3 text-center font-bold ${y === 2026 ? "bg-amber-100 text-amber-700" : ""}`}
                  >
                    {y}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {provincialLines.rows.map((r) => (
                <tr key={r.category} className="border-t border-slate-100 text-slate-900 odd:bg-white even:bg-slate-50/70 hover:bg-brand-50/70">
                  <td className="whitespace-nowrap px-4 py-2.5 font-bold text-slate-900">{r.category}</td>
                  {r.values.map((v, i) => (
                    <td
                      key={i}
                      className={`px-3 py-2.5 text-center ${provincialLines.years[i] === 2026 ? "bg-amber-50 font-bold text-amber-700" : "text-slate-700"}`}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionShell>

      {/* 9. 滨江校区文 / 理科升学数据 */}
      <SectionShell title="滨江校区升学结果，让家长看得见">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-lg bg-brand-600 px-2.5 py-1 text-xs font-bold text-white">理科方向</span>
              <span className="text-xs text-slate-400">数据来自 2022-2026 真实带班结果</span>
            </div>
            {li ? (
              <>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <ResultStat label="综合上岸率" value={formatPercent(li.admissionRate)} color="text-brand-600" />
                  <ResultStat label="公办率" value={formatPercent(li.publicRate)} color="text-emerald-600" />
                  <ResultStat label="数学 130+" value={`${li.math130Plus} 人`} color="text-orange-600" />
                </div>
                <div className="mt-4">
                  <p className="mb-2 text-sm font-semibold text-slate-700">代表录取院校</p>
                  <div className="flex flex-wrap gap-2">
                    {liSchools.map((s) => (
                      <span key={s} className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">{s}</span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-400">数据整理中</p>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-bold text-white">文科方向</span>
              <span className="text-xs text-slate-400">语文 / 英语方向</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center opacity-60">
              <ResultStat label="综合上岸率" value="—" color="text-slate-400" />
              <ResultStat label="公办率" value="—" color="text-slate-400" />
              <ResultStat label="语文/英语高分" value="—" color="text-slate-400" />
            </div>
            <p className="mt-4 rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">文科方向升学数据整理中，将于后续补充。</p>
          </div>
        </div>
        <p className="mt-5 leading-8 text-slate-700">
          我们不只展示口号，更希望把每一年、每个班、每位老师的带班结果做成可查看的数据，让家长看到学生从基础到上岸的真实过程。
        </p>
        <Link href="/teachers/qiao" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800">
          查看老师升学数据 →
        </Link>
      </SectionShell>

      {/* 10. 老师衔接 */}
      <SectionShell title="从机构实力，到每一位老师的真实带班结果">
        <p className="mb-6 leading-8 text-slate-700">
          机构的教学结果，最终要落到每一位老师、每一个班级、每一位学生身上。我们把老师的带班经历、历年升学率、学生分数和录取院校做成可查看的数据，让家长判断老师是否真正有结果。
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teacherLinks.map((t) => (
            <div key={t.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-lg font-bold text-slate-900">{t.name}</p>
              <p className="mt-0.5 text-sm text-brand-600">{t.subject}</p>
              {t.href ? (
                <Link href={t.href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800">
                  查看老师介绍 →
                </Link>
              ) : (
                <span className="mt-4 inline-block text-sm text-slate-400">资料整理中</span>
              )}
            </div>
          ))}
        </div>
      </SectionShell>

      {/* 11. 课程产品（卡片化） */}
      <SectionShell title="适合不同基础学生的升本课程产品">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {productPlans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
                p.recommended ? "border-amber-300 ring-1 ring-amber-200" : "border-slate-200"
              }`}
            >
              {p.recommended ? (
                <span className="absolute right-4 top-4 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white">推荐</span>
              ) : null}
              <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
              <p className="mt-1 text-2xl font-extrabold text-orange-600">{p.price}</p>
              <p className="mt-2 text-sm font-medium text-brand-600">{p.position}</p>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                <span className="font-semibold text-slate-700">适合学生：</span>{p.suitable}
              </p>

              <div className="mt-4 rounded-xl bg-brand-50 p-3">
                <p className="text-xs font-semibold text-brand-700">核心课程体系</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">{p.system}</p>
              </div>

              <ul className="mt-4 flex-1 space-y-2">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-2 text-sm leading-6 text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-4">
                {p.tags.map((tg) => (
                  <span key={tg} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{tg}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-7 text-amber-700">{priceDisclaimer}</p>
      </SectionShell>

      {/* 12. 上岸案例与感谢反馈 */}
      <SectionShell title="在这里上岸的学生，留下了真实反馈">
        <h3 className="mb-3 font-bold text-slate-900">上岸学生案例</h3>
        <p className="mb-4 text-sm text-slate-500">所有学生案例均已做隐私处理，仅展示学习过程和升学结果。</p>
        {caseImages.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {caseImages.map((f) => (
              <div key={f} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img src={src(`/haolaoshi-assets/cases/${f}`)} alt="上岸学生案例（已隐私处理）" loading="lazy" className="w-full" />
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-400">
            学生案例整理中，将于后续补充（把图片放入 public/haolaoshi-assets/cases/ 即可自动展示）。
          </p>
        )}

        <h3 className="mb-3 mt-10 font-bold text-slate-900">机构 / 校区视频</h3>
        <div className="grid gap-5 md:grid-cols-2">
          {videoLinks.map((v) => {
            const isMp4 = /\.mp4(\?|$)/i.test(v.url);
            return (
              <div key={v.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                {!v.url ? (
                  <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-100 px-4 text-center text-sm text-slate-400">
                    外链待填入（在 data/aboutHaolaoshi.ts 的 videoLinks 中填写该视频地址）
                  </div>
                ) : isMp4 ? (
                  <video controls preload="metadata" poster={v.poster ? src(v.poster) : undefined} className="aspect-video w-full rounded-xl bg-black">
                    <source src={src(v.url)} type="video/mp4" />
                    您的浏览器不支持播放该视频。
                  </video>
                ) : (
                  <iframe
                    src={v.url}
                    title={v.title}
                    loading="lazy"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    className="aspect-video w-full rounded-xl border-0 bg-black"
                  />
                )}
                <p className="mt-2 px-1 text-sm font-medium text-slate-700">{v.title}</p>
              </div>
            );
          })}
        </div>
      </SectionShell>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-8 text-center text-xs leading-6 text-slate-400">
          好老师专升本 · 专注浙江专升本升学服务<br />
          具体政策与考试时间以浙江省教育考试院当年正式通知为准；课程价格和活动优惠以校区当期公示为准。
        </div>
      </footer>
    </main>
  );
}

/* ---------- 局部组件 ---------- */
function SectionShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-5xl px-5 py-12">
      <div className="mb-6">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
          <span className="h-7 w-1.5 rounded-full bg-brand-600" />
          {title}
        </h2>
        {subtitle ? <p className="mt-2 pl-[18px] text-sm leading-7 text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function ResultStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl bg-slate-50 py-3">
      <p className={`text-xl font-extrabold ${color}`}>{value}</p>
      <p className="mt-1 text-[11px] text-slate-500">{label}</p>
    </div>
  );
}
