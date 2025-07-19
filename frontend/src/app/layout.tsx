import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/layout/Layout";
import { ToastProvider } from "@/components/ui/toast";
import Providers from "@/components/providers/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "第二商城 - 优质购物平台",
  description: "专业的在线购物平台，为您提供优质的商品和服务",
};

export default function RootLayout({
  children,
}: Readonly<{children: React.ReactNode;}>) 
{
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <ToastProvider>
            <Layout>
              {children}
            </Layout>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
