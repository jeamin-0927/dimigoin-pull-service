"use client";

import React from "react";

import { alert } from "@/utils/alert";

const Alert = () => {
  React.useEffect(() => {
    alert.error("디미고인 풀 서비스는 사라졌습니다.");
    alert.warn("당신들은 이제 선린인 풀 서비스를 사용하게 될 것입니다.");
    alert.success("이제 선린인 풀 서비스를 사용해보세요!");
  }, []);
  return null;
};

export default Alert;