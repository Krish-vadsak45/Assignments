import type { Metadata } from "next";
import { Geist_Mono, Manrope, Playfair_Display } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider } from "antd";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "She Can Foundation",
  description: "Empowering women through technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#db2777",
                borderRadius: 12,
                fontFamily: "var(--font-manrope)",
              },
            }}
          >
            <App>
              <header className="glass-nav sticky top-0 z-50 w-full transition-all duration-300"></header>
              {children}
              <footer className="border-t border-slate-100 bg-surface py-20">
                <div className="mx-auto max-w-7xl px-6">
                  <div className="grid gap-16 md:grid-cols-4 lg:grid-cols-5">
                    <div className="col-span-2 lg:col-span-2">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-7 w-7 rounded-lg bg-primary" />
                        <span className="font-display text-xl font-bold text-foreground">
                          She Can Foundation
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-100 pt-8 md:flex-row">
                    <p className="text-xs text-slate-400">
                      © 2026 She Can Foundation. All rights reserved.
                    </p>
                  </div>
                </div>
              </footer>
            </App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
