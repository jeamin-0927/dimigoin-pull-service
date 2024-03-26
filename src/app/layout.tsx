/* eslint-disable @next/next/no-img-element */
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import React from "react";

import RecoilProvider from "@/provider/RecoilProvider";
import ToastProvider from "@/provider/ToastProvider";

export const metadata: Metadata = {
  title: "선린인 풀 서비스 V3",
  description: "그래그래 드디어 왔다 선린인 풀 서비스 V3",
  openGraph:{
    title: "선린인 풀 서비스 V3",
    siteName: "선린인 풀 서비스 V3",
    description: "그래그래 드디어 왔다 선린인 풀 서비스 V3",
    type: "website",
    url: "https://dimigo.net",
    locale: "ko_KR",
    images: [
      {
        url: "https://dimigo.net/public/og-image.png",
        width: 4800,
        height: 2520,
      }
    ],
  },
  appleWebApp: true,
  icons: [
    { 
      "url": "/favicon.ico", 
      "type": "image/x-icon", 
      "sizes": "16x16 32x32"
    },
    { 
      "url": "/public/icons/icon-192.png", 
      "type": "image/png", 
      "sizes": "192x192"
    },
    { 
      "url": "/public/icons/icon-512.png", 
      "type": "image/png", 
      "sizes": "512x512"
    },
      
  ],
  manifest: "/manifest.json",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="kr">
      <meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width"/>
      <meta name="apple-mobile-web-app-capable" content="yes"/>
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fafaff"/>
      <meta name="theme-color" media="(prefers-color-scheme: dark)"  content="#000000"/>
      <link rel="apple-touch-icon" href="/public/icons/apple-touch-icon.png" />
      <body>
        <RecoilProvider>
          <ToastProvider>
            <main>
              {children}
            </main>
          </ToastProvider>
        </RecoilProvider>
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;