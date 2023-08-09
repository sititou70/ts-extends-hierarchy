import { printGraph } from "./printGraph";
import { getRelations } from "./getRelations";

const main = () => {
  const relations = getRelations();

  console.log("```mermaid");
  console.log("flowchart BT");
  printGraph(relations);
  console.log("```");
};
main();
