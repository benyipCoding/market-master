"use server";

import request from "@/utils/apis/fetch";
import { ErrorResponse, SuccessResponse } from "@/utils/apis/response";

export const getMe = async () => {
  try {
    const res = await request.get("/users/me");
    return SuccessResponse(res.data);
  } catch (error: any) {
    const errObj = JSON.parse(error.message);
    return ErrorResponse(errObj.message, errObj.statusCode);
  }
};
