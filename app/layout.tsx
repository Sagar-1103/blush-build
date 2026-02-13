import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth-context";
import { AuthModal } from "@/components/auth-modal";

export const metadata: Metadata = {
  title: "BlushBuild | Build something cute. Say something real.",
  description:
    "Create a cute, personalized proposal or confession page for your crush. Choose a template, customize it, and share the link. 💕",
  keywords: ["proposal", "confession", "crush", "valentine", "love letter", "romantic website"],
  openGraph: {
    title: "BlushBuild",
    description: "Build something cute. Say something real. 💕",
    type: "website",
  },
  icons: {
    icon: "/favicon-32x32.png",
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
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}

