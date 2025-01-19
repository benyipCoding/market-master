"use server";

import request from "@/utils/apis/fetch";
import { ErrorResponse, SuccessResponse } from "@/utils/apis/response";

export interface IAuthForm {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}

export const register = async (data: IAuthForm) => {
  try {
    const res = await request.post("/users", data);
    return SuccessResponse(res.data);
  } catch (error: any) {
    const errObj = JSON.parse(error.message);
    return ErrorResponse(errObj.message, errObj.statusCode);
  }
};
