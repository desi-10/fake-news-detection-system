import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fake News Detector | Identify Misinformation with AI",
  description: "An advanced AI-powered tool that helps you analyze news content and identify potential misinformation and fake news online.",
  keywords: "fake news, misinformation, fact checking, news verification, AI detection, content analysis",
  authors: [{ name: "Fake News Detector Team" }],
  openGraph: {
    title: "Fake News Detector | Identify Misinformation with AI",
    description: "An advanced AI-powered tool that helps you analyze news content and identify potential misinformation and fake news online.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
