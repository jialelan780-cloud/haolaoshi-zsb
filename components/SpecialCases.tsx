import type { Teacher } from "@/data/teachers";
import Section from "./Section";

/** 模块 9：特殊成功案例 */
export default function SpecialCases({ teacher }: { teacher: Teacher }) {
  return (
    <Section title="特殊成功案例" subtitle="几类典型的逆袭与提分故事">
      <div className="grid gap-4 sm:grid-cols-2">
        {(teacher.specialCases ?? []).map((c, i) => (
          <div
            key={c.title}
            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6"
          >
            <span className="absolute right-4 top-3 text-5xl font-black text-brand-50">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="relative font-bold text-slate-900">{c.title}</h3>
            <p className="relative mt-2 text-sm leading-relaxed text-slate-600">
              {c.desc}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
