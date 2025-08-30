"use server";

import { UpdateOrderPayload } from "@/components/interfaces/Playground";
import request from "@/utils/apis/fetch";
import { SuccessResponse, ErrorResponse } from "@/utils/apis/response";

export async function updateOrder(
  orderId: string,
  payload: UpdateOrderPayload
) {
  try {
    const res = await request.patch(`orders/${orderId}`, payload);
    return SuccessResponse(res.data);
  } catch (error: any) {
    const errObj = JSON.parse(error.message);
    return ErrorResponse(errObj.message, errObj.statusCode);
  }
}
