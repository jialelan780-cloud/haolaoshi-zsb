import Link from "next/link";
import type { ReactNode } from "react";
import type { Teacher } from "@/data/teachers";
import Avatar from "./Avatar";
import TeacherAdmissionDataModal from "./TeacherAdmissionDataModal";

/** 模块 1：顶部老师名片 */
export default function TeacherHero({
  teacher,
  dataSlot,
}: {
  teacher: Teacher;
  /** 升学数据入口：缺省用理科 modal；文科老师可传入对应的 modal */
  dataSlot?: ReactNode;
}) {
  const cards = [
    { label: "主授科目", value: teacher.subject || "浙江专升本 · 高等数学" },
    { label: "教龄", value: teacher.teachingYears || "暂未填写" },
    { label: "累计带教学生数", value: teacher.totalStudents || "暂未填写" },
    { label: "当前带班状态", value: teacher.currentStatus || "暂未填写" },
  ];

  return (
    <header className="bg-gradient-to-b from-brand-700 to-brand-600 text-white">
      <div className="mx-auto max-w-5xl px-5 pt-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-brand-100 transition hover:text-white"
        >
          <span className="mr-1">←</span> 返回老师列表
        </Link>
      </div>

      <div className="mx-auto max-w-5xl px-5 pb-12 pt-6">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
          <Avatar
            text={teacher.avatarText}
            from={teacher.avatarFrom}
            to={teacher.avatarTo}
            size="lg"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold sm:text-4xl">
              {teacher.name || "老师"}
            </h1>
            <p className="mt-2 text-lg font-medium text-brand-50">
              {teacher.subject || "浙江专升本 · 高等数学"}
            </p>
            <p className="mt-3 max-w-2xl text-brand-50">
              {teacher.oneLineIntro || ""}
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
              {(teacher.expertise ?? []).map((item) => (
                <span
                  key={item}
                  className="rounded-lg bg-white/15 px-3 py-1 text-sm font-medium ring-1 ring-white/20"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div
              key={c.label}
              className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur"
            >
              <p className="text-xs text-brand-100">{c.label}</p>
              <p className="mt-1 font-semibold leading-snug">{c.value}</p>
            </div>
          ))}
        </div>

        {/* 入口：查看 2022-2026 历年升学数据 */}
        <div className="mt-5">
          {dataSlot ?? <TeacherAdmissionDataModal />}
        </div>
      </div>
    </header>
  );
}
