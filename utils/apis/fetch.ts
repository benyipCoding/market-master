import axios from "axios";
import { cookies } from "next/headers";

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
  (err) => {
    throw new Error(JSON.stringify(err.response.data));
  }
);

export default request;
