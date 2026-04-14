import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Internal Memos",
  description: "Classified intelligence archive — operational thoughts, architecture philosophies, and deep focus transmissions by Mayank Himmatsingka.",
};

export default function MemosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
