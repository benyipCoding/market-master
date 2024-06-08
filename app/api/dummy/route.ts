import axios from "axios";
import { CandlestickData, Time } from "lightweight-charts";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const res = await axios.get<CandlestickData<Time>[]>(
    "http://localhost:3000/api/xau-usd/chart-data"
  );

  return NextResponse.json(res.data);
}
