"use server";

import { PayloadForCreateKlines } from "@/components/interfaces/UploadForm";
import request from "@/utils/apis/fetch";
import { SuccessResponse, ErrorResponse } from "@/utils/apis/response";

export async function uploadKLine(payload: PayloadForCreateKlines) {
  try {
    const res = await request.post("k-line/bulk", payload);
    return SuccessResponse(res.data);
  } catch (error: any) {
    const errObj = JSON.parse(error.message);
    return ErrorResponse(errObj.message, errObj.statusCode);
  }
}
