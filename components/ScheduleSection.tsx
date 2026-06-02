import type { Teacher, ClassInfo } from "@/data/teachers";
import Section from "./Section";

const statusStyle: Record<ClassInfo["status"], string> = {
  进行中: "bg-emerald-100 text-emerald-700",
  已满班: "bg-slate-200 text-slate-500",
  即将开班: "bg-amber-100 text-amber-700",
};

/** 模块 10：当前带班情况 */
export default function ScheduleSection({ teacher }: { teacher: Teacher }) {
  return (
    <Section title="当前带班情况" subtitle="老师目前负责的班级与时间安排">
      <div className="grid gap-4 md:grid-cols-2">
        {(teacher.schedule ?? []).map((cls) => (
          <div
            key={cls.name}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-slate-900">{cls.name}</h3>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[cls.status] ?? "bg-slate-100 text-slate-500"}`}
              >
                {cls.status}
              </span>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 text-slate-400">授课阶段</dt>
                <dd className="text-slate-700">{cls.stage}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 text-slate-400">上课时间</dt>
                <dd className="text-slate-700">{cls.time}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 text-slate-400">适合学生</dt>
                <dd className="text-slate-700">{cls.suitableFor}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </Section>
  );
}
