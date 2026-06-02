import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "浙江专升本 · 数学名师展示",
  description:
    "浙江专升本数学教学团队，专注高等数学提分与上岸。了解乔老师、周老师的带教经验、教学风格与学员成果。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
