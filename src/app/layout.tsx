import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { ShortcutOverlay } from "@/components/ShortcutOverlay";
import { SystemContextMenu } from "@/components/SystemContextMenu";
import { OrbitalNav } from "@/components/OrbitalNav";
import { CommandPalette } from "@/components/CommandPalette";
import { MobileGlobalNav } from "@/components/mobile/MobileGlobalNav";
import { ClearanceProvider } from "@/components/ClearanceProvider";
import { DevOnly } from "@/components/shared/DevOnly";
import { PersonaToggle } from "@/components/shared/PersonaToggle";
import { PORTFOLIO_DATA } from "@/data/portfolio";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://himmatsingka.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mayank Himmatsingka — Builder, Architect",
    template: "%s · Mayank Himmatsingka",
  },
  description: "Mayank Himmatsingka — software engineer building production systems like Manasya and Producive. Selected work, writing, and an interactive developer view.",
  keywords: ["Mayank Himmatsingka", "software engineer", "architect", "portfolio", "Manasya", "Producive", "Rourkela", "India"],
  creator: "Mayank Himmatsingka",
  authors: [{ name: "Mayank Himmatsingka", url: SITE_URL }],
  openGraph: {
    title: "Mayank Himmatsingka — Builder, Architect",
    description: "Software engineer and architect. I build software, and I study buildings.",
    url: SITE_URL,
    siteName: "Mayank Himmatsingka",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mayank Himmatsingka — Builder, Architect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mayank Himmatsingka — Builder, Architect",
    description: "Software engineer and architect. I build software, and I study buildings.",
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
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const persona = localStorage.getItem('user_persona') === 'dev' ? 'dev' : 'non-dev';
                document.documentElement.setAttribute('data-persona', persona);
                var tc = document.createElement('meta');
                tc.setAttribute('name', 'theme-color');
                tc.setAttribute('content', persona === 'dev' ? '#FAF3E0' : '#F5F0E6');
                document.head.appendChild(tc);
                const theme = localStorage.getItem('sys_theme');
                if (theme && persona === 'dev') {
                  document.documentElement.classList.add(theme);
                } else if (localStorage.getItem('night_ops_engaged') === 'true' && persona === 'dev') {
                  document.documentElement.classList.add('dark-ops');
                }
              } catch (e) {
                document.documentElement.setAttribute('data-persona', 'non-dev');
              }
            `,
          }}
        />
      </head>
      <body className="h-full bg-grid-pattern overflow-hidden font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: PORTFOLIO_DATA.general.name,
              url: SITE_URL,
              jobTitle: "Software Engineer",
              email: `mailto:${PORTFOLIO_DATA.general.contactEmail}`,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Rourkela",
                addressRegion: "Odisha",
                addressCountry: "IN",
              },
              sameAs: [
                PORTFOLIO_DATA.general.linkedinUrl,
                PORTFOLIO_DATA.general.githubUrl,
                "https://x.com/himmatsingka_m",
              ],
            }),
          }}
        />
        <ClearanceProvider>
          {children}
          <DevOnly>
            <ShortcutOverlay />
            <SystemContextMenu />
            <OrbitalNav />
            <CommandPalette />
            <MobileGlobalNav />
          </DevOnly>
          <PersonaToggle />
        </ClearanceProvider>
      </body>
    </html>
  );
}
