"use server";

import request from "@/utils/apis/fetch";
import { SuccessResponse, ErrorResponse } from "@/utils/apis/response";

export async function cleanData() {
  try {
    const res = await request.delete("/k-line/clean");
    return SuccessResponse(res.data);
  } catch (error: any) {
    const errObj = JSON.parse(error.message);
    return ErrorResponse(errObj.message, errObj.statusCode);
  }
}
