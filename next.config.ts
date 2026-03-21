import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Control referrer info sent with requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable invasive browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(self), geolocation=(), interest-cohort=()",
  },
  // {
  //   key: "Strict-Transport-Security",
  //   value: "max-age=63072000; includeSubDomains; preload",
  // },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js inline scripts & React hydration require 'unsafe-inline' for now
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com data:",
      // Allow LinkedIn and Spline images/textures
      "img-src 'self' data: blob: https://media.licdn.com https://*.spline.design",
      // API calls, 3D scene loading, and WASM modules
      "connect-src 'self' https://*.nvidia.com https://*.groq.com https://prod.spline.design https://*.spline.design https://unpkg.com blob:",
      // 3D model loading and workers
      "worker-src 'self' blob:",
      "frame-src 'self' https://*.spline.design",
      "media-src 'self' data: blob:",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
