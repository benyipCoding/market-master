"use server";

import request from "@/utils/apis/fetch";

export async function uploadKLine(formData: FormData) {
  const res = await request.post("/upload/k-line", formData);
}
