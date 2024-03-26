"use client";

import Image from "next/image";
import React from "react";
import { ToastOptions } from "react-toastify";

import { alert } from "@/utils/alert";

const Gone = () => {
  return (
    <div className="w-full aspect-video">
      <Image 
        className="w-full aspect-video"
        src="/public/og-image.png" 
        alt="선린인 로고" 
        fill
        objectFit="cover"
      />
    </div>
  );
};

const Alert = () => {
  React.useEffect(() => {
    const option: ToastOptions = {
      autoClose: 10000,
    };
    const list = [
      (interval: number) => 
        alert.error(<p>디미고인 풀 서비스는 <b>사라졌습니다.</b></p>, { ...option, delay: interval }),
      (interval: number) => 
        alert.warn(<p>당신들은 <b>선린인 풀 서비스</b>를 사용하게 될 것입니다.</p>, { ...option, delay: interval }),
      (interval: number) => 
        alert.success(<p>디미고인과는 달리 <b>완벽한</b> 선린인 풀 서비스를 사용해보세요!</p>, { ...option, delay: interval }),
      (interval: number) => 
        alert.info(Gone, { ...option, delay: interval }),
    ];
    for(let i = 0; i < list.length; i++) {
      list[i]((i + 1) * 100);
    }
  }, []);
  return null;
};

export default Alert;