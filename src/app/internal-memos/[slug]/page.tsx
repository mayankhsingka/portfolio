import type { Metadata } from "next";
import { MEMOS_DATA } from "@/data/memos";
import MemoReaderClient from "./MemoReaderClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const memo = MEMOS_DATA.find((m) => m.slug === slug);

  if (!memo) {
    return { title: "Memo Not Found" };
  }

  return {
    title: memo.title,
    description: memo.excerpt,
    openGraph: {
      title: `${memo.title} | Internal Memos`,
      description: memo.excerpt,
      type: "article",
      publishedTime: memo.date,
      tags: memo.tags,
    },
  };
}

export function generateStaticParams() {
  return MEMOS_DATA.map((memo) => ({ slug: memo.slug }));
}

export default function MemoReaderPage({ params }: Props) {
  return <MemoReaderClient params={params} />;
}
