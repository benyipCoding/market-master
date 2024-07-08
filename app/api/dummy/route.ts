// import axios from "axios";
// import { CandlestickData, Time } from "lightweight-charts";
import { NextResponse } from "next/server";
import fs from "node:fs";
import { join } from "node:path";

export async function GET(req: Request) {
  const data = fs.readFileSync(join(process.cwd(), "./dummy.json"));

  return NextResponse.json(JSON.parse(data.toString()));
}
