import type { Teacher } from "@/data/teachers";
import Section from "./Section";

/** 模块 13：课堂反馈情况（服务质量） */
export default function FeedbackSection({ teacher }: { teacher: Teacher }) {
  return (
    <Section title="课堂反馈情况" subtitle="老师的教学服务质量">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {(teacher.feedback ?? []).map((f) => (
            <div key={f.label} className="text-center">
              <p className="text-2xl font-extrabold text-brand-700">
                {f.value}
                {f.unit ? (
                  <span className="text-base font-bold text-brand-500">
                    {f.unit}
                  </span>
                ) : null}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                {f.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
