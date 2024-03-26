/* eslint-disable @next/next/no-img-element */
import { headers } from "next/headers";
import React from "react";

import { refreshVerify } from "@/utils/jwt";

import Alert from "./(joke)/alert";
import Fast from "./(joke)/FAST";
import FireworkFrame from "./(joke)/fireworks";
import Logout from "./logout";
import Menu from "./menu";

const LoginedLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookie = headers().get("cookie")?.split("; ").map((c: string) => {
    const [key, value] = c.split("=");
    return {
      key: key,
      value: value,
    };
  }) || [];
  const cookieJSON = Object.fromEntries(cookie.map((c: any) => [c.key, c.value]));
  const { refreshToken } = cookieJSON;
  const veryfied = await refreshVerify(refreshToken);

  return (
    <>
      {
        veryfied.ok ? (
          <header className="w-full">
            <article className="w-full flex justify-center items-center border-b border-text/10 px-5 py-3">
              <p className="text-primary text-lg font-semibold">선린인 풀 서비스 V3</p>
            </article>
            <article className="w-full py-5 px-4 border-b border-text/10 flex flex-row items-center gap-4">
              <img src={veryfied.payload.profile_image} alt={veryfied.payload.name} width={60} height={60} className="rounded-full" />
              <figure className="flex flex-col justify-center items-start">
                <p className="font-semibold text-lg">{veryfied.payload.number} {veryfied.payload.name}</p>
                <Logout />
              </figure>
            </article>
            <Menu />
          </header>
        ) : null
      }
      {children}
      <div className="absolute top-0 left-0 -z-[1]">
        <FireworkFrame />
      </div>
      <footer className="w-full pt-5 pb-8">
        <article className="w-full flex flex-col justify-center items-center gap-2">
          <Fast />
          <Alert />
          <p className="text-text/40 text-sm">급식 확인은 <a className="text-primary/40 underline" href="https://선린급식.com/" target="_blank" rel="noreferrer">선린 급식</a>에서 확인해주세요!</p>
          <p className="text-text/40 text-sm">&#34;내가 이것보단 잘 만들겠다 ㅋㅋ&#34;하는 경우엔 <a className="text-primary/40 underline" href="https://github.com/jeamxn/dimigoin-pull-service" target="_blank" rel="noreferrer">직접 만드세요</a>!</p>
          <p className="text-text/40 text-sm">오류 및 기타 문의 사항은 <a className="text-primary/40 underline" href="kakaoopen://join?l=%2Fme%2FJeamxn&r=EW">최재민</a>에게 연락바랍니다!</p>
        </article>
      </footer>
    </>
  );
};

export default LoginedLayout;