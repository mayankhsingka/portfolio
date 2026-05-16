import { getAllMemos } from "@/lib/memos";
import InternalMemosClient from "./InternalMemosClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Internal Memos | Mayank Portfolio",
  description: "Operational thoughts, architecture philosophies, and deep focus transmissions.",
};

export default function InternalMemosPage() {
  const memos = getAllMemos();
  return <InternalMemosClient memos={memos} />;
}
