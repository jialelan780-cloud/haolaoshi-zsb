import {
  liberalArtsRecords,
  type LiberalArtsRecord,
} from "@/data/liberalArtsDetails";
import type { AdmissionType } from "@/data/admissionDetails";
import { maskStudentName } from "@/lib/admissionData";

/**
 * 文科班升学数据派生层：所有统计都从 liberalArtsRecords 计算，数据源一变，全站随之更新。
 * 与理科（admissionData）平行，按科目（语文 / 英语）筛选老师。
 */

export type Subject = "语文" | "英语";

export const LA_YEARS = [2022, 2023, 2024, 2025, 2026] as const;

export { maskStudentName };

/** 文科老师配置：页面 id -> 显示名、科目、数据筛选用的老师名 */
export interface LiberalTeacherConfig {
  id: string;
  name: string; // 页面展示名
  subject: Subject;
  dataKey: string; // 在明细中用于筛选的老师名
}

export const LIBERAL_TEACHERS: Record<string, LiberalTeacherConfig> = {
  yu: { id: "yu", name: "余老师", subject: "英语", dataKey: "余老师" },
  // 文科 Excel 中第二位英语老师为「韩老师」，按机构要求页面展示名沿用「柴老师」
  chai: { id: "chai", name: "柴老师", subject: "英语", dataKey: "韩老师" },
  shi: { id: "shi", name: "石老师", subject: "语文", dataKey: "石老师" },
  silu: { id: "silu", name: "思路老师", subject: "语文", dataKey: "思路老师" },
};

export function getLiberalTeacher(id: string): LiberalTeacherConfig | undefined {
  return LIBERAL_TEACHERS[id];
}

export const formatPercent = (v: number) => `${(v * 100).toFixed(1)}%`;

/** 该科目下，记录里对应的「老师」字段 */
function teacherOf(r: LiberalArtsRecord, subject: Subject): string {
  return subject === "语文" ? r.chineseTeacher : r.englishTeacher;
}

/** 该科目下，记录里对应的「单科分数」 */
export function scoreOf(r: LiberalArtsRecord, subject: Subject): number {
  return subject === "语文" ? r.chinese : r.english;
}

/** 该科目下，是否 120 分以上 */
function is120(r: LiberalArtsRecord, subject: Subject): boolean {
  return subject === "语文" ? r.chinese120 : r.english120;
}

export function filterLARecords(opts: {
  subject: Subject;
  year?: number | "all";
  teacher?: string | "all";
}): LiberalArtsRecord[] {
  const { subject, year = "all", teacher = "all" } = opts;
  return liberalArtsRecords.filter(
    (r) =>
      (year === "all" || r.year === year) &&
      (teacher === "all" || teacherOf(r, subject) === teacher),
  );
}

export interface LASummary {
  classCount: number;
  studentCount: number;
  admittedCount: number;
  admissionRate: number;
  publicCount: number;
  publicRate: number;
  score120Plus: number; // 该科目 120+ 人数
  maxScore: number; // 该科目最高单科
  avgTotal: number;
  schoolCount: number;
}

export function getLASummary(
  records: LiberalArtsRecord[],
  subject: Subject,
): LASummary {
  const n = records.length;
  if (n === 0) {
    return {
      classCount: 0,
      studentCount: 0,
      admittedCount: 0,
      admissionRate: 0,
      publicCount: 0,
      publicRate: 0,
      score120Plus: 0,
      maxScore: 0,
      avgTotal: 0,
      schoolCount: 0,
    };
  }
  const classCount = new Set(records.map((r) => `${r.year}|${r.className}`)).size;
  const admitted = records.filter((r) => r.admitted);
  const publicN = records.filter((r) => r.admissionType === "公办本科").length;
  const s120 = records.filter((r) => is120(r, subject)).length;
  const maxScore = Math.max(...records.map((r) => scoreOf(r, subject)));
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
    score120Plus: s120,
    maxScore,
    avgTotal,
    schoolCount: schools.size,
  };
}

export interface LATrendPoint {
  year: number;
  admissionRate: number;
  publicRate: number;
  score120Plus: number;
  avgTotal: number;
}

export function getLAYearlyTrend(
  subject: Subject,
  teacher: string | "all",
): LATrendPoint[] {
  return LA_YEARS.map((year) => {
    const s = getLASummary(filterLARecords({ subject, year, teacher }), subject);
    return {
      year,
      admissionRate: s.admissionRate,
      publicRate: s.publicRate,
      score120Plus: s.score120Plus,
      avgTotal: Number(s.avgTotal.toFixed(1)),
    };
  });
}

export interface LAClassSummary {
  year: number;
  className: string;
  classType: string;
  chineseTeacher: string;
  englishTeacher: string;
  studentCount: number;
  admittedCount: number;
  admissionRate: number;
  publicCount: number;
  publicRate: number;
  privateCount: number;
  notAdmittedCount: number;
  score120Count: number;
  avgTotal: number;
  students: LiberalArtsRecord[];
}

export function getLAClassSummaries(
  records: LiberalArtsRecord[],
  subject: Subject,
): LAClassSummary[] {
  const map = new Map<string, LiberalArtsRecord[]>();
  for (const r of records) {
    const key = `${r.year}|${r.className}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  const out: LAClassSummary[] = [];
  for (const [key, list] of map) {
    const [year, className] = key.split("|");
    const n = list.length;
    const admitted = list.filter((r) => r.admitted);
    const students = [...list].sort((a, b) => b.total - a.total);
    out.push({
      year: Number(year),
      className,
      classType: list[0].classType,
      chineseTeacher: list[0].chineseTeacher,
      englishTeacher: list[0].englishTeacher,
      studentCount: n,
      admittedCount: admitted.length,
      admissionRate: admitted.length / n,
      publicCount: list.filter((r) => r.admissionType === "公办本科").length,
      publicRate: list.filter((r) => r.admissionType === "公办本科").length / n,
      privateCount: list.filter((r) => r.admissionType === "民办本科").length,
      notAdmittedCount: list.filter((r) => !r.admitted).length,
      score120Count: list.filter((r) => is120(r, subject)).length,
      avgTotal: list.reduce((a, b) => a + b.total, 0) / n,
      students,
    });
  }
  return out.sort((a, b) => a.year - b.year || a.className.localeCompare(b.className));
}

export interface LASchoolGroup {
  school: string;
  type: AdmissionType;
  count: number;
  maxTotal: number;
  avgTotal: number;
  students: LiberalArtsRecord[];
}

/** 仅统计已上岸（有真实录取学校）的学生，按学校分组 */
export function getLASchoolGroups(records: LiberalArtsRecord[]): LASchoolGroup[] {
  const map = new Map<string, LiberalArtsRecord[]>();
  for (const r of records) {
    if (!r.admitted || !r.school || r.school === "未录取") continue;
    if (!map.has(r.school)) map.set(r.school, []);
    map.get(r.school)!.push(r);
  }
  const out: LASchoolGroup[] = [];
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
  return out.sort((a, b) => b.count - a.count || b.maxTotal - a.maxTotal);
}

export interface LiberalCampusSummary {
  studentCount: number;
  admittedCount: number;
  admissionRate: number;
  publicCount: number;
  publicRate: number;
  chinese120: number; // 语文 120+ 人数
  english120: number; // 英语 120+ 人数
  maxChinese: number;
  maxEnglish: number;
  avgTotal: number;
  schoolCount: number;
}

/** 滨江校区文科方向整体汇总（语文 + 英语全部学生） */
export function getLiberalCampusSummary(): LiberalCampusSummary {
  const recs = liberalArtsRecords;
  const n = recs.length;
  const admitted = recs.filter((r) => r.admitted);
  const publicN = recs.filter((r) => r.admissionType === "公办本科").length;
  const schools = new Set(
    admitted.filter((r) => r.school && r.school !== "未录取").map((r) => r.school),
  );
  return {
    studentCount: n,
    admittedCount: admitted.length,
    admissionRate: n ? admitted.length / n : 0,
    publicCount: publicN,
    publicRate: n ? publicN / n : 0,
    chinese120: recs.filter((r) => r.chinese120).length,
    english120: recs.filter((r) => r.english120).length,
    maxChinese: Math.max(...recs.map((r) => r.chinese)),
    maxEnglish: Math.max(...recs.map((r) => r.english)),
    avgTotal: n ? recs.reduce((a, b) => a + b.total, 0) / n : 0,
    schoolCount: schools.size,
  };
}

/** 文科方向整体代表录取院校（按录取人数排序，取前 n 所） */
export function getLiberalCampusSchools(n = 6): string[] {
  return getLASchoolGroups(liberalArtsRecords)
    .slice(0, n)
    .map((g) => g.school);
}

/** 某位老师的代表录取院校（按录取人数排序，取前 n 所） */
export function getLARepresentativeSchools(
  subject: Subject,
  teacher: string,
  n = 6,
): string[] {
  return getLASchoolGroups(filterLARecords({ subject, teacher }))
    .slice(0, n)
    .map((g) => g.school);
}

export interface TimelineEntry {
  year: string;
  content: string;
}

/**
 * 根据该老师 2022-2026 的真实文科数据动态生成带教经历时间轴。
 */
export function generateLATimeline(
  subject: Subject,
  teacher: string,
): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  const p = formatPercent;
  for (const y of LA_YEARS) {
    const recs = filterLARecords({ subject, year: y, teacher });
    if (recs.length === 0) continue;
    const s = getLASummary(recs, subject);
    let content = "";
    switch (y) {
      case 2022:
        content = `开始系统带教浙江专升本文科班，带教 ${s.classCount} 个班、${s.studentCount} 名学生，上岸 ${s.admittedCount} 人。`;
        break;
      case 2023:
        content = `带教 ${s.classCount} 个班，综合上岸率 ${p(s.admissionRate)}，公办率 ${p(
          s.publicRate,
        )}，${subject} 120+ ${s.score120Plus} 人。`;
        break;
      case 2024: {
        const top = getLASchoolGroups(recs).slice(0, 3).map((g) => g.school);
        content = `班级平均分提升至 ${s.avgTotal.toFixed(1)} 分，${subject} 120+ 达 ${s.score120Plus} 人${
          top.length ? `；代表录取院校：${top.join("、")} 等` : ""
        }。`;
        break;
      }
      case 2025:
        content = `带教 ${s.studentCount} 名学生、上岸 ${s.admittedCount} 人，公办本科录取 ${s.publicCount} 人，最高${subject}单科 ${s.maxScore} 分。`;
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
 * 根据该老师 2022-2026 的真实文科数据动态生成一段「数据自我介绍」。
 */
export function generateLAIntro(subject: Subject, teacher: string): string {
  const s = getLASummary(filterLARecords({ subject, teacher }), subject);
  const schools = getLARepresentativeSchools(subject, teacher, 5);
  const schoolText = schools.length
    ? `历年代表录取院校包括：${schools.join("、")} 等。`
    : "";
  return (
    `自 2022 年以来，我累计带教 ${s.studentCount} 名浙江专升本文科学生，累计上岸 ${s.admittedCount} 人，` +
    `综合上岸率 ${formatPercent(s.admissionRate)}，其中公办本科录取 ${s.publicCount} 人，` +
    `${subject} 120 分以上 ${s.score120Plus} 人，最高${subject}单科 ${s.maxScore} 分。${schoolText}`
  );
}
