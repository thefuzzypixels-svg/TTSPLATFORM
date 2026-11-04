import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Edge TTS Platform - Free Neural AI Voice Studio",
  description: "Generate natural sounding neural speech using Microsoft Edge TTS with complete control over voice, speed, pitch, and volume.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
