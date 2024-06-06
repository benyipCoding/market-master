import axios from "axios";
import { CandlestickData, Time } from "lightweight-charts";

export const getDummyData = async () => {
  return axios.get<CandlestickData<Time>[]>("/api/dummy");
};
