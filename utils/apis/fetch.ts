import axios, { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { tokenRefresh } from "@/app/(root)/auth/login/tokenRefresh";
import { RefreshTokenKey } from "../cookieHelper";

const BASE_URL = process.env.BASE_URL + "/api";

const request = axios.create({
  baseURL: BASE_URL,
});

request.interceptors.request.use(
  (config) => {
    config.headers.Cookie = cookies().toString();

    return config;
  },
  (err) => {}
);

request.interceptors.response.use(
  (response) => {
    return response;
  },
  async (err: { response: AxiosResponse<any, any> }) => {
    const errResponseData: any = err.response.data;
    const errStr = JSON.stringify(errResponseData);

    try {
      if (errResponseData.statusCode === 401) {
        const config = err.response.config;

        const cookies: string[] = config.headers.Cookie.split(";");
        let refreshToken = cookies.find((cookie) =>
          cookie.includes(RefreshTokenKey)
        );

        if (!refreshToken) throw new Error(errStr);
        refreshToken = refreshToken.split("=")[1];

        await tokenRefresh(refreshToken);
        return request(config);
      }
    } catch (error: any) {
      // TODO: remove refresh token in cookie
      throw new Error(error.message);
    }

    throw new Error(errStr);
  }
);

export default request;
