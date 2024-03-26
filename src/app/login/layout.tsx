import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "로그인 :: 선린인 풀 서비스 V3",
};

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => children;

export default Layout;