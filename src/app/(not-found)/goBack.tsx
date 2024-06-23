"use client";

import { useRouter } from "next/navigation";
import React from "react";

const GoBack = () => {
  const router = useRouter();
  return (
    <button
      className="bg-white w-min px-8 py-4 rounded-full border border-text/5 cursor-pointer flex flex-row gap-2 items-center justify-center select-none"
      onClick={() => router.back()} 
    >
      <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="fill-text/60" d="M4.25225 15.118C3.96891 15.118 3.73141 15.0221 3.53975 14.8305C3.34808 14.6388 3.25225 14.4013 3.25225 14.118C3.25225 13.8346 3.34808 13.5971 3.53975 13.4055C3.73141 13.2138 3.96891 13.118 4.25225 13.118H10.3522C11.4022 13.118 12.3147 12.7846 13.0897 12.118C13.8647 11.4513 14.2522 10.618 14.2522 9.61797C14.2522 8.61797 13.8647 7.78464 13.0897 7.11797C12.3147 6.4513 11.4022 6.11797 10.3522 6.11797H4.05225L5.95225 8.01797C6.13558 8.2013 6.22725 8.43464 6.22725 8.71797C6.22725 9.0013 6.13558 9.23464 5.95225 9.41797C5.76891 9.6013 5.53558 9.69297 5.25225 9.69297C4.96891 9.69297 4.73558 9.6013 4.55225 9.41797L0.952246 5.81797C0.852246 5.71797 0.781413 5.60964 0.739746 5.49297C0.698079 5.3763 0.677246 5.2513 0.677246 5.11797C0.677246 4.98464 0.698079 4.85964 0.739746 4.74297C0.781413 4.6263 0.852246 4.51797 0.952246 4.41797L4.55225 0.817969C4.73558 0.634635 4.96891 0.542969 5.25225 0.542969C5.53558 0.542969 5.76891 0.634635 5.95225 0.817969C6.13558 1.0013 6.22725 1.23464 6.22725 1.51797C6.22725 1.8013 6.13558 2.03464 5.95225 2.21797L4.05225 4.11797H10.3522C11.9689 4.11797 13.3564 4.64297 14.5147 5.69297C15.6731 6.74297 16.2522 8.0513 16.2522 9.61797C16.2522 11.1846 15.6731 12.493 14.5147 13.543C13.3564 14.593 11.9689 15.118 10.3522 15.118H4.25225Z" />
      </svg>
      <p className="whitespace-nowrap text-base font-medium text-text/60">이전 페이지로 돌아가기</p>
    </button>
  );
};

export default GoBack;