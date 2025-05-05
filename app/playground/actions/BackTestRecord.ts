"use server";

import { OperationMode } from "@/components/interfaces/Playground";
import request from "@/utils/apis/fetch";
import { SuccessResponse, ErrorResponse } from "@/utils/apis/response";

export interface CreateRecordDto {
  operation_mode: OperationMode;
  latest_price: number;
  symbol_id: number;
  period_id: number;
  sliceLeft: number;
  sliceRight: number;
  key?: string;
}

export async function createOrUpdateBackTestRecord(dto: CreateRecordDto) {
  try {
    const res = await request.post(`/back-test`, dto);
    return SuccessResponse(res.data);
  } catch (error: any) {
    const errObj = JSON.parse(error.message);
    return ErrorResponse(errObj.message, errObj.statusCode);
  }
}

export async function deleteBackTestRecord(key: string) {
  try {
    const res = await request.delete(`/back-test/${key}`);
    return SuccessResponse(res.data);
  } catch (error: any) {
    const errObj = JSON.parse(error.message);
    return ErrorResponse(errObj.message, errObj.statusCode);
  }
}

export async function checkBackTestRecord() {
  try {
    const res = await request.get(`/back-test`);
    return SuccessResponse(res.data);
  } catch (error: any) {
    const errObj = JSON.parse(error.message);
    return ErrorResponse(errObj.message, errObj.statusCode);
  }
}
