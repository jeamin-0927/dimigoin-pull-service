import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { getApplyStartDate } from "@/app/api/stay/utils";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";


import { WakeupDB, WakeupGET, getToday } from "./utils";

const GET = async (
  req: Request,
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
  
  const today = getToday();
  const client = await connectToDatabase();
  const wakeupCollection = client.db().collection("wakeup");
  const query = {
    week: await getApplyStartDate(),
    gender: verified.payload.data.gender,
  };
  const data = await wakeupCollection.find(query).toArray() as unknown as WakeupDB[];

  const allObj: WakeupGET = {};
  const myObj: WakeupDB[] = [];
  
  for(const v of data){
    if(!allObj[v.id]){
      allObj[v.id] = {
        title: v.title,
        thumbnails: v.thumbnails,
        date: v.date,
        count: 0,
        week: v.week,
      };
    }
    allObj[v.id].count++;
    if(v.owner === verified.payload.id && v.date === today.format("YYYY-MM-DD")){
      myObj.push({
        title: v.title,
        id: v.id,
        thumbnails: v.thumbnails,
        date: v.date,
        owner: v.owner,
        _id: v._id,
        gender: v.gender,
        week: v.week,
      });
    }
  }

  return new NextResponse(JSON.stringify({
    data: {
      all: allObj,
      my: myObj,
      today: today.format("YYYY-MM-DD"),
      gender: verified.payload.data.gender,
      week: await getApplyStartDate(),
    },
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;