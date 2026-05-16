import type { Metadata } from "next";
import { getAllMemos, getMemoBySlug } from "@/lib/memos";
import MemoReaderClient from "./MemoReaderClient";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const memo = getMemoBySlug(slug);

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
  const memos = getAllMemos();
  return memos.map((memo) => ({ slug: memo.slug }));
}

export default async function MemoReaderPage({ params }: Props) {
  const { slug } = await params;
  const memo = getMemoBySlug(slug);
  
  if (!memo) {
    notFound();
  }

  return <MemoReaderClient memo={memo} />;
}
