import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin Turbopack's workspace root to this project — silences the
  // "multiple lockfiles" warning when there's a stray lockfile in
  // an ancestor directory.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
