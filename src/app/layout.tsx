import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mayank Himmatsingka | System Blueprint",
  description: "Product Builder and System Architect. Shipping innovative products and scalable systems with extreme velocity.",
  creator: "Mayank Himmatsingka",
  openGraph: {
    title: "Mayank Himmatsingka | Developer & Builder",
    description: "I build systems that solve real problems. 20yo product builder.",
    url: "https://mayank.system-blueprint.local", // Replace when deploying
    siteName: "Mayank Portfolio",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  }
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
      </body>
    </html>
  );
}
