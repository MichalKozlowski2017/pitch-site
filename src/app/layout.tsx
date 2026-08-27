import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import { themeStyleVars } from "@/lib/client-config";
import { loadClientConfig } from "@/lib/load-client-config";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
});

export function generateMetadata(): Metadata {
  const client = loadClientConfig();
  return {
    title: client.seo.title,
    description: client.seo.description,
    openGraph: {
      title: client.seo.title,
      description: client.seo.description,
      ...(client.hero.image
        ? { images: [{ url: client.hero.image }] }
        : {}),
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const client = loadClientConfig();

  return (
    <html
      lang="pl"
      className={`${manrope.variable} ${syne.variable} h-full antialiased`}
    >
      <body
        className="flex min-h-full flex-col font-[family-name:var(--font-body)]"
        style={themeStyleVars(client)}
      >
        <noscript>
          <style>{`[data-hero-item],[data-reveal],[data-usp-num]{opacity:1!important}[data-hero-media]{transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
