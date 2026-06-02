import type { Teacher } from "@/data/teachers";
import Section from "./Section";

/** 模块 2：自我介绍 */
export default function TeacherIntro({ teacher }: { teacher: Teacher }) {
  return (
    <Section title="老师自我介绍" subtitle="用大白话聊聊我怎么帮你学好专升本数学">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="space-y-4">
          {(teacher.intro ?? []).map((para, i) => (
            <p key={i} className="leading-relaxed text-slate-700">
              {para}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
