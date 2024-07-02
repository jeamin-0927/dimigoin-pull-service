import "moment-timezone";
import moment from "moment";
import { YouTubeSearchResults } from "youtube-search";

export type WakeupData = {
  title: YouTubeSearchResults["title"];
  id: YouTubeSearchResults["id"];
  date: string;
  owner: string;
  gender: string;
  week: string;
}

export type WakeupSelected = {
  title: string;
  id: string;
  date: string;
  dateDiff: string;
}

export type WakeupDB = WakeupData & {
  _id: string;
}

export type WakeupGET = {
  [key: WakeupDB["id"]]: {
    title: WakeupDB["title"];
    date: WakeupDB["date"];
    count: number;
    week: WakeupDB["week"];
  };
};

export type CustomYoutubeSearchResult = YouTubeSearchResults & {
  my?: boolean
}

export const getToday = () => {
  const seoul = moment.tz("Asia/Seoul");
  const today = moment(seoul.format("YYYY-MM-DD"), "YYYY-MM-DD");
  return today;
};