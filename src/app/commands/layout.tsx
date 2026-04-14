import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commands",
  description: "Interactive system control dashboard — execute commands, cycle themes, and explore the System Blueprint portfolio sandbox.",
};

export default function CommandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
