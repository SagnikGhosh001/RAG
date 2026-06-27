import { Message } from "./store.ts";

export const chatWithOllama = async (messages: Message[]) => {
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: "gemma4:latest",
      messages,
      stream: false,
    }),
  });

  const data = await res.json();
  messages.push(data.message);
  return data.message?.content;
};
