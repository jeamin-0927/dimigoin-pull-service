import "moment-timezone";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { OutingData, OutingAndMealData } from "@/app/api/outing/utils";
import { getApplyEndDate, getApplyStartDate } from "@/app/api/stay/utils";
import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

const PUT = async (
  req: Request,
) => {
  const { sat, sun, owner } = await req.json() as {
    sat: OutingAndMealData;
    sun: OutingAndMealData;
    owner: string;
  };

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

  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  const selectMember = await userCollection.findOne({ id: verified.payload.data.id }) as unknown as UserDB;
  if(selectMember.type !== "teacher") return new NextResponse(JSON.stringify({
    message: "교사만 접근 가능합니다.",
  }), {
    status: 403,
    headers: new_headers
  });

  if(!owner) return new NextResponse(JSON.stringify({
    message: "학생을 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  const stayCollection = client.db().collection("stay");
  const query2 = { owner: owner, week: await getApplyStartDate() };
  const stayData = await stayCollection.findOne(query2);
  if(!stayData) {
    return new NextResponse(JSON.stringify({
      success: false,
      message: "잔류 신청을 먼저 해주세요.",
    }), {
      status: 400,
      headers: new_headers
    });
  }

  // type check
  const satData: OutingAndMealData = {
    meal: {
      breakfast: !!sat.meal.breakfast,
      lunch: !!sat.meal.lunch,
      dinner: !!sat.meal.dinner,
    },
    outing: sat.outing.map(outing => ({
      start: moment(outing.start, "HH:mm").format("HH:mm"),
      end: moment(outing.end, "HH:mm").format("HH:mm"),
      description: outing.description,
    })).sort((a, b) => {
      const startA = moment(a.start, "HH:mm");
      const startB = moment(b.start, "HH:mm");
      if(startA.isBefore(startB)) return -1;
      if(startA.isAfter(startB)) return 1;
      const endA = moment(a.end, "HH:mm");
      const endB = moment(b.end, "HH:mm");
      if(endA.isBefore(endB)) return -1;
      if(endA.isAfter(endB)) return 1;
      return a.description.localeCompare(b.description);
    }),
  };
  const sunData: OutingAndMealData = {
    meal: {
      breakfast: !!sun.meal.breakfast,
      lunch: !!sun.meal.lunch,
      dinner: !!sun.meal.dinner,
    },
    outing: sun.outing.map(outing => ({
      start: moment(outing.start, "HH:mm").format("HH:mm"),
      end: moment(outing.end, "HH:mm").format("HH:mm"),
      description: outing.description,
    })).sort((a, b) => {
      const startA = moment(a.start, "HH:mm");
      const startB = moment(b.start, "HH:mm");
      if(startA.isBefore(startB)) return -1;
      if(startA.isAfter(startB)) return 1;
      const endA = moment(a.end, "HH:mm");
      const endB = moment(b.end, "HH:mm");
      if(endA.isBefore(endB)) return -1;
      if(endA.isAfter(endB)) return 1;
      return a.description.localeCompare(b.description);
    }),
  };

  // put data
  const putData: OutingData = {
    owner: owner,
    week: await getApplyStartDate(),
    sat: satData,
    sun: sunData,
  };

  // db connect
  const outingCollection = client.db().collection("outing");
  const query = { owner: putData.owner, week: putData.week };
  const options = { upsert: true };
  const update = {
    $set: putData,
  };
  const result = await outingCollection.updateOne(query, update, options);

  if(result.acknowledged) {
    return new NextResponse(JSON.stringify({
      success: true,
      message: "성공적으로 변경되었습니다.",
    }), {
      status: 200,
      headers: new_headers
    });
  }
  else {
    return new NextResponse(JSON.stringify({
      success: false,
      message: "변경에 실패했습니다.",
      result
    }), {
      status: 500,
      headers: new_headers
    });
  }
};

export default PUT;