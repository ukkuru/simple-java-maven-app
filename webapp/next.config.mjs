/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Produces a minimal, self-contained server bundle (node_modules pruned to
  // only what's needed at runtime) — keeps the Docker image small.
  output: "standalone",
};

export default nextConfig;
