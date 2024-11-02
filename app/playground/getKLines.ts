"use server";

import request from "@/utils/apis/fetch";
import { SuccessResponse, ErrorResponse } from "@/utils/apis/response";

export interface ListKLineDto {
  symbol: number;
  period: number;
}

export async function getKLines(params: ListKLineDto) {
  try {
    const res = await request.get("/k-line", { params });
    return SuccessResponse(res.data);
  } catch (error: any) {
    const errObj = JSON.parse(error.message);
    return ErrorResponse(errObj.message, errObj.statusCode);
  }
}
