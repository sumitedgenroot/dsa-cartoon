import type { Metadata } from "next";
import { Fredoka, Patrick_Hand, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const patrick = Patrick_Hand({ variable: "--font-patrick", subsets: ["latin"], weight: "400" });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "DSA Quest — learn DSA by playing", template: "%s · DSA Quest" },
  description:
    "Learn every DSA concept with step-by-step visualizers, live time-complexity races, Java + C++ code and fun games.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fredoka.variable} ${patrick.variable} ${jetbrains.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t-[2.5px] border-ink bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-sm text-muted">
            <span className="font-hand text-lg text-ink">Consistency is the real algorithm. 💪</span>
            <span>Brute force pehle, phir optimize. Think out loud.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
