"use server";

import request from "@/utils/apis/fetch";
import {
  CustomResponseType,
  ErrorResponse,
  SuccessResponse,
} from "@/utils/apis/response";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { AxiosResponse } from "axios";

const AuthCookieKey = "Authentication";

function setAuthCookie(res: AxiosResponse<any, any>) {
  // @ts-ignore
  const cookieHeader: string = res.headers.get("set-cookie")[0];

  if (cookieHeader) {
    const accessToken = cookieHeader.split(";")[0].split("=")[1];
    cookies().set({
      name: AuthCookieKey,
      value: accessToken,
      secure: true,
      httpOnly: true,
      expires: new Date(jwtDecode(accessToken).exp! * 1000),
    });
  }
}

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

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
