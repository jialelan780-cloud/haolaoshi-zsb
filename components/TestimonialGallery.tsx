"use client";

import { useMemo, useState } from "react";
import {
  type Testimonial,
  TESTIMONIAL_FILTERS,
} from "@/lib/testimonials";
import Lightbox from "@/components/Lightbox";

const INITIAL_COUNT = 12;
const STEP = 12;

/** 不同标签对应的角标配色，保持与全站品牌色一致 */
const BADGE_STYLE: Record<string, string> = {
  上岸喜报: "bg-amber-500 text-white",
  成绩喜报: "bg-amber-500 text-white",
  学员反馈: "bg-brand-600 text-white",
  朋友圈: "bg-emerald-500 text-white",
};

/**
 * 学员感谢 / 真实反馈 画廊（客户端交互）
 * - 顶部分类筛选（仅展示数据中实际存在的标签）
 * - 瀑布流卡片（CSS columns，保持图片原始比例、自适应高度，不拉伸）
 * - 默认 12 张 + “查看更多”
 * - 缩略图懒加载，点击放大查看（灯箱）
 */
export default function TestimonialGallery({ items }: { items: Testimonial[] }) {
  const [activeFilter, setActiveFilter] = useState("全部");
  const [visible, setVisible] = useState(INITIAL_COUNT);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // 仅保留数据中真实出现的筛选标签
  const filters = useMemo(() => {
    const present = new Set<string>();
    items.forEach((it) => it.filterTags.forEach((t) => present.add(t)));
    return TESTIMONIAL_FILTERS.filter((f) => f === "全部" || present.has(f));
  }, [items]);

  const filtered = useMemo(() => {
    if (activeFilter === "全部") return items;
    return items.filter((it) => it.filterTags.includes(activeFilter));
  }, [items, activeFilter]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const changeFilter = (f: string) => {
    setActiveFilter(f);
    setVisible(INITIAL_COUNT);
  };

  return (
    <div>
      {/* 分类筛选 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = f === activeFilter;
          return (
            <button
              key={f}
              type="button"
              onClick={() => changeFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* 瀑布流卡片 */}
      <div className="[column-fill:_balance] gap-4 [column-gap:1rem] columns-2 md:columns-3">
        {shown.map((it, i) => (
          <figure
            key={it.id}
            className="group mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            onClick={() => setLightboxIndex(i)}
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.thumb}
                alt={it.caption}
                loading="lazy"
                width={it.w}
                height={it.h}
                className="block w-full object-contain"
              />
              {/* 角标 */}
              <span className="absolute left-2 top-2 flex gap-1">
                <span className="rounded-md bg-white/85 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur">
                  {it.subjectLabel}
                </span>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold shadow-sm ${
                    BADGE_STYLE[it.kindLabel] ?? "bg-slate-700 text-white"
                  }`}
                >
                  {it.kindLabel}
                </span>
              </span>
              {/* 悬停放大提示 */}
              <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100">
                <span className="m-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                  点击放大 ⤢
                </span>
              </span>
            </div>
            <figcaption className="px-3 py-2.5 text-[13px] leading-6 text-slate-600">
              {it.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* 查看更多 */}
      {hasMore ? (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + STEP)}
            className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 transition hover:bg-brand-50 hover:ring-brand-300"
          >
            查看更多反馈（还有 {filtered.length - visible} 张）
          </button>
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-400">
          该分类下暂无内容。
        </p>
      ) : null}

      {/* 灯箱：在“当前已展示”的列表内左右切换 */}
      {lightboxIndex !== null ? (
        <Lightbox
          items={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      ) : null}
    </div>
  );
}
