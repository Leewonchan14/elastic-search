import { search } from "./search-default";

const main = async () => {
  const body = await search();
  console.log("body: ", JSON.stringify(body, null, 2));
};

main();
