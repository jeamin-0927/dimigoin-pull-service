"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

import Insider from "@/provider/insider";

const Login = () => {
  const ref = React.useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const login = async () => {
    const url = `${process.env.NEXT_PUBLIC_DIMIGOIN_URI}/auth?client=${process.env.NEXT_PUBLIC_DIMIGOIN_KEY}&redirect=${process.env.NEXT_PUBLIC_APP_URI}/auth`;
    router.push(url);
  };

  return (
    <Insider 
      className="w-full h-screen justify-center items-center"
    >
      <Image 
        src="/public/background.webp"
        alt="background"
        className="blur-[16px] opacity-25 select-none object-cover object-center fill"
        fill
      />
      <button 
        className="overflow-hidden z-50 bg-primary px-8 py-8 rounded-md flex flex-col gap-6 justify-between items-center w-full max-w-[30rem]"
        onClick={login}
        ref={ref}
      >
        <section className="flex flex-row w-full justify-start items-start">
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 20 21" fill="none">
            <g clipPath="url(#clip0_1_1390)">
              <rect y="16.75" width="20" height="3.75" rx="1.875" fill="rgb(var(--color-white) / 1)"></rect>
              <path d="M1.5625 7.375C1.5625 6.33947 2.40197 5.5 3.4375 5.5C4.47303 5.5 5.3125 6.33947 5.3125 7.375L5.3125 13.625C5.3125 14.6605 4.47303 15.5 3.4375 15.5C2.40197 15.5 1.5625 14.6605 1.5625 13.625L1.5625 7.375Z" fill="rgb(var(--color-white) / 1)"></path>
              <path d="M1.5625 2.375C1.5625 1.33947 2.40197 0.5 3.4375 0.5C4.47303 0.5 5.3125 1.33947 5.3125 2.375C5.3125 3.41053 4.47303 4.25 3.4375 4.25C2.40197 4.25 1.5625 3.41053 1.5625 2.375Z" fill="rgb(var(--color-white) / 1)"></path>
              <path fillRule="evenodd" clipRule="evenodd" d="M12.8125 2.6875C9.7059 2.6875 7.1875 5.2059 7.1875 8.3125V13.625C7.1875 14.6605 8.02697 15.5 9.0625 15.5C10.098 15.5 10.9375 14.6605 10.9375 13.625V8.3125C10.9375 7.27697 11.777 6.4375 12.8125 6.4375C13.848 6.4375 14.6875 7.27697 14.6875 8.3125V13.625C14.6875 14.6605 15.527 15.5 16.5625 15.5C17.598 15.5 18.4375 14.6605 18.4375 13.625V8.3125C18.4375 5.2059 15.9191 2.6875 12.8125 2.6875Z" fill="rgb(var(--color-white) / 1)"></path>
            </g>
            <defs>
              <clipPath id="clip0_1_1390">
                <rect width="20" height="20" fill="white" transform="translate(0 0.5)"></rect>
              </clipPath>
            </defs>
          </svg>
        </section>
        <article className="flex flex-col gap-2 justify-center items-end w-full">
          <figure className="flex flex-row gap-2 justify-start items-center">
          
            <p className="text-white whitespace-nowrap text-base">선린인 풀 서비스 V3</p>
          </figure>
          <figure className="flex flex-row gap-0 justify-start items-center">
            <p className="text-xl text-white font-bold text-left whitespace-nowrap">선린인 계정</p>
            <p className="text-xl text-white font-normal text-left whitespace-nowrap">으로 로그인하기</p>
          </figure>
        </article>
      </button>     
    </Insider>
  );
};

export default Login;