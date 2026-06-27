export const buildPrompt = (question: string, context: string[]) => `
---

CONTEXT:
${context.map((c, i) => `${i + 1}. ${c}`).join("\n")}

---

QUESTION:
${question}

---

ANSWER:
`;
