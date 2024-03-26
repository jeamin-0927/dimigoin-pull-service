import axios from "axios";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { verify } from "@/utils/jwt";

type Params = {
  date: string; // YYYY-MM-DD
};

export type MealResponse = {
  success: boolean;
  message: string;
  data: Meal;
};

export type Meal = {
  status: string;
  date: string;
  meal: {
    breakfast: string;
    lunch: string;
    dinner: string;
  }
};

export const GET = async (
  req: Request,
  { params }: { params: Params }
) => {
  // 헤더 설정
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
      
  // Authorization 헤더 확인
  const authorization = headers().get("authorization");
  const verified = await verify(authorization?.split(" ")[1] || "");
  if(!verified.ok || !verified.payload?.id) return new NextResponse(JSON.stringify({
    message: "로그인이 필요합니다.",
  }), {
    status: 401,
    headers: new_headers
  });

  // 급식 데이터 가져오기
  try{
    const {data}: {data: Meal} = await axios({
      method: "GET",
      url: `https://선린급식.com/api/${params.date}`,
    });
	
    const response: MealResponse = {
      success: true,
      message: "성공적으로 급식 데이터를 가져왔습니다.",
      data,
    };
    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: new_headers
    });
  }
  catch {
    const response: MealResponse = {
      success: false,
      message: "급식 데이터가 없습니다.",
      data: {
        status: "error",
        date: params.date,
        meal: {
          breakfast: "",
          lunch: "",
          dinner: ""
        }
      }
    };
    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: new_headers
    });
  }
};