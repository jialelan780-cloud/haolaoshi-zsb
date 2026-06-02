import {
  studentRecords,
  type StudentRecord,
  type AdmissionType,
} from "@/data/admissionDetails";

/**
 * 升学数据派生层：所有统计都从 studentRecords 计算，数据源一变，全站随之更新。
 */

export const ALL_YEARS = [2022, 2023, 2024, 2025, 2026] as const;
export const ALL_TEACHERS = ["乔老师", "周老师"] as const;

export const TEACHER_BY_ID: Record<string, string> = {
  qiao: "乔老师",
  zhou: "周老师",
};

/** 姓名一字隐匿（幂等：已隐匿的不重复处理） */
export function maskStudentName(name: string): string {
  const n = (name ?? "").trim();
  if (!n) return "";
  if (n.includes("*")) return n; // 已隐匿
  if (n.length <= 1) return n;
  if (n.length === 2) return n[0] + "*";
  return n[0] + "*" + n.slice(2); // 三字及以上：隐去第二个字
}

export interface Summary {
  classCount: number;
  studentCount: number;
  admittedCount: number;
  admissionRate: number;
  publicCount: number;
  publicRate: number;
  math130Plus: number;
  maxMath: number;
  avgTotal: number;
  schoolCount: number;
}

export const formatPercent = (v: number) => `${(v * 100).toFixed(1)}%`;

export function filterRecords(opts: {
  year?: number | "all";
  teacher?: string | "all";
}): StudentRecord[] {
  const { year = "all", teacher = "all" } = opts;
  return studentRecords.filter(
    (r) =>
      (year === "all" || r.year === year) &&
      (teacher === "all" || r.mathTeacher === teacher),
  );
}

export function getSummary(records: StudentRecord[]): Summary {
  const n = records.length;
  if (n === 0) {
    return {
      classCount: 0,
      studentCount: 0,
      admittedCount: 0,
      admissionRate: 0,
      publicCount: 0,
      publicRate: 0,
      math130Plus: 0,
      maxMath: 0,
      avgTotal: 0,
      schoolCount: 0,
    };
  }
  const classCount = new Set(records.map((r) => `${r.year}|${r.className}`)).size;
  const admitted = records.filter((r) => r.admitted);
  const publicN = records.filter((r) => r.admissionType === "公办本科").length;
  const m130 = records.filter((r) => r.math130).length;
  const maxMath = Math.max(...records.map((r) => r.math));
  const avgTotal = records.reduce((a, b) => a + b.total, 0) / n;
  const schools = new Set(
    admitted.filter((r) => r.school && r.school !== "未录取").map((r) => r.school),
  );
  return {
    classCount,
    studentCount: n,
    admittedCount: admitted.length,
    admissionRate: admitted.length / n,
    publicCount: publicN,
    publicRate: publicN / n,
    math130Plus: m130,
    maxMath,
    avgTotal,
    schoolCount: schools.size,
  };
}

export interface TrendPoint {
  year: number;
  admissionRate: number;
  publicRate: number;
  math130Plus: number;
  avgTotal: number;
}

export function getYearlyTrend(teacher: string | "all"): TrendPoint[] {
  return ALL_YEARS.map((year) => {
    const s = getSummary(filterRecords({ year, teacher }));
    return {
      year,
      admissionRate: s.admissionRate,
      publicRate: s.publicRate,
      math130Plus: s.math130Plus,
      avgTotal: Number(s.avgTotal.toFixed(1)),
    };
  });
}

export interface ClassSummary {
  year: number;
  className: string;
  classType: string;
  mathTeacher: string;
  englishTeacher: string;
  studentCount: number;
  admittedCount: number;
  admissionRate: number;
  publicCount: number;
  publicRate: number;
  privateCount: number;
  vocationalCount: number;
  notAdmittedCount: number;
  math130Count: number;
  math130AdmittedRate: number;
  avgTotal: number;
  students: StudentRecord[];
}

export function getClassSummaries(records: StudentRecord[]): ClassSummary[] {
  const map = new Map<string, StudentRecord[]>();
  for (const r of records) {
    const key = `${r.year}|${r.className}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  const out: ClassSummary[] = [];
  for (const [key, list] of map) {
    const [year, className] = key.split("|");
    const n = list.length;
    const admitted = list.filter((r) => r.admitted);
    const m130 = list.filter((r) => r.math130);
    const m130Admitted = m130.filter((r) => r.admitted).length;
    const students = [...list].sort((a, b) => b.total - a.total);
    out.push({
      year: Number(year),
      className,
      classType: list[0].classType,
      mathTeacher: list[0].mathTeacher,
      englishTeacher: list[0].englishTeacher,
      studentCount: n,
      admittedCount: admitted.length,
      admissionRate: admitted.length / n,
      publicCount: list.filter((r) => r.admissionType === "公办本科").length,
      publicRate: list.filter((r) => r.admissionType === "公办本科").length / n,
      privateCount: list.filter((r) => r.admissionType === "民办本科").length,
      vocationalCount: list.filter((r) => r.admissionType === "职业本科").length,
      notAdmittedCount: list.filter((r) => !r.admitted).length,
      math130Count: m130.length,
      math130AdmittedRate: m130.length ? m130Admitted / m130.length : 0,
      avgTotal: list.reduce((a, b) => a + b.total, 0) / n,
      students,
    });
  }
  return out.sort((a, b) => a.year - b.year || a.className.localeCompare(b.className));
}

export interface SchoolGroup {
  school: string;
  type: AdmissionType;
  count: number;
  maxTotal: number;
  avgTotal: number;
  students: StudentRecord[];
}

/** 仅统计已上岸（有真实录取学校）的学生，按学校分组 */
export function getSchoolGroups(records: StudentRecord[]): SchoolGroup[] {
  const map = new Map<string, StudentRecord[]>();
  for (const r of records) {
    if (!r.admitted || !r.school || r.school === "未录取") continue;
    if (!map.has(r.school)) map.set(r.school, []);
    map.get(r.school)!.push(r);
  }
  const out: SchoolGroup[] = [];
  for (const [school, list] of map) {
    const students = [...list].sort((a, b) => b.total - a.total);
    out.push({
      school,
      type: list[0].admissionType,
      count: list.length,
      maxTotal: Math.max(...list.map((r) => r.total)),
      avgTotal: list.reduce((a, b) => a + b.total, 0) / list.length,
      students,
    });
  }
  // 录取人数多、最高分高的排前面
  return out.sort((a, b) => b.count - a.count || b.maxTotal - a.maxTotal);
}

/** 某位老师的代表录取院校（按录取人数排序，取前 n 所） */
export function getRepresentativeSchools(teacher: string, n = 6): string[] {
  return getSchoolGroups(filterRecords({ teacher }))
    .slice(0, n)
    .map((g) => g.school);
}

export interface TimelineEntry {
  year: string;
  content: string;
}

/**
 * P1：根据该老师 2022-2026 的真实数据动态生成带教经历时间轴。
 * 数据源变化时，时间轴随之变化，不写死。
 */
export function generateTeacherTimeline(teacher: string): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  for (const y of ALL_YEARS) {
    const recs = filterRecords({ year: y, teacher });
    if (recs.length === 0) continue;
    const s = getSummary(recs);
    const p = formatPercent;
    let content = "";
    switch (y) {
      case 2022:
        content = `开始系统带教浙江专升本理科班，带教 ${s.classCount} 个班、${s.studentCount} 名学生，上岸 ${s.admittedCount} 人。`;
        break;
      case 2023:
        content = `带教 ${s.classCount} 个班，综合上岸率 ${p(s.admissionRate)}，公办率 ${p(
          s.publicRate,
        )}，数学 130+ ${s.math130Plus} 人。`;
        break;
      case 2024: {
        const top = getSchoolGroups(recs).slice(0, 3).map((g) => g.school);
        content = `班级平均分提升至 ${s.avgTotal.toFixed(1)} 分，数学 130+ 达 ${s.math130Plus} 人${
          top.length ? `；代表录取院校：${top.join("、")} 等` : ""
        }。`;
        break;
      }
      case 2025:
        content = `带教 ${s.studentCount} 名学生、上岸 ${s.admittedCount} 人，公办本科录取 ${s.publicCount} 人，最高数学单科 ${s.maxMath} 分。`;
        break;
      case 2026:
        content = `继续带教 ${s.classCount} 个班、学生 ${s.studentCount} 人，综合上岸率 ${p(
          s.admissionRate,
        )}，公办率 ${p(s.publicRate)}。`;
        break;
      default:
        content = `带教 ${s.studentCount} 名学生，综合上岸率 ${p(s.admissionRate)}。`;
    }
    entries.push({ year: String(y), content });
  }
  return entries;
}

/**
 * P2：根据该老师 2022-2026 的真实数据动态生成一段「数据自我介绍」。
 * 用于与老师个人风格段落拼接，所有数字均来自数据。
 */
export function generateTeacherIntro(teacher: string): string {
  const s = getSummary(filterRecords({ teacher }));
  const schools = getRepresentativeSchools(teacher, 5);
  const schoolText = schools.length ? `历年代表录取院校包括：${schools.join("、")} 等。` : "";
  return (
    `自 2022 年以来，我累计带教 ${s.studentCount} 名浙江专升本学生，累计上岸 ${s.admittedCount} 人，` +
    `综合上岸率 ${formatPercent(s.admissionRate)}，其中公办本科录取 ${s.publicCount} 人，` +
    `数学 130 分以上 ${s.math130Plus} 人，最高数学单科 ${s.maxMath} 分。${schoolText}`
  );
}
