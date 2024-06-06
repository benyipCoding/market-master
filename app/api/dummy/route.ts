import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("hello world");
  const res = await axios.get("http://localhost:3001/api/xau-usd/chart-data");

  return NextResponse.json(res.data);
}
