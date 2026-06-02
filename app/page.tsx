import Link from "next/link";
import { teachers } from "@/data/teachers";
import Avatar from "@/components/Avatar";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* 顶部品牌区 */}
      <section className="bg-gradient-to-b from-brand-700 to-brand-600 text-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <p className="mb-3 inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-medium">
            浙江专升本 · 专业数学教学团队
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
            数学提分，稳步上岸
          </h1>
          <p className="mt-4 max-w-2xl text-base text-brand-50 sm:text-lg">
            我们只做浙江专升本培训，专注把基础薄弱的专科生，带到能拿分、能上岸。
            下面是负责数学主讲的老师，了解他们的带教经验与学员成果。
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            {["浙江专升本", "数学提分", "上岸结果", "老师专业度"].map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-white/10 px-3 py-1.5 font-medium ring-1 ring-white/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 老师列表 */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            数学教学团队
          </h2>
          <p className="mt-2 text-slate-500">点击老师卡片，查看完整介绍与带教成果</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {(teachers ?? []).map((teacher) => (
            <Link
              key={teacher.id}
              href={`/teachers/${teacher.id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl sm:p-8"
            >
              <div className="flex items-start gap-5">
                <Avatar
                  text={teacher.avatarText}
                  from={teacher.avatarFrom}
                  to={teacher.avatarTo}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold text-slate-900">
                    {teacher.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-brand-600">
                    {teacher.subject}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {teacher.oneLineIntro}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                  <p className="text-slate-400">教龄</p>
                  <p className="font-semibold text-slate-800">
                    {teacher.teachingYears}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                  <p className="text-slate-400">累计带教</p>
                  <p className="font-semibold text-slate-800">
                    {teacher.totalStudents}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {(teacher.expertise ?? []).map((item) => (
                  <span
                    key={item}
                    className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <p className="mt-6 inline-flex items-center text-sm font-semibold text-brand-600 group-hover:text-brand-700">
                查看老师详情
                <span className="ml-1 transition group-hover:translate-x-1">→</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-8 text-center text-sm text-slate-400">
          浙江专升本数学教学团队 · 本页数据为展示用途
        </div>
      </footer>
    </main>
  );
}
