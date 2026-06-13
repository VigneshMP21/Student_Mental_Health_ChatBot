import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "MindWell – Student Mental Health Chatbot",
    template: "%s | MindWell",
  },
  description:
    "AI-powered emotional wellness and support platform for students. Get empathetic guidance, track your mood, journal, and access personalized wellness suggestions.",
  keywords: ["mental health", "student wellness", "AI chatbot", "mood tracker", "journal"],
  openGraph: {
    title: "MindWell – Student Mental Health Chatbot",
    description: "AI-powered emotional wellness platform for students",
    type: "website",
  },
  icons: {
    icon: "/MindWell_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
