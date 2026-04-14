import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deployment Registry",
  description: "Architecture deployments currently in production or active scaling. Shipped systems by Mayank Himmatsingka.",
};

export default function ShippedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
