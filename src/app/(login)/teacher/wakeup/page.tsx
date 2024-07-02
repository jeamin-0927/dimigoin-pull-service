import React from "react";

import { getSelected, getWakeup } from "@/app/api/wakeup/server";
import { getUserInfo } from "@/utils/server";

import TeacherWakeupContent from "./TeacherWakeupContent";

const TeacherWakeupListPage = async () => {
  const initialUserInfo = await getUserInfo();
  const initialData = await getWakeup(initialUserInfo.id, initialUserInfo.gender);
  const wakeupSelected = await getSelected(initialUserInfo.gender);

  return (
    <TeacherWakeupContent
      initailData={{
        all: initialData.all,
        gender: initialData.gender as unknown as "male" | "female",
        week: initialData.week,
        selected: wakeupSelected
      }}
    />
  );
};

export default TeacherWakeupListPage;