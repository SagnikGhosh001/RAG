import { Context } from "../../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.12.27/dist/types/context.d.ts";
import { chunkText } from "./chunk.ts";
import { addDocument } from "./db_operations.ts";

export const addDocHandler = async (c: Context) => {
  const payload = await c.req.json();
  const chunks = chunkText(payload.doc, 300);

  for (const chunk of chunks) {
    await addDocument(chunk);
  }

  return c.json({ success: true, message: "document added" });
};
