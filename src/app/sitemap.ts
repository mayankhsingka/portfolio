import type { MetadataRoute } from "next";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { isProjectNode } from "@/data/types";
import { getAllMemos } from "@/lib/memos";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mayankhsingka.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const shippedProjects = PORTFOLIO_DATA.nodes
    .filter(isProjectNode)
    .map((n) => ({
      url: `${SITE_URL}/shipped/${n.slug}`,
      lastModified: n.modified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const allMemos = getAllMemos();
  const memos = allMemos.map((m) => ({
    url: `${SITE_URL}/internal-memos/${m.slug}`,
    lastModified: m.date,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/shipped`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/internal-memos`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/commands`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...shippedProjects,
    ...memos,
  ];
}
