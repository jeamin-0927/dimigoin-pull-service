/* eslint-disable @next/next/no-img-element */
"use client";

import moment from "moment";
import { useRouter } from "next/navigation";
import React from "react";
import Swal from "sweetalert2";

import { WakeupDB, WakeupGET, WakeupSelected } from "@/app/api/wakeup/utils";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

const TeacherWakeupContent = ({ initailData }: {
  initailData: {
    all: WakeupGET;
    gender: "male" | "female";
    week: string;
    selected: WakeupSelected
  };
}) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [wakeup, setWakeup] = React.useState<WakeupGET>(initailData.all);
  const [week, setWeek] = React.useState<moment.Moment>(moment(initailData.week, "YYYY-MM-DD"));
  const [gender, setGender] = React.useState<"male" | "female">(initailData.gender);
  const [link, setLink] = React.useState<string>();
  const [selected, setSelected] = React.useState<WakeupSelected>(initailData.selected);

  const getWakeup = async () => {
    setLoading(true);
    try{
      const res = await instance.get("/api/wakeup");
      setWakeup(res.data.data.all);
      setWeek(moment(res.data.data.week, "YYYY-MM-DD"));
      setGender(res.data.data.gender);
      router.refresh();
    }
    catch(e: any){
      alert.error(e.response.data.message);
    }
    setLoading(false);
  };

  const checkConfirm = async (id: WakeupDB["id"]) => {
    if (id === "") {
      if (link === undefined) {
        alert.error("링크를 먼저 입력해주세요.");
        return;
      }

      const match = link.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^/&]{10,12})/);
      if (match){
        id = match[1];
      }else {
        const parsedUrl = new URL(link);
        if (!parsedUrl.hostname.includes("youtube.com")) {
          const searchParams = new URLSearchParams(parsedUrl.search);
          id = searchParams.get("v")!;
        }
      }

      if (id === "") {
        alert.error("링크가 올바르지 않습니다.");
        return;
      }
    }

    Swal.fire({
      title: "기상송 확정",
      text: "기상송을 확정합니다. 동시에 기상송이 삭제되니, 주의하세요.",
      showCancelButton: true,
      confirmButtonText: "확정하기",
      confirmButtonColor: "#4054d6",
      cancelButtonText: "취소",
      icon: "warning",
      background: "rgb(var(--color-white) / 1)",
      color: "rgb(var(--color-text) / 1)",
    }).then(async (res) => {
      if (res.isConfirmed) {
        if (await confirmWakeup(id) && await confirmWakeupUpdate())
          await deleteWakeup(id);
      }
    });
  };

  const checkDelete = async (id: WakeupDB["id"]) => { 
    Swal.fire({
      title: "기상송 삭제",
      text: "기상송을 삭제합니다. 주의하세요.",
      showCancelButton: true,
      confirmButtonText: "삭제하기",
      confirmButtonColor: "#e11d48",
      cancelButtonText: "취소",
      icon: "warning",
      background: "rgb(var(--color-white) / 1)",
      color: "rgb(var(--color-text) / 1)",
    }).then(async (res) => {
      if (res.isConfirmed) {
        await deleteWakeup(id);
      }
    });
  };

  const confirmWakeup = async (id: WakeupDB["id"]) => {
    setLoading(true);
    const loading = alert.loading("기상송 확정 중 입니다.");
    let isSuccess = false;
    try{
      const res = await instance.put(
        "/api/teacher/wakeup", {
          id
        }
      );
      await getWakeup();
      alert.update(loading, res.data.message, "success");
      isSuccess = true;
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
    return isSuccess;
  };

  const confirmWakeupUpdate = async () => {
    setLoading(true);
    const loading = alert.loading("확정된 기상송 업데이트 중 입니다.");
    let isSuccess = false;
    try {
      const res = await instance.get("/api/wakeup/selected");
      setSelected(res.data.data);
      alert.update(loading, res.data.message, "success");
      isSuccess = true;
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
    return isSuccess;
  };

  const deleteWakeup = async (id: WakeupDB["id"]) => {
    setLoading(true);
    const loading = alert.loading("기상송 삭제 중 입니다.");
    try{
      const res = await instance.post(
        "/api/teacher/wakeup", {
          id
        }
      );
      await getWakeup();
      alert.update(loading, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
  };

  const sunday = week.clone().day(0);
  const saturday = week.clone().day(6).add(1, "day");

  return (
    <article className="flex flex-col gap-3">
      <section className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">기상송 신청 순위</h1>
        <h1 className="text-base">{sunday.format("MM월 DD일")} 18시 00분 ~ {saturday.format("MM월 DD일")} 17시 59분</h1>
      </section>
      <section className="flex flex-row justify-center items-center w-full gap-2">
        <input
          type="text"
          className="bg-transparent rounded border border-text/10 px-4 py-2 text-base w-full"
          placeholder="밑의 노래를 재생하시지 않으셨다면, 유튜브 링크를 여기에 붙여넣어주세요."
          onChange={(e) => setLink(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && checkConfirm("")}
        />
        <button
          className="w-min text-base rounded h-10 bg-text/10 border border-text/10 px-4"
          onClick={() => checkConfirm("")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px">
            <path
              d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"
              fill="rgb(var(--color-text) / 1)"/>
          </svg>
        </button>
      </section>
      <section className={[
        "flex flex-col gap-4 bg-white rounded border border-text/10 p-5 overflow-auto",
        loading ? "loading_background" : "",
      ].join(" ")}>

        <table className="w-full overflow-auto">
          <tbody className="w-full border-y border-text/10 overflow-auto">
            <tr className="w-full">
              <th className="text-center px-4 whitespace-nowrap py-2 font-semibold w-full"
                colSpan={2}>{gender === "male" ? "남" : "여"}학생 {selected.dateDiff===undefined?"평행세계":selected.dateDiff}의 기상송
              </th>
            </tr>
            {
              selected.id ? (
                <tr className="w-full border-y border-text/10">
                  <td></td>
                  <td
                    className="w-full text-left p-4"
                    onClick={() => {
                      const win = window.open(`https://www.youtube.com/watch?v=${selected.id}`, "_blank");
                      if (win) win.focus();
                    }}
                  >
                    <div className="flex flex-col gap-3">
                      <img
                        src={`https://i.ytimg.com/vi/${selected.id}/default.jpg`}
                        alt={selected.title}
                        className="max-w-[160px] object-cover rounded aspect-video cursor-pointer"
                      />
                      <p className="text-left cursor-pointer">{selected.title}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr className="w-full border-y border-text/10">
                  <td className="text-center px-4 whitespace-nowrap py-2 text-text/50" colSpan={3}>O.O 오늘은 기상송이 안나왔나봐요...!</td>
                </tr>
              )
            }
            <tr className="w-full">
              <th className="text-center px-4 whitespace-nowrap py-2 font-semibold w-full"
                colSpan={2}>{gender === "male" ? "남" : "여"}학생 기상송 신청 순위
              </th>
              <td className="text-center px-4">확정</td>
              <td className="text-center px-4">삭제</td>
            </tr>
            {
              Object.keys(wakeup).length ? Object.entries(wakeup)
                .sort((a, b) => a[1].count > b[1].count ? -1 : 1).map(([key, v], i) => (
                  <tr className="w-full border-y border-text/10" key={i}>
                    <td className="text-center px-4 whitespace-nowrap py-2">{i + 1}</td>
                    <td
                      className="w-full text-left p-4 border-x border-text/10"
                      onClick={() => {
                        const win = window.open(`https://www.youtube.com/watch?v=${key}`, "_blank");
                        if (win) win.focus();
                      }}
                    >
                      <div className="flex flex-col gap-3">
                        <img
                          src={`https://i.ytimg.com/vi/${key}/default.jpg`}
                          alt={v.title}
                          className="max-w-[160px] object-cover rounded aspect-video cursor-pointer"
                        />
                        <p className="text-left cursor-pointer">[{v.count}표] {v.title}</p>
                      </div>
                    </td>
                    <td
                      className="text-center px-4 border-x border-text/10 select-none"
                      onClick={() => checkConfirm(key)}
                    >
                      <div className="flex justify-center items-center h-full">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M8.33856 11.9489L6.01546 9.62581C5.87701 9.48734 5.70298 9.41651 5.49336 9.41331C5.28375 9.41009 5.1065 9.48093 4.96164 9.62581C4.81677 9.77068 4.74434 9.94631 4.74434 10.1527C4.74434 10.3591 4.81677 10.5347 4.96164 10.6796L7.70586 13.4238C7.88663 13.6046 8.09753 13.695 8.33856 13.695C8.57958 13.695 8.79047 13.6046 8.97124 13.4238L14.5347 7.86039C14.6732 7.72194 14.744 7.5479 14.7472 7.33828C14.7504 7.12867 14.6796 6.95143 14.5347 6.80656C14.3898 6.66169 14.2142 6.58926 14.0078 6.58926C13.8014 6.58926 13.6258 6.66169 13.4809 6.80656L8.33856 11.9489ZM9.75946 19.3027C8.44553 19.3027 7.2105 19.0534 6.05436 18.5547C4.89821 18.056 3.89253 17.3793 3.03731 16.5244C2.18208 15.6696 1.50502 14.6643 1.00614 13.5087C0.507254 12.3531 0.257812 11.1183 0.257812 9.80439C0.257812 8.49045 0.507146 7.25542 1.00581 6.09928C1.50448 4.94313 2.18123 3.93745 3.03606 3.08224C3.89091 2.227 4.89615 1.54994 6.05179 1.05106C7.2074 0.552177 8.44218 0.302734 9.75611 0.302734C11.07 0.302734 12.3051 0.552069 13.4612 1.05074C14.6174 1.5494 15.623 2.22615 16.4783 3.08098C17.3335 3.93583 18.0106 4.94108 18.5094 6.09671C19.0083 7.25233 19.2578 8.4871 19.2578 9.80104C19.2578 11.115 19.0084 12.35 18.5098 13.5061C18.0111 14.6623 17.3343 15.668 16.4795 16.5232C15.6247 17.3784 14.6194 18.0555 13.4638 18.5544C12.3082 19.0532 11.0734 19.3027 9.75946 19.3027ZM9.75779 17.8027C11.9911 17.8027 13.8828 17.0277 15.4328 15.4777C16.9828 13.9277 17.7578 12.036 17.7578 9.80271C17.7578 7.56938 16.9828 5.67771 15.4328 4.12771C13.8828 2.57771 11.9911 1.80271 9.75779 1.80271C7.52445 1.80271 5.63279 2.57771 4.08279 4.12771C2.53279 5.67771 1.75779 7.56938 1.75779 9.80271C1.75779 12.036 2.53279 13.9277 4.08279 15.4777C5.63279 17.0277 7.52445 17.8027 9.75779 17.8027Z"
                            fill="rgb(var(--color-text) / .35)"/>
                        </svg>
                      </div>
                    </td>
                    <td
                      className="text-center px-4 select-none"
                      onClick={() => checkDelete(key)}
                    >
                      <div className="flex justify-center items-center h-full">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M9.99998 11.0538L13.0731 14.1269C13.2115 14.2653 13.3856 14.3362 13.5952 14.3394C13.8048 14.3426 13.982 14.2718 14.1269 14.1269C14.2718 13.982 14.3442 13.8064 14.3442 13.6C14.3442 13.3936 14.2718 13.2179 14.1269 13.0731L11.0538 9.99998L14.1269 6.92688C14.2653 6.78843 14.3362 6.61439 14.3394 6.40478C14.3426 6.19518 14.2718 6.01794 14.1269 5.87308C13.982 5.72819 13.8064 5.65575 13.6 5.65575C13.3936 5.65575 13.2179 5.72819 13.0731 5.87308L9.99998 8.94615L6.92688 5.87308C6.78843 5.73461 6.61439 5.66378 6.40478 5.66058C6.19518 5.65736 6.01794 5.72819 5.87308 5.87308C5.72819 6.01794 5.65575 6.19358 5.65575 6.39998C5.65575 6.60638 5.72819 6.78201 5.87308 6.92688L8.94615 9.99998L5.87308 13.0731C5.73461 13.2115 5.66378 13.3856 5.66058 13.5952C5.65736 13.8048 5.72819 13.982 5.87308 14.1269C6.01794 14.2718 6.19358 14.3442 6.39998 14.3442C6.60638 14.3442 6.78201 14.2718 6.92688 14.1269L9.99998 11.0538ZM10.0016 19.5C8.68772 19.5 7.45268 19.2506 6.29655 18.752C5.1404 18.2533 4.13472 17.5765 3.2795 16.7217C2.42427 15.8669 1.74721 14.8616 1.24833 13.706C0.749442 12.5504 0.5 11.3156 0.5 10.0017C0.5 8.68772 0.749334 7.45268 1.248 6.29655C1.74667 5.1404 2.42342 4.13472 3.27825 3.2795C4.1331 2.42427 5.13834 1.74721 6.29398 1.24833C7.44959 0.749443 8.68437 0.5 9.9983 0.5C11.3122 0.5 12.5473 0.749334 13.7034 1.248C14.8596 1.74667 15.8652 2.42342 16.7205 3.27825C17.5757 4.1331 18.2527 5.13834 18.7516 6.29398C19.2505 7.44959 19.5 8.68437 19.5 9.9983C19.5 11.3122 19.2506 12.5473 18.752 13.7034C18.2533 14.8596 17.5765 15.8652 16.7217 16.7205C15.8669 17.5757 14.8616 18.2527 13.706 18.7516C12.5504 19.2505 11.3156 19.5 10.0016 19.5ZM9.99998 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 9.99998C18 7.76664 17.225 5.87498 15.675 4.32498C14.125 2.77498 12.2333 1.99998 9.99998 1.99998C7.76664 1.99998 5.87498 2.77498 4.32498 4.32498C2.77498 5.87498 1.99998 7.76664 1.99998 9.99998C1.99998 12.2333 2.77498 14.125 4.32498 15.675C5.87498 17.225 7.76664 18 9.99998 18Z"
                            fill="rgb(var(--color-text) / .35)"/>
                        </svg>
                      </div>
                    </td>
                  </tr>
                )) : (
                <tr className="w-full border-y border-text/10">
                  <td className="text-center px-4 whitespace-nowrap py-2 text-text/50" colSpan={3}>신청된 기상송이 없습니다.</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </section>
    </article>
  );
};

export default TeacherWakeupContent;