import type { Teacher } from "@/data/teachers";
import Section from "./Section";

/** 把内容里的数字 / 百分比 / 「X 人·X 分·X 个班」加粗，突出重点 */
function emphasize(text: string) {
  const parts = text.split(/(\d+(?:\.\d+)?\s*(?:%|分|人|个班)?)/g);
  return parts.map((p, i) =>
    /\d/.test(p) ? (
      <strong key={i} className="font-bold text-brand-700">
        {p}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

/** 模块 6：带教经历时间轴（内容由 2022-2026 真实数据动态生成） */
export default function Timeline({ teacher }: { teacher: Teacher }) {
  return (
    <Section title="带教经历时间轴" subtitle="2022-2026 历年带班结果，随数据自动更新">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <ol className="relative border-l-2 border-brand-200">
          {(teacher.timeline ?? []).map((item) => (
            <li key={item.year} className="mb-8 ml-6 last:mb-0">
              <span className="absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 ring-4 ring-white" />
              <p className="text-base font-extrabold text-brand-800">
                {item.year} 年
              </p>
              <p className="mt-1.5 text-[15px] leading-8 text-slate-800">
                {emphasize(item.content)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
