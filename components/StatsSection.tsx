import type { Teacher } from "@/data/teachers";
import Section from "./Section";

/** 模块 8：提分数据 / 上岸数据（数据卡片） */
export default function StatsSection({ teacher }: { teacher: Teacher }) {
  return (
    <Section title="提分数据 · 上岸数据" subtitle="数据来自 2022-2026 历年真实带班结果（学生姓名已隐匿）">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {(teacher.stats ?? []).map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-brand-50 p-5 text-center"
          >
            <p className="text-3xl font-extrabold text-brand-700 sm:text-4xl">
              {s.value}
              {s.unit ? (
                <span className="ml-0.5 text-base font-bold text-brand-500">
                  {s.unit}
                </span>
              ) : null}
            </p>
            <p className="mt-2 text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
