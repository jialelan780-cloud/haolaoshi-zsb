"use client";

import { useMemo, useState } from "react";
import Section from "./Section";
import {
  filterLARecords,
  getLASchoolGroups,
  maskStudentName,
  type Subject,
} from "@/lib/liberalArtsData";
import type { AdmissionType } from "@/data/admissionDetails";

const typeTag: Record<AdmissionType, string> = {
  公办本科: "bg-emerald-100 text-emerald-700",
  民办本科: "bg-amber-100 text-amber-700",
  职业本科: "bg-sky-100 text-sky-700",
  未上岸: "bg-slate-100 text-slate-500",
};

/**
 * 文科代表录取院校：从 2022-2026 真实录取数据动态统计（仅已上岸学生）。
 * 点击院校可展开被该校录取的学生名单（学生姓名已隐匿）。
 */
export default function LiberalArtsSchools({
  subject,
  teacherName,
}: {
  subject: Subject;
  teacherName: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const groups = useMemo(
    () => getLASchoolGroups(filterLARecords({ subject, teacher: teacherName })),
    [subject, teacherName],
  );

  if (groups.length === 0) return null;

  const TOP = 18;
  const shown = showAll ? groups : groups.slice(0, TOP);
  const activeGroup = groups.find((g) => g.school === active) || null;

  return (
    <Section
      title="代表录取院校"
      subtitle="2022-2026 学员实际录取院校，点击院校可查看被录取的学生名单（学生姓名已隐匿）"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap gap-2.5">
          {shown.map((g) => {
            const on = g.school === active;
            return (
              <button
                key={g.school}
                type="button"
                onClick={() => setActive(on ? null : g.school)}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium ring-1 transition ${
                  on
                    ? "bg-brand-600 text-white ring-brand-600"
                    : "bg-brand-50 text-brand-800 ring-brand-100 hover:bg-brand-100"
                }`}
              >
                {g.school}
                <span
                  className={`rounded-full px-1.5 text-xs ${
                    on ? "bg-white/25" : "bg-white text-brand-600"
                  }`}
                >
                  {g.count}
                </span>
              </button>
            );
          })}
        </div>

        {groups.length > TOP ? (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="mt-4 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            {showAll ? "收起" : `查看全部 ${groups.length} 所院校 ▾`}
          </button>
        ) : null}

        {activeGroup ? (
          <div className="mt-5 rounded-2xl border border-brand-100 bg-brand-50/40 p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-slate-900">录取至：{activeGroup.school}</p>
              <p className="text-xs text-slate-500">
                录取 {activeGroup.count} 人 ｜ 最高分 {activeGroup.maxTotal} ｜ 平均分{" "}
                {activeGroup.avgTotal.toFixed(1)}
              </p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-[620px] border-collapse text-sm">
                <thead>
                  <tr className="bg-brand-50 text-left text-brand-900">
                    {["年份", "学生", "语文", "英语", "总分", "班级", "专科院校", "录取类型"].map((h) => (
                      <th key={h} className="whitespace-nowrap px-3 py-2.5 font-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeGroup.students.map((r, i) => (
                    <tr key={i} className="border-t border-slate-100 text-slate-900 odd:bg-white even:bg-slate-50/70 hover:bg-brand-50/70">
                      <td className="px-3 py-2">{r.year}</td>
                      <td className="whitespace-nowrap px-3 py-2 font-semibold">
                        {maskStudentName(r.name)}
                      </td>
                      <td className={`px-3 py-2 ${r.chinese120 ? "font-bold text-orange-600" : ""}`}>{r.chinese}</td>
                      <td className={`px-3 py-2 ${r.english120 ? "font-bold text-orange-600" : ""}`}>{r.english}</td>
                      <td className="px-3 py-2 font-bold">{r.total}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-700">{r.className}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-700">{r.college}</td>
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
          </div>
        ) : null}

        <p className="mt-4 text-xs text-slate-400">
          * 仅统计已上岸学生，按录取人数排序；数据随升学明细自动更新。
        </p>
      </div>
    </Section>
  );
}
