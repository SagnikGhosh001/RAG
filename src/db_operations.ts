import { getEmbedding } from "./embedding.ts";
import { database } from "./store_docs.ts";

export const addDocument = async (text: string) => {
  const embedding = await getEmbedding(text);
  database.push({ text, embedding });
};

const cosineSimilarity = (a: number[], b: number[]) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
};

export const search = async (text: string) => {
  const queryEmbedding = await getEmbedding(text);
  return database.map((doc) => ({
    text: doc.text,
    match: cosineSimilarity(doc.embedding, queryEmbedding),
  })).sort((a, b) => b.match - a.match)
    .slice(0, 3);
};
