import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "관리 페이지 :: 디미고인 풀 서비스 V3",
};

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => children;

export default Layout;