import type { Teacher } from "@/data/teachers";
import Section from "./Section";

/** 模块 4：教学风格 */
export default function TeachingStyle({ teacher }: { teacher: Teacher }) {
  const teachingStyle = teacher.teachingStyle ?? {
    features: [],
    suitableForWeak: false,
    focusFormula: false,
    focusPatterns: false,
    focusExamSkills: false,
    hasReview: false,
    description: "",
  };

  const tags = [
    { label: "适合基础薄弱学生", on: teachingStyle.suitableForWeak },
    { label: "注重公式理解", on: teachingStyle.focusFormula },
    { label: "注重题型归纳", on: teachingStyle.focusPatterns },
    { label: "注重应试技巧", on: teachingStyle.focusExamSkills },
    { label: "课后答疑 + 错题复盘", on: teachingStyle.hasReview },
  ];

  return (
    <Section title="教学风格" subtitle="讲课特点，以及适不适合你">
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-3">
          <h3 className="mb-3 font-semibold text-slate-900">讲课特点</h3>
          <ul className="space-y-3">
            {(teachingStyle.features ?? []).map((f) => (
              <li key={f} className="flex gap-3 text-slate-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                  ✓
                </span>
                <span className="text-sm leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
            {teachingStyle.description}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h3 className="mb-3 font-semibold text-slate-900">风格标签</h3>
          <div className="flex flex-col gap-2.5">
            {tags.map((t) => (
              <div
                key={t.label}
                className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm ${
                  t.on
                    ? "bg-brand-50 text-brand-800"
                    : "bg-slate-50 text-slate-400"
                }`}
              >
                <span className="font-medium">{t.label}</span>
                <span className="font-bold">{t.on ? "是" : "—"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
