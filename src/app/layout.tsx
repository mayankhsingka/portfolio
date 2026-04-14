import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ShortcutOverlay } from "@/components/ShortcutOverlay";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mayankhsingka.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mayank Himmatsingka | System Blueprint",
    template: "%s | Mayank Himmatsingka",
  },
  description: "Product Builder & System Architect. Shipping innovative products and scalable systems with extreme velocity. Explore the blueprint.",
  keywords: ["Mayank Himmatsingka", "product builder", "system architect", "portfolio", "Next.js", "developer", "Manasya", "Producive"],
  creator: "Mayank Himmatsingka",
  authors: [{ name: "Mayank Himmatsingka", url: SITE_URL }],
  openGraph: {
    title: "Mayank Himmatsingka | System Blueprint",
    description: "I build systems that solve real problems. 20yo product builder & system architect.",
    url: SITE_URL,
    siteName: "System Blueprint",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mayank Himmatsingka — System Blueprint Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mayank Himmatsingka | System Blueprint",
    description: "Product Builder & System Architect. Explore the blueprint.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('sys_theme');
                if (theme) {
                  document.documentElement.classList.add(theme);
                } else if (localStorage.getItem('night_ops_engaged') === 'true') {
                  document.documentElement.classList.add('dark-ops');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="h-full bg-grid-pattern overflow-hidden font-sans">
        {children}
        <ShortcutOverlay />
      </body>
    </html>
  );
}
