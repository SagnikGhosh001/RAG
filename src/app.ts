import { Hono } from "hono";
import { database } from "./store_docs.ts";
import { serveStatic } from "hono/deno";
import { logger } from "hono/logger";
import { addDocHandler } from "./addDocHandler.ts";
import { askQuestionHandler } from "./handlers.ts";

export const createApp = () => {
  const app = new Hono();

  app.use(logger());

  app.post("/add-doc", addDocHandler);
  app.post("/ask-question", askQuestionHandler);

  app.get("/get-doc", (c) => c.json({ success: true, database }));
  app.get("*", serveStatic({ root: "./public" }));

  return app;
};
