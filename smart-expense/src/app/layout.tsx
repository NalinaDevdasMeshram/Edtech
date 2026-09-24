import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartSpend AI",
  description: "AI-powered personal finance management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
