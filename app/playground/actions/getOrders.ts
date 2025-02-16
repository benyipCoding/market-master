"use server";

import { ListOrderDto } from "@/components/interfaces/Playground";
import request from "@/utils/apis/fetch";
import { SuccessResponse, ErrorResponse } from "@/utils/apis/response";

export async function getOrders(params: ListOrderDto) {
  try {
    const res = await request.get("/orders", { params });
    return SuccessResponse(res.data);
  } catch (error: any) {
    const errObj = JSON.parse(error.message);
    return ErrorResponse(errObj.message, errObj.statusCode);
  }
}
