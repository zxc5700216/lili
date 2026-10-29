import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/lili",
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  serverExternalPackages: ["pg", "@prisma/adapter-pg", "@prisma/client"],
};

export default nextConfig;
