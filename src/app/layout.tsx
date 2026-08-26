import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import { loadClientConfig, themeStyleVars } from "@/lib/client-config";
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
        {children}
      </body>
    </html>
  );
}
