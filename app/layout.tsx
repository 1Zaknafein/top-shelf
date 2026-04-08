import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Carter_One } from "next/font/google";
import "./globals.css";

const carterOne = Carter_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Top Shelf Tier List",
  description: "A drag-and-drop tier list for ranking your favorites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", carterOne.variable)}
    >
      <body className=" bg-image">
        <Providers>
          <main>{children} </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
