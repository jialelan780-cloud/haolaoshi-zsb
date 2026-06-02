import type { Teacher } from "@/data/teachers";
import Section from "./Section";

/** 模块 11 + 12：学生感谢 与 家长感谢 */
export default function Testimonials({ teacher }: { teacher: Teacher }) {
  return (
    <>
      <Section title="学生感谢" subtitle="来自专升本学员的真实反馈">
        <div className="grid gap-5 md:grid-cols-3">
          {(teacher.studentTestimonials ?? []).map((t, i) => (
            <figure
              key={i}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6"
            >
              <span className="text-4xl leading-none text-brand-200">“</span>
              <blockquote className="-mt-2 flex-1 text-sm leading-relaxed text-slate-700">
                {t.content}
              </blockquote>
              <figcaption className="mt-4 text-xs font-medium text-slate-400">
                —— {t.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section
        title="家长感谢"
        subtitle="部分家长也关注孩子的备考状态"
      >
        <div className="grid gap-5 md:grid-cols-2">
          {(teacher.parentTestimonials ?? []).map((t, i) => (
            <figure
              key={i}
              className="flex flex-col rounded-2xl border border-amber-100 bg-amber-50 p-6"
            >
              <span className="text-4xl leading-none text-amber-300">“</span>
              <blockquote className="-mt-2 flex-1 text-sm leading-relaxed text-slate-700">
                {t.content}
              </blockquote>
              <figcaption className="mt-4 text-xs font-medium text-amber-700">
                —— {t.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>
    </>
  );
}
