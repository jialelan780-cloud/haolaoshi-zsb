interface AvatarProps {
  text?: string;
  from?: string;
  to?: string;
  size?: "md" | "lg";
}

/**
 * 用姓氏首字 + 渐变底色生成头像，避免依赖图片资源（图片不存在时的文字头像兜底）。
 * 之后若有真人照片，可在此组件内替换为 next/image。
 */
export default function Avatar({ text, from, to, size = "md" }: AvatarProps) {
  const sizeClass =
    size === "lg"
      ? "h-28 w-28 text-5xl sm:h-32 sm:w-32"
      : "h-20 w-20 text-3xl";

  // 字段缺失时给出兜底，保证头像始终能渲染
  const safeText = text && text.length > 0 ? text : "师";
  const gradient = `${from || "from-brand-500"} ${to || "to-brand-700"}`;

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} font-bold text-white shadow-lg ring-4 ring-white ${sizeClass}`}
      aria-hidden="true"
    >
      {safeText}
    </div>
  );
}
