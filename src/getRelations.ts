import fs from "fs";
import { execSync } from "child_process";
import { Relation, TypeName } from "./types";

const header = `
import fs from "fs";

enum NumericEnums {
  A = 1,
  B = 2,
}

enum StringEnums {
  A = "A",
  B = "B",
}

const esSymbol = Symbol("unique");
`;

type Entry = { name: TypeName; type: string; value: string };
const entries: Entry[] = [
  { name: "never", type: "never", value: "(() => {while (true) {}})()" },

  { name: "undefined", type: "undefined", value: "undefined" },
  { name: "null", type: "null", value: "null" },
  { name: "void", type: "void", value: "undefined" },

  { name: "boolean", type: "boolean", value: "true" },
  { name: "true", type: "true", value: "true" },
  { name: "false", type: "false", value: "false" },

  { name: "string", type: "string", value: '"string"' },
  { name: "template literal", type: "`template literal`", value: '"template literal"' },
  { name: "string literal", type: '"string literal"', value: '"string literal"' },
  { name: "string enums", type: "StringEnums", value: "StringEnums.A" },

  { name: "bigint", type: "bigint", value: "123n" },
  { name: "bigint literal", type: "123n", value: "123n" },

  { name: "es symbol", type: "symbol", value: "esSymbol" },
  { name: "unique es symbol", type: "typeof esSymbol", value: "esSymbol" },

  { name: "number literal", type: "3", value: "3" },
  { name: "number", type: "number", value: "4" },

  { name: "numeric enums", type: "NumericEnums", value: "NumericEnums.A" },

  { name: "array", type: "number[]", value: "[1]" },
  { name: "tuple", type: "[number]", value: "[1]" },
  { name: "function", type: "() => void", value: "() => {}" },

  { name: "non primitive (object)", type: "object", value: "{}" },
  { name: "Object", type: "Object", value: "{}" },
  { name: "{}", type: "{}", value: "{}" },

  { name: "unknown", type: "unknown", value: "{}" },
];

export const getRelations = (): Relation[] => {
  try {
    fs.rmSync("TEMP_ws", { recursive: true });
  } catch {}
  fs.mkdirSync("TEMP_ws");

  const sanitizeVariableName = (name: string) => name.replace(/[ (){}]/g, "_") + "Variable";
  const variables = entries
    .map((entry) => `let ${sanitizeVariableName(entry.name)}: ${entry.type} = ${entry.value};`)
    .join("\n");

  const allRelations: Relation[] = [];
  for (const targetEntry of entries) {
    for (const sourceEntry of entries) {
      //if (targetEntry.name === sourceEntry.name) continue;

      allRelations.push([sourceEntry.name, targetEntry.name]);
      const index = allRelations.length - 1;

      fs.writeFileSync(
        `TEMP_ws/${index}.ts`,
        [
          header,
          variables,
          `${sanitizeVariableName(targetEntry.name)} = ${sanitizeVariableName(sourceEntry.name)};`,
        ].join("\n"),
      );
    }
  }

  let output: string = "";
  try {
    execSync("npm exec -- tsc --project tsconfig.get-relations.json");
  } catch (e) {
    output = (e as any).output.toString();
  }

  const relations: Relation[] = [];
  for (const [index, relation] of allRelations.entries()) {
    if (output.indexOf(`TEMP_ws/${index}.ts`) === -1) relations.push(relation);
  }

  return relations;
};
