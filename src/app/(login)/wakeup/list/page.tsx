import React from "react";

import { getSelected, getWakeup } from "@/app/api/wakeup/server";
import { getUserInfo } from "@/utils/server";

import ListContent from "./ListContent";

const WakeupListPage = async () => {
  const initialUserInfo = await getUserInfo();
  const initialData = await getWakeup(initialUserInfo.id, initialUserInfo.gender);
  const wakeupSelected = await getSelected(initialUserInfo.gender);

  return (
    <ListContent
      initailData={{
        all: initialData.all,
        my: initialData.my,
        today: initialData.today,
        gender: initialData.gender as unknown as "male" | "female",
        week: initialData.week,
        selected: wakeupSelected
      }}
    />
  );
};

export default WakeupListPage;