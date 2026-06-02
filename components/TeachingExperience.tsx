import type { Teacher } from "@/data/teachers";
import Section from "./Section";
import {
  TEACHER_BY_ID,
  filterRecords,
  getSummary,
  formatPercent,
} from "@/lib/admissionData";

/** 模块 3：专升本带教经验（带教理念 + 2022-2026 真实数据） */
export default function TeachingExperience({ teacher }: { teacher: Teacher }) {
  const experience = teacher.experience ?? {
    cohorts: "",
    studentTypes: [],
    goodAtModules: [],
    classTypes: [],
  };

  // 2022-2026 数据动态生成的带教概况
  const teacherName = TEACHER_BY_ID[teacher.id];
  const records = teacherName ? filterRecords({ teacher: teacherName }) : [];
  const s = records.length ? getSummary(records) : null;
  const cohortLine = s
    ? `自 2022 年持续带教浙江专升本理科班，2022–2026 累计带教 ${s.studentCount} 名学生、成功上岸 ${s.admittedCount} 人，综合上岸率 ${formatPercent(
        s.admissionRate,
      )}。`
    : experience.cohorts;

  const blocks = [
    { title: "熟悉的学生类型", items: experience.studentTypes ?? [] },
    { title: "擅长的模块", items: experience.goodAtModules ?? [] },
    { title: "负责过的班型", items: experience.classTypes ?? [] },
  ];

  return (
    <Section title="专升本带教经验" subtitle="只做浙江专升本，了解每一类学生">
      {/* 带教理念 · 励志寄语 */}
      {teacher.teachingBelief ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 to-brand-600 p-6 text-white shadow-md sm:p-8">
          <span className="absolute -left-1 top-1 text-6xl leading-none text-white/15">“</span>
          <p className="relative text-xs font-semibold tracking-widest text-brand-100">
            带教理念
          </p>
          <p className="relative mt-3 text-lg font-bold leading-9 sm:text-xl">
            {teacher.teachingBelief}
          </p>
        </div>
      ) : null}

      {/* 2022-2026 带教概况（动态数据） */}
      <div className="mt-4 rounded-2xl border border-brand-100 bg-brand-50 p-5 sm:p-6">
        <p className="text-base font-semibold leading-relaxed text-brand-800">
          {cohortLine}
        </p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {blocks.map((b) => (
          <div
            key={b.title}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <h3 className="mb-3 font-semibold text-slate-900">{b.title}</h3>
            <ul className="space-y-2">
              {(b.items ?? []).map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-relaxed text-slate-600"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
