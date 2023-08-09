# ts-extends-hierarchy

TS における[代入可能関係](https://www.typescriptlang.org/docs/handbook/type-compatibility.html#subtype-vs-assignment)のグラフを生成します。

```mermaid
flowchart BT
0["never"] --> 1["undefined"]
0["never"] --> 2["null"]
1["undefined"] --> 3["void"]
5["true"] --> 4["boolean"]
6["false"] --> 4["boolean"]
0["never"] --> 5["true"]
0["never"] --> 6["false"]
8["template literal"] --> 7["string"]
9["string literal"] --> 7["string"]
0["never"] --> 8["template literal"]
0["never"] --> 9["string literal"]
11["bigint literal"] --> 10["bigint"]
0["never"] --> 11["bigint literal"]
13["unique es symbol"] --> 12["es symbol"]
0["never"] --> 13["unique es symbol"]
0["never"] --> 14["number literal"]
16["number"] --> 15["numeric enum"]
16["number"] --> 17["numeric enum literal "]
14["number literal"] --> 16["number"]
15["numeric enum"] --> 16["number"]
17["numeric enum literal "] --> 16["number"]
19["tuple"] --> 18["array"]
0["never"] --> 19["tuple"]
0["never"] --> 20["function"]
23["{}"] --> 21["non primitive (object)"]
23["{}"] --> 22["Object"]
4["boolean"] --> 23["{}"]
7["string"] --> 23["{}"]
10["bigint"] --> 23["{}"]
12["es symbol"] --> 23["{}"]
16["number"] --> 23["{}"]
18["array"] --> 23["{}"]
20["function"] --> 23["{}"]
21["non primitive (object)"] --> 23["{}"]
22["Object"] --> 23["{}"]
2["null"] --> 24["unknown"]
3["void"] --> 24["unknown"]
23["{}"] --> 24["unknown"]
4["boolean"] -.-x 21["non primitive (object)"]
5["true"] -.-x 21["non primitive (object)"]
6["false"] -.-x 21["non primitive (object)"]
7["string"] -.-x 21["non primitive (object)"]
8["template literal"] -.-x 21["non primitive (object)"]
9["string literal"] -.-x 21["non primitive (object)"]
10["bigint"] -.-x 21["non primitive (object)"]
11["bigint literal"] -.-x 21["non primitive (object)"]
12["es symbol"] -.-x 21["non primitive (object)"]
13["unique es symbol"] -.-x 21["non primitive (object)"]
14["number literal"] -.-x 17["numeric enum literal "]
14["number literal"] -.-x 21["non primitive (object)"]
15["numeric enum"] -.-x 17["numeric enum literal "]
15["numeric enum"] -.-x 21["non primitive (object)"]
16["number"] -.-x 21["non primitive (object)"]
17["numeric enum literal "] -.-x 15["numeric enum"]
17["numeric enum literal "] -.-x 21["non primitive (object)"]
```

それぞれの型は、矢印を推移的にたどって到達可能な型に直接代入可能です。到達不可能なら直接代入も不可能です。

ただし、推移性の一部に例外があり、そのような関係は「バツの矢印」で示されます。これは、矢印の根の型を先（バツが書かれている側）の型に直接代入できないことを表します。

## 実行

以下のコマンドで`graph.md`が生成されます

```sh
npm i
npm start
```
