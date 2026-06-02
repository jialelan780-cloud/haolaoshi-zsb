import { redirect } from "next/navigation";

/** 网站根路径 `/` 自动进入机构介绍主页 */
export default function Home() {
  redirect("/about-haolaoshi");
}
