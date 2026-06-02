import type { Teacher } from "@/data/teachers";
import Section from "./Section";

/** 模块 5：专升本数学模块能力（卡片形式） */
export default function MathModules({ teacher }: { teacher: Teacher }) {
  return (
    <Section title="专升本数学模块能力" subtitle="覆盖浙江专升本数学全部核心考点">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(teacher.mathModules ?? []).map((m, i) => (
          <div
            key={m.title}
            className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-md"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="font-semibold text-slate-900">{m.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {m.desc}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
