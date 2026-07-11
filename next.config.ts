import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
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
