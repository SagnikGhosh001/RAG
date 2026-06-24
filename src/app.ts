import { Hono } from "hono";
import { addDocument, search } from "./db_operations.ts";
import { chunkText } from "./chunk.ts";
import { database } from "./store_docs.ts";
import { chatWithOllama } from "./chat.ts";
import { buildPrompt } from "./prompt.ts";

export const createApp = () => {
  const app = new Hono();

  app.post("/add-doc", async (c) => {
    const payload = await c.req.json();
    const chunks = chunkText(payload.doc, 300);

    for (const chunk of chunks) {
      await addDocument(chunk);
    }

    return c.json({ success: true, message: "document added" });
  });

  app.get("/get-doc", (c) => c.json({ success: true, database }));

  app.post("/ask-question", async (c) => {
    const payload = await c.req.json();
    const question = payload.question;
    const searchedResult = await search(question);
    const context = searchedResult.map((s) => s.text);
    const finalPrompt = buildPrompt(question, context);
    const answer = await chatWithOllama(finalPrompt);
    return c.json({ success: true, data: answer });
  });

  return app;
};
