"use server";

import request from "@/utils/apis/fetch";
import {
  CustomResponseType,
  ErrorResponse,
  SuccessResponse,
} from "@/utils/apis/response";
import { setAuthCookie } from "@/utils/cookieHelper";
import { IAuthForm } from "./register";

export const loginAction = async <T = any>(
  data: Pick<IAuthForm, "email" | "password">
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
