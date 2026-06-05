"use client";

import { useEffect, useMemo, useState } from "react";
import type { LiberalArtsRecord } from "@/data/liberalArtsDetails";
import type { AdmissionType } from "@/data/admissionDetails";
import {
  LA_YEARS,
  filterLARecords,
  getLASummary,
  getLAYearlyTrend,
  getLAClassSummaries,
  getLASchoolGroups,
  maskStudentName,
  type Subject,
} from "@/lib/liberalArtsData";

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

type YearFilter = number | "all";

const typeTag: Record<AdmissionType, string> = {
  公办本科: "bg-emerald-100 text-emerald-700",
  民办本科: "bg-amber-100 text-amber-700",
  职业本科: "bg-sky-100 text-sky-700",
  未上岸: "bg-slate-100 text-slate-500",
};

function classTypeStyle(t: string) {
  switch (t) {
    case "凌云班":
      return { badge: "bg-amber-500 text-white", ring: "border-amber-200", soft: "bg-amber-50" };
    case "冲刺班":
      return { badge: "bg-orange-500 text-white", ring: "border-orange-200", soft: "bg-orange-50" };
    case "基础班":
      return { badge: "bg-emerald-500 text-white", ring: "border-emerald-200", soft: "bg-emerald-50" };
    default:
      return { badge: "bg-sky-500 text-white", ring: "border-sky-200", soft: "bg-sky-50" };
  }
}

/* -------------------- 折线图（纯 SVG） -------------------- */
function LineChart({
  values,
  categories,
  color,
  format,
}: {
  values: number[];
  categories: string[];
  color: string;
  format: (v: number) => string;
}) {
  const W = 360;
  const H = 200;
  const pad = { l: 46, r: 14, t: 16, b: 28 };
  let min = Math.min(...values);
  let max = Math.max(...values);
  const span = max - min || 1;
  min -= span * 0.2;
  max += span * 0.2;
  const x = (i: number) => pad.l + (i / Math.max(categories.length - 1, 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b);
  const grid = [min, (min + max) / 2, max];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" preserveAspectRatio="xMidYMid meet">
      {grid.map((gv, i) => (
        <g key={i}>
          <line x1={pad.l} x2={W - pad.r} y1={y(gv)} y2={y(gv)} stroke="#e2e8f0" />
          <text x={pad.l - 6} y={y(gv) + 3} textAnchor="end" fontSize={9} fill="#94a3b8">
            {format(gv)}
          </text>
        </g>
      ))}
      {categories.map((c, i) => (
        <text key={c} x={x(i)} y={H - 9} textAnchor="middle" fontSize={10} fill="#64748b">
          {c}
        </text>
      ))}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        points={values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
      />
      {values.map((v, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(v)} r={3.3} fill="#fff" stroke={color} strokeWidth={2} />
          <text x={x(i)} y={y(v) - 8} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={color}>
            {format(v)}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* -------------------- 柱状图 -------------------- */
function BarChart({ values, categories, color }: { values: number[]; categories: string[]; color: string }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end justify-around gap-2 px-2 pt-4" style={{ height: 190 }}>
      {categories.map((cat, i) => (
        <div key={cat} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-full w-full items-end justify-center">
            <div className="flex w-8 flex-col items-center justify-end sm:w-10">
              <span className="mb-1 text-xs font-bold" style={{ color }}>
                {values[i]}
              </span>
              <div className="w-full rounded-t-md" style={{ height: `${(values[i] / max) * 130}px`, backgroundColor: color }} />
            </div>
          </div>
          <span className="text-xs text-slate-500">{cat}</span>
        </div>
      ))}
    </div>
  );
}

/* -------------------- 学生明细表（语文 / 英语） -------------------- */
function StudentTable({ rows, showClass = false }: { rows: LiberalArtsRecord[]; showClass?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead>
          <tr className="bg-brand-50 text-left text-brand-900">
            <th className="px-3 py-2.5 font-bold">年份</th>
            <th className="px-3 py-2.5 font-bold">学生</th>
            <th className="px-3 py-2.5 font-bold">语文</th>
            <th className="px-3 py-2.5 font-bold">英语</th>
            <th className="px-3 py-2.5 font-bold">总分</th>
            {showClass ? <th className="whitespace-nowrap px-3 py-2.5 font-bold">班级</th> : null}
            <th className="whitespace-nowrap px-3 py-2.5 font-bold">录取学校</th>
            <th className="whitespace-nowrap px-3 py-2.5 font-bold">录取类型</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-100 text-slate-900 odd:bg-white even:bg-slate-50/70 hover:bg-brand-50/70">
              <td className="px-3 py-2">{r.year}</td>
              <td className="whitespace-nowrap px-3 py-2 font-semibold">{maskStudentName(r.name)}</td>
              <td className={`px-3 py-2 ${r.chinese120 ? "font-bold text-orange-600" : ""}`}>{r.chinese}</td>
              <td className={`px-3 py-2 ${r.english120 ? "font-bold text-orange-600" : ""}`}>{r.english}</td>
              <td className="px-3 py-2 font-bold">{r.total}</td>
              {showClass ? <td className="whitespace-nowrap px-3 py-2 text-slate-700">{r.className}</td> : null}
              <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-800">{r.school}</td>
              <td className="px-3 py-2">
                <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${typeTag[r.admissionType]}`}>
                  {r.admissionType}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ==================== 主组件 ==================== */
export default function LiberalArtsDataModal({
  subject,
  teacherName,
  displayName,
}: {
  subject: Subject;
  teacherName: string;
  displayName: string;
}) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState<YearFilter>("all");
  const [typeFilter, setTypeFilter] = useState<AdmissionType | "all">("all");
  const [only120, setOnly120] = useState(false);
  const [search, setSearch] = useState("");
  const [openClass, setOpenClass] = useState<string | null>(null);
  const [activeSchool, setActiveSchool] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // 基础筛选（年份）：驱动 KPI / 表格 / 院校（始终限定本老师 + 本科目）
  const baseRecords = useMemo(
    () => filterLARecords({ subject, year, teacher: teacherName }),
    [subject, year, teacherName],
  );
  const summary = useMemo(() => getLASummary(baseRecords, subject), [baseRecords, subject]);

  const cats = LA_YEARS.map(String);
  const trend = useMemo(() => getLAYearlyTrend(subject, teacherName), [subject, teacherName]);

  // 院校分组
  const schoolGroups = useMemo(() => getLASchoolGroups(baseRecords), [baseRecords]);
  const activeSchoolGroup = schoolGroups.find((g) => g.school === activeSchool) || null;

  // 学生明细：在基础筛选上叠加 类型 / 120+ / 搜索
  const detailRecords = useMemo(() => {
    const kw = search.trim();
    return baseRecords.filter((r) => {
      if (typeFilter !== "all" && r.admissionType !== typeFilter) return false;
      if (only120 && !(subject === "语文" ? r.chinese120 : r.english120)) return false;
      if (kw) {
        const hay = `${maskStudentName(r.name)} ${r.school} ${r.className}`;
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
  }, [baseRecords, typeFilter, only120, search, subject]);

  const classGroups = useMemo(() => {
    const cs = getLAClassSummaries(detailRecords, subject);
    return cs.sort((a, b) => b.year - a.year || a.className.localeCompare(b.className));
  }, [detailRecords, subject]);

  const filtersActive = typeFilter !== "all" || only120 || search.trim() !== "";
  const color = "#2563eb";

  const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
        active ? "bg-brand-600 text-white shadow-sm" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full items-center justify-between gap-4 rounded-2xl bg-white/10 px-5 py-4 text-left ring-1 ring-white/25 backdrop-blur transition hover:bg-white/20 sm:w-auto"
      >
        <span>
          <span className="flex items-center gap-2 text-base font-bold text-white">
            <span aria-hidden="true">📊</span>
            查看老师升学数据
          </span>
          <span className="mt-0.5 block text-xs text-brand-100">2022-2026 历年带班结果可查看</span>
        </span>
        <span className="text-white transition group-hover:translate-x-1" aria-hidden="true">→</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-2 backdrop-blur-sm sm:p-6"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="历年升学数据"
        >
          <div
            className="my-3 w-full max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-b from-brand-50 to-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-brand-700 px-5 py-4 text-white sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold sm:text-xl">
                    {displayName} · 2022-2026 历年升学数据
                  </h2>
                  <p className="mt-1 text-sm text-brand-100">
                    五年带班成绩持续可追踪，学生分数、录取院校、升学结果均可查看
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="关闭"
                  className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-lg leading-none transition hover:bg-white/30"
                >
                  ✕
                </button>
              </div>
              <p className="mt-2 flex items-start gap-1.5 text-xs text-brand-100">
                <span aria-hidden="true">🔒</span>
                为保护学员隐私，所有学生姓名均已隐匿一个字，仅展示学习成绩、录取院校和升学结果。
              </p>
            </div>

            <div className="space-y-8 px-4 py-6 sm:px-7">
              {/* 年份筛选 */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-8 text-xs font-semibold text-slate-400">年份</span>
                <Chip active={year === "all"} onClick={() => setYear("all")}>全部</Chip>
                {LA_YEARS.map((y) => {
                  const has = filterLARecords({ subject, year: y, teacher: teacherName }).length > 0;
                  if (!has) return null;
                  return (
                    <Chip key={y} active={year === y} onClick={() => setYear(y)}>{y}</Chip>
                  );
                })}
              </div>

              {/* KPI */}
              <div>
                <h3 className="mb-3 text-sm font-bold text-slate-700">
                  数据概览
                  <span className="ml-2 font-normal text-slate-400">
                    （{year === "all" ? "2022-2026" : year} · {displayName} · {subject}）
                  </span>
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "累计带教学生", value: `${summary.studentCount}`, unit: "人" },
                    { label: "累计上岸人数", value: `${summary.admittedCount}`, unit: "人" },
                    { label: "综合上岸率", value: pct(summary.admissionRate) },
                    { label: "公办本科率", value: pct(summary.publicRate) },
                    { label: `${subject} 120+ 人数`, value: `${summary.score120Plus}`, unit: "人" },
                    { label: `最高${subject}单科`, value: `${summary.maxScore}`, unit: "分" },
                    { label: "平均总分", value: summary.avgTotal.toFixed(1) },
                    { label: "代表录取院校", value: `${summary.schoolCount}`, unit: "所" },
                  ].map((k) => (
                    <div key={k.label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                      <p className="text-2xl font-extrabold text-brand-700">
                        {k.value}
                        {k.unit ? <span className="ml-0.5 text-sm font-bold text-brand-500">{k.unit}</span> : null}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{k.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 趋势图 */}
              <div>
                <h3 className="mb-1 text-sm font-bold text-slate-700">历年趋势（2022 → 2026）</h3>
                <p className="mb-3 text-xs text-slate-400">趋势始终展示该老师五年完整数据。</p>
                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="mb-1 text-sm font-semibold text-slate-700">升学率变化</p>
                    <LineChart values={trend.map((p) => p.admissionRate)} categories={cats} color={color} format={pct} />
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="mb-1 text-sm font-semibold text-slate-700">公办率变化</p>
                    <LineChart values={trend.map((p) => p.publicRate)} categories={cats} color={color} format={pct} />
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="mb-1 text-sm font-semibold text-slate-700">{subject} 120+ 人数变化</p>
                    <BarChart values={trend.map((p) => p.score120Plus)} categories={cats} color={color} />
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="mb-1 text-sm font-semibold text-slate-700">平均总分变化</p>
                    <LineChart values={trend.map((p) => p.avgTotal)} categories={cats} color={color} format={(v) => v.toFixed(0)} />
                  </div>
                </div>
              </div>

              {/* 代表录取院校（可点击查看名单） */}
              <div>
                <h3 className="mb-1 text-sm font-bold text-slate-700">代表录取院校</h3>
                <p className="mb-3 text-xs text-slate-400">点击院校查看被该校录取的学生名单（仅含已上岸学生）。</p>
                <div className="flex flex-wrap gap-2">
                  {schoolGroups.map((g) => {
                    const active = g.school === activeSchool;
                    return (
                      <button
                        key={g.school}
                        type="button"
                        onClick={() => setActiveSchool(active ? null : g.school)}
                        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ring-1 transition ${
                          active
                            ? "bg-brand-600 text-white ring-brand-600"
                            : "bg-white text-slate-700 ring-slate-200 hover:bg-brand-50"
                        }`}
                      >
                        {g.school}
                        <span className={`rounded-full px-1.5 text-xs ${active ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>
                          {g.count}
                        </span>
                      </button>
                    );
                  })}
                  {schoolGroups.length === 0 ? (
                    <p className="text-sm text-slate-400">该筛选下暂无已上岸院校记录。</p>
                  ) : null}
                </div>

                {activeSchoolGroup ? (
                  <div className="mt-4 rounded-2xl border border-brand-100 bg-white p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold text-slate-900">录取至：{activeSchoolGroup.school}</p>
                      <p className="text-xs text-slate-500">
                        录取 {activeSchoolGroup.count} 人 ｜ 最高分 {activeSchoolGroup.maxTotal} ｜ 平均分 {activeSchoolGroup.avgTotal.toFixed(1)}
                      </p>
                    </div>
                    <StudentTable rows={activeSchoolGroup.students} showClass />
                  </div>
                ) : null}
              </div>

              {/* 班级 + 学生明细 */}
              <div>
                <h3 className="mb-3 text-sm font-bold text-slate-700">班级与学生明细</h3>

                {/* 搜索 + 明细筛选 */}
                <div className="mb-4 space-y-3">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="搜索 隐匿姓名 / 录取学校 / 班级…"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">类型</span>
                    <Chip active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>全部</Chip>
                    {(["公办本科", "民办本科", "未上岸"] as AdmissionType[]).map((t) => (
                      <Chip key={t} active={typeFilter === t} onClick={() => setTypeFilter(t)}>{t}</Chip>
                    ))}
                    <Chip active={only120} onClick={() => setOnly120((v) => !v)}>{subject} 120+</Chip>
                  </div>
                </div>

                <div className="space-y-3">
                  {classGroups.map((c) => {
                    const st = classTypeStyle(c.classType);
                    const key = `${c.year}|${c.className}`;
                    const expanded = openClass === key || filtersActive;
                    return (
                      <div key={key} className={`rounded-2xl border ${st.ring} ${st.soft} p-4`}>
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-slate-800">
                              <span className="mr-2 text-xs text-slate-400">{c.year}</span>
                              {c.className}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              语文 {c.chineseTeacher} · 英语 {c.englishTeacher} · {c.studentCount} 人 · 上岸 {c.admittedCount} 人
                            </p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${st.badge}`}>{c.classType}</span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
                          <div className="rounded-lg bg-white/70 py-2">
                            <p className="text-base font-extrabold text-brand-700">{pct(c.admissionRate)}</p>
                            <p className="text-[11px] text-slate-500">上岸率</p>
                          </div>
                          <div className="rounded-lg bg-white/70 py-2">
                            <p className="text-base font-extrabold text-emerald-600">{pct(c.publicRate)}</p>
                            <p className="text-[11px] text-slate-500">公办率</p>
                          </div>
                          <div className="rounded-lg bg-white/70 py-2">
                            <p className="text-base font-extrabold text-slate-800">{c.score120Count}</p>
                            <p className="text-[11px] text-slate-500">{subject} 120+</p>
                          </div>
                          <div className="rounded-lg bg-white/70 py-2">
                            <p className="text-base font-extrabold text-slate-800">{c.avgTotal.toFixed(1)}</p>
                            <p className="text-[11px] text-slate-500">平均分</p>
                          </div>
                        </div>

                        {!filtersActive ? (
                          <button
                            type="button"
                            onClick={() => setOpenClass(expanded ? null : key)}
                            className="mt-3 text-sm font-semibold text-brand-700 hover:text-brand-800"
                          >
                            {expanded ? "收起本班学生明细 ▲" : "查看本班学生明细 ▾"}
                          </button>
                        ) : null}

                        {expanded ? (
                          <div className="mt-3">
                            <StudentTable rows={c.students} />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                  {classGroups.length === 0 ? (
                    <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-400">没有符合条件的记录</p>
                  ) : null}
                </div>
              </div>

              {/* 信任感文案 */}
              <div className="rounded-2xl bg-brand-700 p-6 text-brand-50">
                <ul className="space-y-2 text-sm leading-relaxed">
                  <li>· 不是只看结果，而是能看到每一年每个班的成长变化。</li>
                  <li>· 从基础班到冲刺班，再到凌云班，学生的学习路径和升学结果都可追踪。</li>
                  <li>· 我们用真实带班数据，帮助家长判断老师是否真正有结果。</li>
                </ul>
              </div>

              <p className="text-center text-xs text-slate-400">
                数据为 2022-2026 历年带班结果汇总，学生姓名已隐匿，仅展示学习成果与录取去向。
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
