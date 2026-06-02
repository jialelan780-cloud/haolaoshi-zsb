"use client";

import { useEffect, useMemo, useState } from "react";
import {
  admissionDisplayCopy as copy,
  type StudentRecord,
  type AdmissionType,
} from "@/data/admissionDetails";
import {
  ALL_YEARS,
  ALL_TEACHERS,
  filterRecords,
  getSummary,
  getYearlyTrend,
  getClassSummaries,
  getSchoolGroups,
  maskStudentName,
} from "@/lib/admissionData";

const TEACHER_COLOR: Record<string, string> = { 乔老师: "#2563eb", 周老师: "#f59e0b" };
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

type YearFilter = number | "all";
type TeacherFilter = string | "all";

const typeTag: Record<AdmissionType, string> = {
  公办本科: "bg-emerald-100 text-emerald-700",
  民办本科: "bg-amber-100 text-amber-700",
  职业本科: "bg-sky-100 text-sky-700",
  未上岸: "bg-slate-100 text-slate-500",
};

function classTypeStyle(t: string) {
  switch (t) {
    case "状元班":
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
  series,
  categories,
  format,
}: {
  series: { name: string; color: string; values: number[] }[];
  categories: string[];
  format: (v: number) => string;
}) {
  const W = 360;
  const H = 200;
  const pad = { l: 46, r: 14, t: 16, b: 28 };
  const all = series.flatMap((s) => s.values);
  let min = Math.min(...all);
  let max = Math.max(...all);
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
      {series.map((s) => (
        <g key={s.name}>
          <polyline
            fill="none"
            stroke={s.color}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
          />
          {s.values.map((v, i) => (
            <g key={i}>
              <circle cx={x(i)} cy={y(v)} r={3.3} fill="#fff" stroke={s.color} strokeWidth={2} />
              <text x={x(i)} y={y(v) - 8} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={s.color}>
                {format(v)}
              </text>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

/* -------------------- 柱状图 -------------------- */
function BarChart({
  series,
  categories,
}: {
  series: { name: string; color: string; values: number[] }[];
  categories: string[];
}) {
  const max = Math.max(...series.flatMap((s) => s.values), 1);
  return (
    <div className="flex items-end justify-around gap-2 px-2 pt-4" style={{ height: 190 }}>
      {categories.map((cat, i) => (
        <div key={cat} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-full w-full items-end justify-center gap-1.5">
            {series.map((s) => (
              <div key={s.name} className="flex w-6 flex-col items-center justify-end sm:w-8">
                <span className="mb-1 text-xs font-bold" style={{ color: s.color }}>
                  {s.values[i]}
                </span>
                <div
                  className="w-full rounded-t-md"
                  style={{ height: `${(s.values[i] / max) * 130}px`, backgroundColor: s.color }}
                />
              </div>
            ))}
          </div>
          <span className="text-xs text-slate-500">{cat}</span>
        </div>
      ))}
    </div>
  );
}

/* -------------------- 学生明细表 -------------------- */
function StudentTable({ rows, showClass = false }: { rows: StudentRecord[]; showClass?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="bg-brand-50 text-left text-brand-900">
            <th className="px-3 py-2.5 font-bold">年份</th>
            <th className="px-3 py-2.5 font-bold">学生</th>
            <th className="px-3 py-2.5 font-bold">数学</th>
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
              <td className={`px-3 py-2 ${r.math130 ? "font-bold text-orange-600" : ""}`}>{r.math}</td>
              <td className="px-3 py-2">{r.english}</td>
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
export default function TeacherAdmissionDataModal() {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState<YearFilter>("all");
  const [teacher, setTeacher] = useState<TeacherFilter>("all");
  const [typeFilter, setTypeFilter] = useState<AdmissionType | "all">("all");
  const [only130, setOnly130] = useState(false);
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

  // 基础筛选（年份 + 老师）：驱动 KPI / 表格 / 院校
  const baseRecords = useMemo(() => filterRecords({ year, teacher }), [year, teacher]);
  const summary = useMemo(() => getSummary(baseRecords), [baseRecords]);

  const chartTeachers = teacher === "all" ? ALL_TEACHERS : [teacher];
  const trends = useMemo(
    () => chartTeachers.map((t) => ({ t, points: getYearlyTrend(t) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [teacher],
  );
  const cats = ALL_YEARS.map(String);
  const mkSeries = (key: "admissionRate" | "publicRate" | "math130Plus" | "avgTotal") =>
    trends.map(({ t, points }) => ({
      name: t,
      color: TEACHER_COLOR[t],
      values: points.map((p) => p[key]),
    }));

  // 老师维度表（按年份×老师）
  const summaryRows = useMemo(() => {
    const rows: { year: number; teacher: string; s: ReturnType<typeof getSummary> }[] = [];
    for (const y of ALL_YEARS) {
      if (year !== "all" && y !== year) continue;
      for (const t of ALL_TEACHERS) {
        if (teacher !== "all" && t !== teacher) continue;
        const recs = filterRecords({ year: y, teacher: t });
        if (recs.length) rows.push({ year: y, teacher: t, s: getSummary(recs) });
      }
    }
    return rows;
  }, [year, teacher]);

  // 院校分组
  const schoolGroups = useMemo(() => getSchoolGroups(baseRecords), [baseRecords]);
  const activeSchoolGroup = schoolGroups.find((g) => g.school === activeSchool) || null;

  // 学生明细：在基础筛选上叠加 类型 / 130+ / 搜索
  const detailRecords = useMemo(() => {
    const kw = search.trim();
    return baseRecords.filter((r) => {
      if (typeFilter !== "all" && r.admissionType !== typeFilter) return false;
      if (only130 && !r.math130) return false;
      if (kw) {
        const hay = `${maskStudentName(r.name)} ${r.school} ${r.className}`;
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
  }, [baseRecords, typeFilter, only130, search]);

  const classGroups = useMemo(() => {
    const cs = getClassSummaries(detailRecords);
    return cs.sort((a, b) => b.year - a.year || a.className.localeCompare(b.className));
  }, [detailRecords]);

  const filtersActive = typeFilter !== "all" || only130 || search.trim() !== "";

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
            {copy.buttonText}
          </span>
          <span className="mt-0.5 block text-xs text-brand-100">{copy.buttonSubText}</span>
        </span>
        <span className="text-white transition group-hover:translate-x-1" aria-hidden="true">→</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-2 backdrop-blur-sm sm:p-6"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={copy.modalTitle}
        >
          <div
            className="my-3 w-full max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-b from-brand-50 to-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-brand-700 px-5 py-4 text-white sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold sm:text-xl">{copy.modalTitle}</h2>
                  <p className="mt-1 text-sm text-brand-100">{copy.trustSubtitle}</p>
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
                {copy.privacyNote}
              </p>
            </div>

            <div className="space-y-8 px-4 py-6 sm:px-7">
              {/* 筛选 */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-8 text-xs font-semibold text-slate-400">年份</span>
                  <Chip active={year === "all"} onClick={() => setYear("all")}>全部</Chip>
                  {ALL_YEARS.map((y) => (
                    <Chip key={y} active={year === y} onClick={() => setYear(y)}>{y}</Chip>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-8 text-xs font-semibold text-slate-400">老师</span>
                  <Chip active={teacher === "all"} onClick={() => setTeacher("all")}>全部</Chip>
                  {ALL_TEACHERS.map((t) => (
                    <Chip key={t} active={teacher === t} onClick={() => setTeacher(t)}>{t}</Chip>
                  ))}
                </div>
              </div>

              {/* KPI */}
              <div>
                <h3 className="mb-3 text-sm font-bold text-slate-700">
                  数据概览
                  <span className="ml-2 font-normal text-slate-400">
                    （{year === "all" ? "2022-2026" : year} · {teacher === "all" ? "全部老师" : teacher}）
                  </span>
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "累计带教学生", value: `${summary.studentCount}`, unit: "人" },
                    { label: "累计上岸人数", value: `${summary.admittedCount}`, unit: "人" },
                    { label: "综合上岸率", value: pct(summary.admissionRate) },
                    { label: "公办本科率", value: pct(summary.publicRate) },
                    { label: "数学 130+ 人数", value: `${summary.math130Plus}`, unit: "人" },
                    { label: "最高数学单科", value: `${summary.maxMath}`, unit: "分" },
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
                <p className="mb-3 text-xs text-slate-400">趋势始终展示五年完整数据；可用上方「老师」筛选只看某位老师。</p>
                <div className="mb-3 flex flex-wrap gap-4">
                  {chartTeachers.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="h-2.5 w-4 rounded-full" style={{ backgroundColor: TEACHER_COLOR[t] }} />
                      {t}
                    </span>
                  ))}
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="mb-1 text-sm font-semibold text-slate-700">升学率变化</p>
                    <LineChart series={mkSeries("admissionRate")} categories={cats} format={pct} />
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="mb-1 text-sm font-semibold text-slate-700">公办率变化</p>
                    <LineChart series={mkSeries("publicRate")} categories={cats} format={pct} />
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="mb-1 text-sm font-semibold text-slate-700">数学 130+ 人数变化</p>
                    <BarChart series={mkSeries("math130Plus")} categories={cats} />
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="mb-1 text-sm font-semibold text-slate-700">平均总分变化</p>
                    <LineChart series={mkSeries("avgTotal")} categories={cats} format={(v) => v.toFixed(0)} />
                  </div>
                </div>
              </div>

              {/* 老师维度表 */}
              <div>
                <h3 className="mb-3 text-sm font-bold text-slate-700">老师维度数据</h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full min-w-[860px] border-collapse text-sm">
                    <thead>
                      <tr className="bg-brand-50 text-left text-brand-900">
                        {["年份", "数学老师", "学生数", "上岸人数", "上岸率", "公办人数", "公办率", "数学130+", "最高数学", "平均总分"].map((h) => (
                          <th key={h} className="whitespace-nowrap px-3 py-3 font-bold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {summaryRows.map(({ year: y, teacher: t, s }) => (
                        <tr
                          key={`${y}-${t}`}
                          className="border-t border-slate-100 text-slate-900 odd:bg-white even:bg-slate-50/70 hover:bg-brand-50/70"
                        >
                          <td className="px-3 py-2.5 font-medium">{y}</td>
                          <td className="whitespace-nowrap px-3 py-2.5 font-semibold">{t}</td>
                          <td className="px-3 py-2.5">{s.studentCount}</td>
                          <td className="px-3 py-2.5">{s.admittedCount}</td>
                          <td className="px-3 py-2.5 font-bold text-brand-600">{pct(s.admissionRate)}</td>
                          <td className="px-3 py-2.5">{s.publicCount}</td>
                          <td className="px-3 py-2.5 font-bold text-emerald-600">{pct(s.publicRate)}</td>
                          <td className="px-3 py-2.5 font-bold text-orange-600">{s.math130Plus} 人</td>
                          <td className="px-3 py-2.5 font-bold text-violet-600">{s.maxMath}</td>
                          <td className="px-3 py-2.5 font-bold text-slate-900">{s.avgTotal.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                </div>

                {activeSchoolGroup ? (
                  <div className="mt-4 rounded-2xl border border-brand-100 bg-white p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold text-slate-900">录取至：{activeSchoolGroup.school}</p>
                      <p className="text-xs text-slate-500">
                        录取 {activeSchoolGroup.count} 人 ｜ 最高分 {activeSchoolGroup.maxTotal} ｜ 平均分 {activeSchoolGroup.avgTotal.toFixed(1)}
                      </p>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                      <table className="w-full min-w-[680px] border-collapse text-sm">
                        <thead>
                          <tr className="bg-brand-50 text-left text-brand-900">
                            {["年份", "学生", "数学", "英语", "总分", "班级", "数学老师", "专科院校", "专科专业"].map((h) => (
                              <th key={h} className="whitespace-nowrap px-3 py-2.5 font-bold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {activeSchoolGroup.students.map((r, i) => (
                            <tr key={i} className="border-t border-slate-100 text-slate-900 odd:bg-white even:bg-slate-50/70 hover:bg-brand-50/70">
                              <td className="px-3 py-2">{r.year}</td>
                              <td className="whitespace-nowrap px-3 py-2 font-semibold">{maskStudentName(r.name)}</td>
                              <td className={`px-3 py-2 ${r.math130 ? "font-bold text-orange-600" : ""}`}>{r.math}</td>
                              <td className="px-3 py-2">{r.english}</td>
                              <td className="px-3 py-2 font-bold">{r.total}</td>
                              <td className="whitespace-nowrap px-3 py-2 text-slate-700">{r.className}</td>
                              <td className="whitespace-nowrap px-3 py-2 text-slate-700">{r.mathTeacher}</td>
                              <td className="whitespace-nowrap px-3 py-2 text-slate-700">{r.college}</td>
                              <td className="whitespace-nowrap px-3 py-2 text-slate-700">{r.major}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
                    {(["公办本科", "民办本科", "职业本科", "未上岸"] as AdmissionType[]).map((t) => (
                      <Chip key={t} active={typeFilter === t} onClick={() => setTypeFilter(t)}>{t}</Chip>
                    ))}
                    <Chip active={only130} onClick={() => setOnly130((v) => !v)}>数学 130+</Chip>
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
                              数学 {c.mathTeacher} · 英语 {c.englishTeacher} · {c.studentCount} 人 · 上岸 {c.admittedCount} 人
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
                            <p className="text-base font-extrabold text-slate-800">{c.math130Count}</p>
                            <p className="text-[11px] text-slate-500">数学 130+</p>
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
                  <li>· 从基础班到冲刺班，再到状元班，学生的学习路径和升学结果都可追踪。</li>
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
