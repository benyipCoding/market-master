"use server";

import request from "@/utils/apis/fetch";
import { CustomResponseType, SuccessResponse } from "@/utils/apis/response";
import { setAuthCookie } from "@/utils/cookieHelper";

export async function tokenRefresh<T = any>(
  refreshToken: string
): Promise<CustomResponseType<T>> {
  const res = await request.get("/auth/token-refresh", {
    headers: {
      refreshToken,
    },
  });

  setAuthCookie(res);

  return SuccessResponse(res.data);
}
