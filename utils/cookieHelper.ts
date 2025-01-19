import { AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export const AuthCookieKey = "Authentication";
export const RefreshTokenKey = "RefreshToken";

export function cookieHandler(key: string, cookieHeader: string[]) {
  let token = cookieHeader.find((cookie) => cookie.includes(key));
  if (!token) return;
  token = token.split(";")[0].split("=")[1];
  cookies().set({
    name: key,
    value: token,
    secure: true,
    httpOnly: true,
    expires: new Date(jwtDecode(token).exp! * 1000),
  });
}

export function setAuthCookie(res: AxiosResponse<any, any>) {
  // @ts-ignore
  const cookieHeader: string[] = res.headers.get("set-cookie");

  if (!cookieHeader) return;
  // Access token
  cookieHandler(AuthCookieKey, cookieHeader);

  // Refresh token
  cookieHandler(RefreshTokenKey, cookieHeader);
}

export type Tokens = {
  accessToken: string;
  refreshToken?: string;
};

export function removeAuthCookie() {
  // 删除认证相关的 cookies
  cookies().delete(AuthCookieKey);
  cookies().delete(RefreshTokenKey);
}
