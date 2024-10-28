"use server";

import { PayloadForCreateKlines } from "@/components/interfaces/UploadForm";
import request from "@/utils/apis/fetch";

export async function uploadKLine(payload: PayloadForCreateKlines) {
  const res = await request.post("k-line/bulk", payload);
  console.log(res.data);
}
