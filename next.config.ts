import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**",
      port: "",
      pathname: "/photo-1518791841217-8f162f1e1131",
    },
  ]
};

export default nextConfig;
