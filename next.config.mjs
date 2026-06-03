/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 让 /zsb-query 干净地访问到 public/zsb-query/index.html（静态查询系统）
  async rewrites() {
    return [
      { source: "/zsb-query", destination: "/zsb-query/index.html" },
    ];
  },
};

export default nextConfig;
