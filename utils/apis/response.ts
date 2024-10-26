export interface CustomResponseType<T = any> {
  status: number;
  msg: string;
  data: T;
  timestamp: number;
}

export const ErrorResponse = (
  msg: string,
  status: number = 400
): CustomResponseType => ({
  status,
  msg,
  data: null,
  timestamp: Date.now(),
});

export const SuccessResponse = <T = any>(data: T): CustomResponseType<T> => ({
  status: 200,
  msg: "success",
  data,
  timestamp: Date.now(),
});
