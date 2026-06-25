import { Context } from "hono";
import { chunkText } from "./chunk.ts";
import { addDocument, search } from "./db_operations.ts";
import { buildPrompt } from "./prompt.ts";
import { chatWithOllama } from "./chat.ts";

export const addDocHandler = async (c: Context) => {
  const payload = await c.req.json();
  const chunks = chunkText(payload.doc, 300);

  for (const chunk of chunks) {
    await addDocument(chunk);
  }

  return c.json({ success: true, message: "document added" });
};

export const askQuestionHandler = async (c: Context) => {
  const payload = await c.req.json();
  const question = payload.question;
  const searchedResult = await search(question);
  const context = searchedResult.map((s) => s.text);

  const finalPrompt = buildPrompt(question, context);
  const answer = await chatWithOllama(finalPrompt);
  return c.json({ success: true, data: answer });
};
