"use server";

import moment from "moment/moment";

import { getApplyStartDate } from "@/app/api/stay/utils";
import { connectToDatabase } from "@/utils/db";

import { getToday, WakeupDB, WakeupGET, WakeupSelected } from "./utils";

export const getWakeup = async (id: string, gender: string) => {
  const today = getToday();
  const client = await connectToDatabase();
  const wakeupCollection = client.db().collection("wakeup");
  const query = {
    week: await getApplyStartDate(),
    gender: gender,
  };
  const data = await wakeupCollection.find(query).toArray() as unknown as WakeupDB[];

  const allObj: WakeupGET = {};
  const myObj: WakeupDB[] = [];
  
  for (const v of data) {
    if (!allObj[v.id]) {
      allObj[v.id] = {
        title: v.title,
        date: v.date,
        count: 0,
        week: v.week,
      };
    }
    allObj[v.id].count++;
    if (v.owner === id && v.date === today.format("YYYY-MM-DD")) {
      myObj.push({
        title: v.title,
        id: v.id,
        date: v.date,
        owner: v.owner,
        _id: v._id,
        gender: v.gender,
        week: v.week,
      });
    }
  }

  return {
    all: allObj,
    my: myObj,
    today: today.format("YYYY-MM-DD"),
    gender: gender,
    week: await getApplyStartDate(),
  };
};

export const calcDateDiff = (selected: WakeupSelected) => {
  moment.tz("Asia/Seoul");
  const diff = moment(selected.date).diff(moment(), "days")*-1;
  switch (diff) {
  case 0: return "오늘";
  case 1: return "어제";
  case 2: return "그저께";
  default:  return `${diff}일 전`;
  }
};

export const getSelected = async (gender: string) => {
  const client = await connectToDatabase();
  const statesCollection = client.db().collection("states");
  const data = (await statesCollection.findOne({
    type: "wakeup_selected"
  }))?.data[gender];

  if (Object.prototype.hasOwnProperty.call(data, "date") || data.date === undefined || data.date === "") return { id: null };

  return {
    ...data,
    dateDiff: calcDateDiff(data)
  };
};