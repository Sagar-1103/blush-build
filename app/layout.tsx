import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth-context";
import { AuthModal } from "@/components/auth-modal";
import Script from "next/script";

export const metadata: Metadata = {
  title: "BlushBuild | Build something cute. Say something real.",
  description:
    "Create a cute, personalized proposal or confession page for your crush. Choose a template, customize it, and share the link. 💕",
  keywords: ["proposal", "confession", "crush", "valentine", "love letter", "romantic website", "interactive card"],
  authors: [{ name: "BlushBuild" }],
  creator: "BlushBuild",
  metadataBase: new URL("https://www.blush-build.xyz"),
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "BlushBuild | Build something cute. Say something real.",
    description: "Create a cute, personalized proposal or confession page for your crush. 💕",
    url: "https://www.blush-build.xyz",
    siteName: "BlushBuild",
    images: [
      {
        url: "/landing.png",
        width: 1200,
        height: 630,
        alt: "BlushBuild Landing Preview",
      },
      {
        url: "/logo.png",
        width: 500,
        height: 500,
        alt: "BlushBuild Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlushBuild | Build something cute. Say something real.",
    description: "Create a cute, personalized proposal or confession page for your crush. 💕",
    images: ["/landing.png"],
    creator: "@blushbuild",
  },
  icons: {
    icon: "/favicon-32x32.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  appleWebApp: {
    title: "BlushBuild",
    statusBarStyle: "default",
    startupImage: [
      "/logo.png",
    ],
  },
};

import { Dancing_Script, Outfit, Playfair_Display, Quicksand } from 'next/font/google';

const dancingScript = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand', display: 'swap' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dancingScript.variable} ${outfit.variable} ${playfair.variable} ${quicksand.variable}`}>
      <body className="font-body antialiased">
        <Script
          id="clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "vgu69ohm92");
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "BlushBuild",
              "url": "https://www.blush-build.xyz",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.blush-build.xyz/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "sameAs": [
                "https://twitter.com/blushbuild",
                "https://instagram.com/blushbuild"
              ]
            }),
          }}
        />
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}

