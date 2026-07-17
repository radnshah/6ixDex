import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma's query engine binary lives in a custom generator output path
  // (src/generated/prisma) rather than node_modules, so Next.js's automatic
  // serverless file-tracing doesn't discover it on its own — without this,
  // Vercel deploys without the engine binary and every Prisma call 500s.
  outputFileTracingIncludes: {
    "/**/*": ["./src/generated/prisma/**/*"],
  },
};

export default nextConfig;
