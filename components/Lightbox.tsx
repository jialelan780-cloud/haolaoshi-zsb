"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Testimonial } from "@/lib/testimonials";

/**
 * 学员反馈灯箱：点击缩略图后全屏查看大图。
 * - 支持左右切换（按钮 / 键盘 ←→ / 手机滑动）
 * - 支持 Esc 关闭、点击遮罩关闭
 * - 大图 object-contain，绝不拉伸变形
 */
export default function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: Testimonial[];
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const item = items[index];
  const touchStartX = useRef<number | null>(null);

  const goPrev = useCallback(() => {
    onNavigate((index - 1 + items.length) % items.length);
  }, [index, items.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((index + 1) % items.length);
  }, [index, items.length, onNavigate]);

  // 键盘操作 + 锁定页面滚动
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, goPrev, goNext]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
        if (dx > 50) goPrev();
        else if (dx < -50) goNext();
        touchStartX.current = null;
      }}
    >
      {/* 关闭按钮 */}
      <button
        type="button"
        aria-label="关闭"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl leading-none text-white transition hover:bg-white/30"
      >
        ×
      </button>

      {/* 上一张 */}
      {items.length > 1 ? (
        <button
          type="button"
          aria-label="上一张"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/30 sm:flex"
        >
          ‹
        </button>
      ) : null}

      {/* 图片 + 文案 */}
      <figure
        className="mx-auto flex max-h-[92vh] max-w-[94vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt={item.caption}
          className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
        />
        <figcaption className="mt-4 max-w-[640px] px-4 text-center">
          <span className="mb-2 inline-flex items-center gap-2 text-xs">
            <span className="rounded-full bg-amber-400 px-2.5 py-0.5 font-bold text-slate-900">
              {item.subjectLabel}
            </span>
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 font-medium text-white">
              {item.kindLabel}
            </span>
          </span>
          <p className="text-sm leading-6 text-white/90">{item.caption}</p>
          <p className="mt-2 text-xs text-white/50">
            {index + 1} / {items.length}
          </p>
        </figcaption>
      </figure>

      {/* 下一张 */}
      {items.length > 1 ? (
        <button
          type="button"
          aria-label="下一张"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/30 sm:flex"
        >
          ›
        </button>
      ) : null}
    </div>
  );
}
