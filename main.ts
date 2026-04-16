import { addDocument, search } from "./src/db_operations.ts";

const main = async () => {
  await addDocument("Sachin Tendulkar is one of the greatest cricket players");
  await addDocument("Virat Kohli is a modern cricket legend");
  await addDocument("MS Dhoni is known for his calm captaincy");
  await addDocument("Rohit Sharma plays aggressive cricket");
  await addDocument("Football is a very popular sport in Europe");
  await addDocument("Lionel Messi is one of the best football players");
  await addDocument("Cristiano Ronaldo is famous for scoring goals");
  await addDocument("Basketball is played widely in the USA");
  await addDocument("Michael Jordan is a basketball legend");
  await addDocument("Cricket is played with bat and ball");
  await addDocument("Sachin played cricket for India for many years");
  await addDocument(
    "Kids love playing outdoor sports like cricket and football",
  );
  const searchedResult = await search("sachin plays cricket well");

  console.log(searchedResult.map((sr) => sr.text).join("\n"));
};

await main();
