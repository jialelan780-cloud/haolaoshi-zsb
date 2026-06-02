import Link from "next/link";

/** 当 /teachers/[id] 的 id 不是 qiao / zhou 时，显示友好提示而非崩溃。 */
export default function TeacherNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="text-6xl font-black text-brand-100">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">未找到该老师</h1>
      <p className="mt-2 text-slate-500">
        该老师页面不存在，目前仅展示乔老师和周老师。
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        ← 返回老师列表
      </Link>
    </main>
  );
}
