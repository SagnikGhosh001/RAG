export const getEmbedding = async (prompt: string) => {
  const res = await fetch("http://localhost:11434/api/embeddings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: "embeddinggemma:300m",
      prompt,
    }),
  });

  const data = await res.json();
  return data.embedding;
};
