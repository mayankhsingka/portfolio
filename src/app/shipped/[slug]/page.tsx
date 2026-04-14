import type { Metadata } from "next";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { isProjectNode } from "@/data/types";
import ShippedCaseFileClient from "./ShippedCaseFileClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const node = PORTFOLIO_DATA.nodes.filter(isProjectNode).find(n => n.slug === slug);

  if (!node) {
    return { title: "Case File Not Found" };
  }

  return {
    title: `${node.title} — Case File`,
    description: node.problem.slice(0, 160),
    openGraph: {
      title: `${node.title} | Shipped by Mayank Himmatsingka`,
      description: node.problem.slice(0, 160),
      type: "article",
    },
  };
}

export function generateStaticParams() {
  return PORTFOLIO_DATA.nodes
    .filter(isProjectNode)
    .map((node) => ({ slug: node.slug }));
}

export default function ShippedCaseFilePage({ params }: Props) {
  return <ShippedCaseFileClient params={params} />;
}
