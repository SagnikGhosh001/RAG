import { chunkText } from "./src/chunk.ts";
import { addDocument, search } from "./src/db_operations.ts";
const docs = [
  "Sachin Tendulkar is one of the greatest cricket players in history. He represented India for over two decades and scored 100 international centuries.",

  "Virat Kohli is known for his aggressive batting style and consistency across all formats of cricket. He has broken several batting records for India.",

  "MS Dhoni is regarded as one of the best cricket captains. His calm decision-making and finishing ability in limited-overs cricket made him legendary.",

  "Rohit Sharma is famous for his explosive batting and has scored multiple double centuries in One Day Internationals.",

  "Cricket is a bat-and-ball game played between two teams of eleven players. It is especially popular in India, Australia, England, and Pakistan.",

  "Football is the most popular sport in the world. It is played professionally across Europe, South America, and many other regions.",

  "Lionel Messi is widely regarded as one of the greatest football players of all time. He is known for his dribbling, vision, and goal scoring ability.",

  "Cristiano Ronaldo is famous for his athleticism, powerful shots, and consistent goal scoring across multiple top European clubs.",

  "Basketball is a fast-paced sport played primarily in the United States and other countries worldwide. It involves scoring points by shooting a ball through a hoop.",

  "Michael Jordan is considered the greatest basketball player of all time. He won six NBA championships with the Chicago Bulls.",

  "LeBron James is one of the greatest modern basketball players, known for his versatility, passing, and leadership on the court.",

  "Outdoor sports like cricket and football are very popular among kids in India. They help improve teamwork, fitness, and coordination.",

  "Sports in general improve physical health, mental well-being, and discipline. Many schools encourage students to participate in daily sports activities.",

  "The Indian Premier League (IPL) is a professional Twenty20 cricket league in India featuring franchise teams and international players.",

  "World Cup tournaments in both football and cricket attract millions of viewers globally and are among the most watched sporting events.",
];

const main = async () => {
  for (const doc of docs) {
    const chunks = chunkText(doc, 300);

    for (const chunk of chunks) {
      await addDocument(chunk);
    }
  }

  const searchedResult = await search("sachin plays cricket well");

  console.log(searchedResult.map((sr) => sr.text).join("\n"));
};

await main();
