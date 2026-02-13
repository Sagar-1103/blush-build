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
  openGraph: {
    title: "BlushBuild | Build something cute. Say something real.",
    description: "Create a cute, personalized proposal or confession page for your crush. 💕",
    url: "https://blush.build",
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
  },
  icons: {
    icon: "/favicon-32x32.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
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
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}

