import axios from "axios";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";


const POST = async (
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

  // DB 접속
  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  const selectMember = await userCollection.findOne({ id: verified.payload.data.id }) as unknown as UserDB;
  if(selectMember.type !== "teacher") return new NextResponse(JSON.stringify({
    message: "교사만 접근 가능합니다.",
  }), {
    status: 403,
    headers: new_headers
  });

  const { id } = await req.json();
  if(!id) return new NextResponse(JSON.stringify({
    message: "잘못된 요청입니다.",
  }), {
    status: 400,
    headers: new_headers
  });
  try {
    const url = "https://www.youtube.com/oembed";
    const params = { "format": "json", "url": `https://www.youtube.com/watch?v=${id}` };
    const res = await axios.get(url, {
      params,
    });

    moment.tz("Asia/Seoul");
    const statesCollection = client.db().collection("states");
    const data = await statesCollection.findOneAndUpdate({
      type: "wakeup_selected"
    }, {
      $set: { [`data.${verified.payload.data.gender}`]: { title: res.data.title, id: id, date: moment().format("YYYY-MM-DD") } }
    });

    if(data === null) throw new Error("Error");

    return new NextResponse(JSON.stringify({
      message: "성공적으로 기상송이 확정되었습니다.",
    }), {
      status: 200,
      headers: new_headers
    });

  } catch (e) {
    return new NextResponse(JSON.stringify({
      message: "기상송 확정 등록에 실패했습니다.",
    }), {
      status: 500,
      headers: new_headers
    });
  }
};

export default POST;