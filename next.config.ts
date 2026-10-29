import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/studylab",
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  serverExternalPackages: ["pg", "@prisma/adapter-pg", "@prisma/client"],
};

export default nextConfig;
