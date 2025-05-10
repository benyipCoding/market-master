"use server";

import {
  OrderSide,
  OrderType,
} from "@/components/interfaces/CandlestickSeries";
import { OperationMode } from "@/components/interfaces/Playground";
import request from "@/utils/apis/fetch";
import { SuccessResponse, ErrorResponse } from "@/utils/apis/response";
import { Time } from "lightweight-charts";

export interface CreateOrderDto {
  symbol_id: number;
  order_type: OrderType;
  side: OrderSide;
  opening_price: number;
  quantity: number;
  comment?: string;
  limit_price?: number;
  stop_price?: number;
  time: number | Time;
  expiry_time?: Date;
  operation_mode: OperationMode;
  backtest_id: string;
}

export type CreateOrderMarkerPayload = Pick<
  CreateOrderDto,
  "side" | "opening_price" | "time"
>;

export async function createOrder(data: CreateOrderDto) {
  try {
    const res = await request.post("/orders", data);
    return SuccessResponse(res.data);
  } catch (error: any) {
    const errObj = JSON.parse(error.message);
    return ErrorResponse(errObj.message, errObj.statusCode);
  }
}
