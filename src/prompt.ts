export const buildPrompt = (question: string, context: string[]) => `
You are a helpful assistant. Answer ONLY using the given context.

If the answer is not in the context, say "I don't know based on the given information."

---

CONTEXT:
${context.map((c, i) => `${i + 1}. ${c}`).join("\n")}

---

QUESTION:
${question}

---

ANSWER:
`;
