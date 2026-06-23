import { chatWithOllama } from "./src/chat.ts";
import { chunkText } from "./src/chunk.ts";
import { addDocument, search } from "./src/db_operations.ts";
import { buildPrompt } from "./src/prompt.ts";
const docs = [
  "Sachin Tendulkar is widely regarded as one of the greatest batsmen in cricket history. He played international cricket for India for 24 years and was the first player to score 100 international centuries.",

  "Virat Kohli is known for chasing difficult targets and maintaining a high batting average across all formats of cricket. He is considered one of the best modern-era batsmen.",

  "MS Dhoni is famous for his calm leadership style and finishing matches under pressure. He captained India to victory in the 2007 T20 World Cup and 2011 ODI World Cup.",

  "Rohit Sharma holds the record for the highest individual score in One Day Internationals. He is known for his timing and ability to play long innings.",

  "Cricket is a bat-and-ball sport played between two teams of eleven players. Matches can be in formats like Test, ODI, and T20.",

  "Football is a global sport played between two teams of eleven players. It is especially popular in Europe and South America, with major tournaments like the FIFA World Cup.",

  "Lionel Messi is known for his extraordinary dribbling, playmaking ability, and consistency in scoring goals. He has won multiple Ballon d'Or awards.",

  "Cristiano Ronaldo is known for his physical fitness, heading ability, and goal-scoring record across multiple leagues including the Premier League and La Liga.",

  "Basketball is a fast-paced sport played on a rectangular court where teams try to score by shooting a ball through a hoop.",

  "Michael Jordan led the Chicago Bulls to six NBA championships and is widely considered the greatest basketball player in history.",

  "LeBron James is known for his versatility, passing ability, and long career at the top level of the NBA. He has played for multiple teams including the Miami Heat and Los Angeles Lakers.",

  "The Indian Premier League (IPL) is a professional Twenty20 cricket league in India featuring international players and franchise-based teams.",

  "Sports like cricket and football are widely played in schools across India and help improve physical fitness, teamwork, and discipline.",

  "International cricket tournaments like the ICC Cricket World Cup bring together the best teams from around the world every four years.",

  "Modern sports analytics use data science techniques to evaluate player performance, strategy, and match outcomes across cricket and football.",
];

const main = async () => {
  for (const doc of docs) {
    const chunks = chunkText(doc, 300);

    for (const chunk of chunks) {
      await addDocument(chunk);
    }
  }

  const question = prompt("Ask your question:-")!;
  const searchedResult = await search(question);
  const context = searchedResult.map((s) => s.text);
  const finalPrompt = buildPrompt(question, context);
  const answer = await chatWithOllama(finalPrompt);

  console.log(answer);
};

await main();
