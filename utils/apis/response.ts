export interface CustomResponseType<T = any> {
  status: number;
  msg: string;
  data: T;
  timestamp: number;
}

export enum Status {
  OK = 200,
  Fail = 400,
}

export const ErrorResponse = (
  msg: string,
  status: number = Status.Fail
): CustomResponseType => ({
  status,
  msg,
  data: null,
  timestamp: Date.now(),
});

export const SuccessResponse = <T = any>(data: T): CustomResponseType<T> => ({
  status: Status.OK,
  msg: "success",
  data,
  timestamp: Date.now(),
});
