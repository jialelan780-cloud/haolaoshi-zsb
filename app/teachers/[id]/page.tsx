import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTeacherById, getAllTeacherIds } from "@/data/teachers";
import type { StatItem } from "@/data/teachers";
import {
  TEACHER_BY_ID,
  filterRecords,
  getSummary,
  generateTeacherTimeline,
  generateTeacherIntro,
} from "@/lib/admissionData";

import TeacherHero from "@/components/TeacherHero";
import TeacherIntro from "@/components/TeacherIntro";
import TeachingExperience from "@/components/TeachingExperience";
import TeachingStyle from "@/components/TeachingStyle";
import MathModules from "@/components/MathModules";
import Timeline from "@/components/Timeline";
import StudentCases from "@/components/StudentCases";
import StatsSection from "@/components/StatsSection";
import AdmissionSchools from "@/components/AdmissionSchools";
import SpecialCases from "@/components/SpecialCases";
import ScheduleSection from "@/components/ScheduleSection";
import Testimonials from "@/components/Testimonials";
import FeedbackSection from "@/components/FeedbackSection";

interface PageProps {
  params: { id: string };
}

/** 预生成两个老师的静态路由 */
export function generateStaticParams() {
  return getAllTeacherIds().map((id) => ({ id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const teacher = getTeacherById(params.id);
  if (!teacher) return { title: "未找到老师" };
  return {
    title: `${teacher.name} · ${teacher.subject}`,
    description: teacher.oneLineIntro,
  };
}

export default function TeacherDetailPage({ params }: PageProps) {
  const baseTeacher = getTeacherById(params.id);
  if (!baseTeacher) notFound();

  // 升学相关数字全部从 2022-2026 真实明细动态计算（不写死）
  const teacherName = TEACHER_BY_ID[baseTeacher.id];
  const records = teacherName ? filterRecords({ teacher: teacherName }) : [];
  const s = records.length ? getSummary(records) : null;

  const dynamicStats: StatItem[] = s
    ? [
        { label: "累计带教学生（2022-2026）", value: `${s.studentCount}`, unit: "人" },
        { label: "累计上岸人数", value: `${s.admittedCount}`, unit: "人" },
        { label: "综合上岸率", value: (s.admissionRate * 100).toFixed(1), unit: "%" },
        { label: "公办本科率", value: (s.publicRate * 100).toFixed(1), unit: "%" },
        { label: "数学 130 分以上", value: `${s.math130Plus}`, unit: "人" },
        { label: "最高数学单科", value: `${s.maxMath}`, unit: "分" },
      ]
    : baseTeacher.stats;

  // P1 时间轴 / P2 自我介绍：从数据动态生成（保留老师个人风格段落）
  const dynamicTimeline = teacherName ? generateTeacherTimeline(teacherName) : [];
  const dynamicIntro = teacherName ? generateTeacherIntro(teacherName) : "";

  // 用真实数据覆盖会写死的字段（累计带教人数 / 上岸数据 / 时间轴 / 自我介绍）
  const teacher = s
    ? {
        ...baseTeacher,
        totalStudents: `累计带教 ${s.studentCount} 名专升本学生`,
        stats: dynamicStats,
        timeline: dynamicTimeline.length ? dynamicTimeline : baseTeacher.timeline,
        // 保留老师开场白，紧接着插入「数据自我介绍」，其余个人风格段落照旧
        intro: dynamicIntro
          ? [baseTeacher.intro[0], dynamicIntro, ...baseTeacher.intro.slice(1)]
          : baseTeacher.intro,
      }
    : baseTeacher;

  return (
    <main className="min-h-screen pb-16">
      <TeacherHero teacher={teacher} />
      <TeacherIntro teacher={teacher} />
      <TeachingExperience teacher={teacher} />
      <TeachingStyle teacher={teacher} />
      <MathModules teacher={teacher} />
      <Timeline teacher={teacher} />
      <StudentCases teacher={teacher} />
      <StatsSection teacher={teacher} />
      <AdmissionSchools teacherName={teacherName ?? teacher.name} />
      <SpecialCases teacher={teacher} />
      <ScheduleSection teacher={teacher} />
      <Testimonials teacher={teacher} />
      <FeedbackSection teacher={teacher} />

      <footer className="mx-auto mt-6 max-w-5xl px-5">
        <div className="rounded-2xl border border-slate-200 bg-white py-6 text-center text-sm text-slate-400">
          浙江专升本数学教学团队 · 本页数据为展示用途
        </div>
      </footer>
    </main>
  );
}
