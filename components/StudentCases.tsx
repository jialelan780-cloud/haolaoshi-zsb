import type { Teacher } from "@/data/teachers";
import Section from "./Section";
import CaseStoryCard from "./CaseStoryCard";

/** 模块 7：代表学员案例（故事型展示，可展开完整带教过程） */
export default function StudentCases({ teacher }: { teacher: Teacher }) {
  const cases = teacher.studentCases ?? [];

  if (cases.length === 0) return null;

  return (
    <Section
      title="代表学员案例"
      subtitle="均为真实带教故事，已对学员姓名做匿名处理"
    >
      <div className="space-y-8">
        {cases.map((c) => (
          <CaseStoryCard key={c.id} caseItem={c} />
        ))}
      </div>
    </Section>
  );
}
