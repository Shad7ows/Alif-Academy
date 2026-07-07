import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    // Exclude supabase functions from webpack processing (Deno-based Edge Functions)
    config.module.rules.push({
      test: /supabase\/functions\/.*\.ts$/,
      type: "native",
    });
    return config;
  },
  turbopack: {},
};

export default nextConfig;
