"use server";

import request from "@/utils/apis/fetch";
import { ErrorResponse, SuccessResponse } from "@/utils/apis/response";
import { removeAuthCookie } from "@/utils/cookieHelper";

export const logout = async () => {
  try {
    removeAuthCookie();
    // return SuccessResponse(res.data);
  } catch (error: any) {
    // const errObj = JSON.parse(error.message);
    // return ErrorResponse(errObj.message, errObj.statusCode);
  }
};
