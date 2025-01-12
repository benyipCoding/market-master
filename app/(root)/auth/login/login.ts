"use server";

import request from "@/utils/apis/fetch";
import {
  CustomResponseType,
  ErrorResponse,
  SuccessResponse,
} from "@/utils/apis/response";
import { setAuthCookie } from "@/utils/cookieHelper";

export const LoginTest = async <T = any>(
  data: Record<string, string>
): Promise<CustomResponseType<T>> => {
  try {
    const res = await request.post("/auth/login", data);
    setAuthCookie(res);
    return SuccessResponse(res.data);
  } catch (error: any) {
    const errObj = JSON.parse(error.message);
    return ErrorResponse(errObj.message, errObj.statusCode);
  }
};
