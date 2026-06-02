interface SectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

/** 详情页统一的模块容器，保证标题样式与间距一致。 */
export default function Section({
  title,
  subtitle,
  children,
  className = "",
}: SectionProps) {
  return (
    <section className={`mx-auto max-w-5xl px-5 py-10 ${className}`}>
      <div className="mb-6">
        <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 sm:text-2xl">
          <span className="h-6 w-1.5 rounded-full bg-brand-600" />
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 pl-[18px] text-sm text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
