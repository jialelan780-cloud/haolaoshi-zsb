"use client";

import { useState } from "react";
import type { StudentCase } from "@/data/teachers";

/** 故事型学员案例卡片：默认展示起点/转折/结果，可展开完整带教过程与老师寄语。 */
export default function CaseStoryCard({ caseItem }: { caseItem: StudentCase }) {
  const [open, setOpen] = useState(false);

  const result = caseItem.result ?? {};
  // 顶部结果徽章：取有内容的字段
  const badges = [result.mathScore, result.totalScore, result.admission].filter(
    (v): v is string => Boolean(v && v.trim()),
  );
  const process = caseItem.teachingProcess ?? [];

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* 顶部：结果徽章 + 标题 + 标签 */}
      <div className="border-b border-slate-100 bg-gradient-to-br from-brand-50 to-white p-6 sm:p-8">
        {badges.length > 0 ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b}
                className="inline-flex items-center rounded-full bg-brand-600 px-3 py-1 text-sm font-bold text-white shadow-sm"
              >
                {b}
              </span>
            ))}
          </div>
        ) : null}

        <h3 className="text-xl font-bold leading-relaxed text-slate-900 sm:text-2xl">
          {caseItem.title}
        </h3>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
            {caseItem.studentName}
          </span>
          {(caseItem.tags ?? []).map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-white px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-100"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-6 p-6 sm:p-8">
        {/* 学生起点 */}
        <div>
          <h4 className="mb-2 text-sm font-bold tracking-wide text-slate-400">
            学生起点
          </h4>
          <p className="text-[15px] leading-8 text-slate-700">
            {caseItem.initialSituation}
          </p>
        </div>

        {/* 关键转折 */}
        {caseItem.turningPoint ? (
          <div className="rounded-2xl border-l-4 border-brand-500 bg-brand-50/60 p-5">
            <h4 className="mb-2 text-sm font-bold tracking-wide text-brand-700">
              ⤴ 关键转折
            </h4>
            <p className="text-[15px] leading-8 text-slate-700">
              {caseItem.turningPoint}
            </p>
          </div>
        ) : null}

        {/* 完整故事（可展开） */}
        {open ? (
          <div className="space-y-6">
            {(caseItem.mainProblems ?? []).length > 0 ? (
              <div>
                <h4 className="mb-3 text-sm font-bold tracking-wide text-slate-400">
                  最初面对的问题
                </h4>
                <div className="flex flex-wrap gap-2">
                  {caseItem.mainProblems.map((p) => (
                    <span
                      key={p}
                      className="rounded-lg bg-slate-50 px-3 py-1.5 text-sm text-slate-600 ring-1 ring-slate-200"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {process.length > 0 ? (
              <div>
                <h4 className="mb-3 text-sm font-bold tracking-wide text-slate-400">
                  真实带教过程
                </h4>
                <div className="space-y-4">
                  {process.map((para, i) => (
                    <p key={i} className="text-[15px] leading-8 text-slate-700">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* 最终结果 */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <h4 className="mb-3 text-sm font-bold tracking-wide text-emerald-700">
            最终结果
          </h4>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {result.mathScore ? (
              <div>
                <p className="text-xs text-emerald-600">数学</p>
                <p className="text-2xl font-extrabold text-emerald-800">
                  {result.mathScore}
                </p>
              </div>
            ) : null}
            {result.totalScore ? (
              <div>
                <p className="text-xs text-emerald-600">总分</p>
                <p className="text-2xl font-extrabold text-emerald-800">
                  {result.totalScore}
                </p>
              </div>
            ) : null}
            {result.admission ? (
              <div>
                <p className="text-xs text-emerald-600">上岸方向</p>
                <p className="text-2xl font-extrabold text-emerald-800">
                  {result.admission}
                </p>
              </div>
            ) : null}
          </div>
          {result.improvement ? (
            <p className="mt-3 text-sm font-medium text-emerald-700">
              {result.improvement}
            </p>
          ) : null}
        </div>

        {/* 老师寄语（展开后显示） */}
        {open && caseItem.teacherReflection ? (
          <blockquote className="relative rounded-2xl bg-slate-900 p-6 text-slate-100">
            <span className="absolute left-4 top-2 text-4xl leading-none text-white/20">
              “
            </span>
            <p className="relative pl-4 text-[15px] font-medium leading-8">
              {caseItem.teacherReflection}
            </p>
            <p className="mt-3 pl-4 text-xs text-white/50">—— 老师寄语</p>
          </blockquote>
        ) : null}

        {/* 展开 / 收起按钮 */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 sm:w-auto"
        >
          {open ? "收起完整故事" : "展开完整故事"}
          <span
            className={`transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            ▾
          </span>
        </button>
      </div>
    </article>
  );
}
