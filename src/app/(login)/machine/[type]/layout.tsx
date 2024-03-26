import { Metadata, ResolvingMetadata } from "next";
import React from "react";

type Props = {
  params: { 
    type: "washer" | "dryer";
  }
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  
  return {
    title: `${params.type === "washer" ? "세탁기" : "건조기"} 신청 :: 선린인 풀 서비스 V3`,
  };
}

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => children;

export default Layout;