import { extractDataFromReqBody } from "@/utils/request";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await extractDataFromReqBody(req);

  return NextResponse.json(data);
}
