import { createApp } from "./src/app.ts";

const main = () => {
  const app = createApp();
  Deno.serve(app.fetch);
};

main();
