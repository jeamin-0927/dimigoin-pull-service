import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import styles from "&/pages/Wash.module.css";
import { WashReturn } from "@/pages/api/wash";
import { isLoadingAtom, myInfoAtom, userInfoAtom } from "@/utils/states";

const washerId2Name = (
  id: string
) => {
  const where = id[0] == "W" ? "우정학사" : "학봉관";
  const floor = id[1];

  const type = {
    "N": "",
    "L": "왼쪽",
    "C": "중앙",
    "R": "오른쪽"
  };
  
  return `${where} ${floor}층 ${type[id[2]]}`;
};

const WashNowBox = ({
  data
}: {
  data: [string, WashReturn["washerData"][string]]
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.nowBox} onClick={() => setShow(!show)}>
      <div className={styles.nowTitle}>[{data[1].grade.join(", ") === "1, 2, 3" ? "전체" : data[1].grade.join(", ")}학년] {washerId2Name(data[0])}</div>
      {
        show && (
          <div className={styles.nowInfo}>
            {
              Object.entries(data[1].time).map((time, i) => (
                <div 
                  className={styles.nowTimeBox} 
                  style={{
                    opacity: time[1] ? 1 : 0.3
                  }}
                  key={i}
                >
                  <div className={styles.nowTime}>{time[0]}</div>
                  <div className={styles.nowWho}>{time[1]}</div>
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  );
};

const WashApply = ({
  washdataState, 
  LoadData
}: {
  washdataState: [WashReturn["washerData"], React.Dispatch<React.SetStateAction<WashReturn["washerData"]>>],
  LoadData: () => void
}) => {
  const [myInfo, setMyInfo] = useRecoilState(myInfoAtom);
  const [selected, setSelected] = useState({
    washer: "",
    time: ""
  });
  const [washdata, setWashdata] = washdataState;
  const myGrade = Math.floor(myInfo && myInfo.number / 1000);

  const washerButton = async () => {
    if (!selected.time) return;
    const { data } = await axios({
      method: "POST",
      url: "/api/wash",
      data: {
        washer: selected.washer,
        time: selected.time
      }
    });
    await LoadData();
    alert(data.message);
  };

  return (
    <div className={styles.apply}>
      <select 
        className={styles.applySelect} 
        value={selected.washer}
        onChange={(e) => {
          setSelected({
            washer: e.target.value,
            time: ""
          });
        }}
      >
        <option value="">세탁기를 선택해주세요</option>
        {
          myInfo && Object.entries(washdata).map((data, i) => (
            <option 
              value={data[0]} 
              key={i}
              disabled={
                !data[1].grade.includes(myGrade) ||
                    ((data[0][0] === "W" ? "female" : "male") !== myInfo.gender)
              }
            >
              [{data[1].grade.join(", ") === "1, 2, 3" ? "전체" : data[1].grade.join(", ")}학년] {washerId2Name(data[0])}
            </option>
          ))
        }
      </select>
      <select 
        className={styles.applySelect} 
        value={selected.time}
        onChange={(e) => {
          setSelected({
            ...selected,
            time: e.target.value
          });
        }}
      >
        <option value="">세탁 시간을 선택해주세요</option>
        {
          selected.washer && Object.entries(washdata[selected.washer].time).map((time, i) => (
            <option 
              value={time[0]} 
              key={i} 
              disabled={Boolean(time[1])}
            >
              {time[0]}
            </option>
          ))
        }
      </select>
      <input 
        className={[styles.applyBtn, selected.time && styles.applyBtnActive].join(" ")}
        type="button"
        value="신청하기"
        onClick={washerButton}
      />
    </div>
  );
};

const WashApplyed = ({myWasherDataState, LoadData}) => {
  const [myWasherData, setMyWasherData] = myWasherDataState;
  const [loading, setLoading] = useRecoilState(isLoadingAtom);

  const washerButton = async () => {
    setLoading(true);
    const { data } = await axios({
      method: "DELETE",
      url: "/api/wash",
    });
    await LoadData();
    setLoading(false);
    alert(data.message);
  };

  return (
    <div className={styles.applyEnd}>
      <div className={styles.applyEndInfo}>오늘 예약한 세탁기가 있어요.</div>
      <div className={styles.applyEndData}>{washerId2Name(myWasherData.washer)} {myWasherData.time.replaceAll("* ", "")}</div>
      <input 
        className={styles.applyEndBtn}
        type="button"
        value="취소하기"
        onClick={washerButton}
      />
    </div>
  );
};

const Wash = () => {
  const [myInfo, setMyInfo] = useRecoilState(myInfoAtom);
  const [washdata, setWashdata] = useState<WashReturn["washerData"]>({});
  const [myWasherData, setMyWasherData] = useState<WashReturn["myWasherData"]>(null);
  const [loading, setLoading] = useRecoilState(isLoadingAtom);
  const [checker, setChecker] = useRecoilState(userInfoAtom);
  const [washerAvailable, setWasherAvailable] = useState<WashReturn["isWasherAvailable"]>(false);
  const [washerTime, setWasherTime] = useState<WashReturn["washerTime"]>({
    start: [],
    end: []
  });

  const LoadData = async () => {
    setLoading(true);
    const { data }: { data: WashReturn } = await axios.get("/api/wash");
    setWashdata(data.washerData);
    setMyWasherData(data.myWasherData);
    setWasherAvailable(data.isWasherAvailable);
    setWasherTime(data.washerTime);

    const newChecker = { ...checker };
    if(newChecker.wash !== undefined) {
      newChecker.wash = data.myWasherData ? true : false;
      setChecker(newChecker); 
    }
    setLoading(false);
  };

  useEffect(() => {
    LoadData();
  }, []);

  return (
    <div className={styles.wash}>
      <div className={styles.box}>
        <div className={styles.title}>세탁 신청하기</div>
        {
          washerAvailable ? myWasherData ? 
            <WashApplyed myWasherDataState={[myWasherData, setMyWasherData]} LoadData={LoadData} />
            : 
            <WashApply washdataState={[washdata, setWashdata]} LoadData={LoadData} />
            :
            (
              <div className={styles.applyEnd}>
                <div className={styles.applyEndInfo}>세탁 예약 시간이 아니에요.</div>
                <div className={styles.applyEndData}>
                  {
                    washerTime.start[0] ?
                      `${String(washerTime.start[0]).padStart(2, "0")}시 ${String(washerTime.start[1]).padStart(2, "0")}분부터 ${String(washerTime.end[0]).padStart(2, "0")}시 ${String(washerTime.end[1]).padStart(2, "0")}분까지 신청 가능합니다.`
                      : "세탁 예약을 할 수 없어요."
                  }
                </div>
              </div>
            )
        }
      </div>

      <div className={styles.boxLine}>
        <div className={styles.boxLineInner} />
      </div>

      <div className={styles.box}>
        <div className={styles.title}>세탁 신청 현황</div>
        <div className={styles.now}>
          {
            Object.entries(washdata).map((data, i) => (
              <WashNowBox data={data} key={i} />
            ))
          }
        </div>
      </div>

    </div>
  );
};

export default Wash;