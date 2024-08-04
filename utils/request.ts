export async function extractDataFromReqBody(req: Request): Promise<any> {
  const readableStream = req.body;
  const reader = readableStream?.getReader();
  if (!reader) throw new Error("Missing request body");

  let result = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += new TextDecoder().decode(value);
    }
  } finally {
    reader.releaseLock();
  }

  const data = JSON.parse(result);

  return data;
}
