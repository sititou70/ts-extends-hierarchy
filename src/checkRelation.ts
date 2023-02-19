type Type = {
  name: string;
  type: any;
};

enum EnumLiteralType {
  A,
  B,
}

const num = () => 1.5;
enum EnumType {
  A = num(),
  B = 3.14,
}

const uniqueESSymbol = Symbol("unique");

type TypeEntries = [
  {
    name: "non primitive (object)";
    type: object;
  },
  {
    name: "Object";
    type: Object;
  },
  {
    name: "{}";
    type: {};
  },
  {
    name: "string";
    type: string;
  },
  {
    name: "template literal";
    type: `hello`;
  },
  {
    name: "string literal";
    type: "hello";
  },
  {
    name: "number literal";
    type: 123;
  },
  {
    name: "(regular) enum";
    type: EnumType.A;
  },
  {
    name: "enum literal";
    type: EnumLiteralType;
  },
  {
    name: "enum literal member";
    type: EnumLiteralType.A;
  },
  {
    name: "number";
    type: number;
  },
  {
    name: "boolean";
    type: boolean;
  },
  {
    name: "true";
    type: true;
  },
  {
    name: "false";
    type: false;
  },
  {
    name: "bigint";
    type: bigint;
  },
  {
    name: "bigint literal";
    type: 123n;
  },
  {
    name: "es symbol";
    type: symbol;
  },
  {
    name: "unique es symbol";
    type: typeof uniqueESSymbol;
  },
  {
    name: "array";
    type: number[];
  },
  {
    name: "tuple";
    type: [number];
  },
  {
    name: "function";
    type: () => void;
  },
  {
    name: "void";
    type: void;
  },
  {
    name: "undefined";
    type: undefined;
  },
  {
    name: "null";
    type: null;
  },
  {
    name: "unknown";
    type: unknown;
  },
  {
    name: "never";
    type: never;
  }
];

// extends関係を表す。左の型 extends 右の型
type Relation = [Type["name"], Type["name"]];

type Main1<Types extends Type[]> = Main2<Types, Types, []>;
type Main2<
  RestTypes extends Type[],
  Types extends Type[],
  Results extends Relation[]
> = RestTypes extends [
  infer Subtype extends Type,
  ...infer RestRestTypes extends Type[]
]
  ? Main2<RestRestTypes, Types, [...Results, ...Main3<Subtype, Types, []>]>
  : Results;
type Main3<
  Subtype extends Type,
  Types extends Type[],
  Results extends Relation[]
> = Types extends [
  infer Supertype extends Type,
  ...infer RestTypes extends Type[]
]
  ? Subtype["type"] extends Supertype["type"]
    ? Main3<
        Subtype,
        RestTypes,
        [...Results, [Subtype["name"], Supertype["name"]]]
      >
    : Main3<Subtype, RestTypes, Results>
  : Results;

const results: Main1<TypeEntries> = null;
