# ts-extends-hierarchy

TS における[代入可能関係](https://www.typescriptlang.org/docs/handbook/type-compatibility.html#subtype-vs-assignment)のグラフを生成します。

```mermaid
flowchart BT
0["non primitive (object)"] --> 2["{}"]
1["Object"] --> 2["{}"]
2["{}"] --> 0["non primitive (object)"]
2["{}"] --> 1["Object"]
2["{}"] --> 3["unknown"]
4["string"] --> 2["{}"]
5["template literal"] --> 6["string literal"]
6["string literal"] --> 4["string"]
6["string literal"] --> 5["template literal"]
7["number literal"] --> 9["number"]
8["(regular) enum"] --> 9["number"]
10["enum literal"] --> 9["number"]
11["enum literal member"] --> 9["number"]
9["number"] --> 2["{}"]
9["number"] --> 8["(regular) enum"]
9["number"] --> 10["enum literal"]
9["number"] --> 11["enum literal member"]
12["boolean"] --> 2["{}"]
13["true"] --> 12["boolean"]
14["false"] --> 12["boolean"]
15["bigint"] --> 2["{}"]
16["bigint literal"] --> 15["bigint"]
17["es symbol"] --> 2["{}"]
18["unique es symbol"] --> 17["es symbol"]
19["array"] --> 2["{}"]
20["tuple"] --> 19["array"]
21["function"] --> 2["{}"]
22["void"] --> 3["unknown"]
23["undefined"] --> 22["void"]
24["null"] --> 3["unknown"]
25["never"] --> 6["string literal"]
25["never"] --> 7["number literal"]
25["never"] --> 13["true"]
25["never"] --> 14["false"]
25["never"] --> 16["bigint literal"]
25["never"] --> 18["unique es symbol"]
25["never"] --> 20["tuple"]
25["never"] --> 21["function"]
25["never"] --> 23["undefined"]
25["never"] --> 24["null"]
4["string"] -.-x 0["non primitive (object)"]
5["template literal"] -.-x 0["non primitive (object)"]
6["string literal"] -.-x 0["non primitive (object)"]
7["number literal"] -.-x 0["non primitive (object)"]
7["number literal"] -.-x 10["enum literal"]
7["number literal"] -.-x 11["enum literal member"]
8["(regular) enum"] -.-x 0["non primitive (object)"]
8["(regular) enum"] -.-x 10["enum literal"]
8["(regular) enum"] -.-x 11["enum literal member"]
9["number"] -.-x 0["non primitive (object)"]
10["enum literal"] -.-x 0["non primitive (object)"]
10["enum literal"] -.-x 8["(regular) enum"]
10["enum literal"] -.-x 11["enum literal member"]
11["enum literal member"] -.-x 0["non primitive (object)"]
11["enum literal member"] -.-x 8["(regular) enum"]
12["boolean"] -.-x 0["non primitive (object)"]
13["true"] -.-x 0["non primitive (object)"]
14["false"] -.-x 0["non primitive (object)"]
15["bigint"] -.-x 0["non primitive (object)"]
16["bigint literal"] -.-x 0["non primitive (object)"]
17["es symbol"] -.-x 0["non primitive (object)"]
18["unique es symbol"] -.-x 0["non primitive (object)"]
```

それぞれの型は、矢印を推移的にたどって到達可能な型に直接代入可能です。到達不可能なら直接代入も不可能です。

ただし、推移性の一部に例外があり、そのような関係は「バツの矢印」で示されます。これは、矢印の根の型を先（バツが書かれている側）の型に直接代入できないことを表します。

## 実行

以下のコマンドで`graph.md`が生成されます

```sh
npm i
./create_graph.sh
```

## 仕組み

とても変なことをしているのでマネしないでください。

まず、`create_graph.sh`は`checkSubtypeRelation.ts`を型検査します。このファイルは、予め与えられた型同士の代入可能関係を計算し、その結果を以下のようなタプル型として表し、`null`型の変数に代入しようとします。

```typescript
[["unknown", "unknown"], ["{}", "unknown"], ... ]
```

当然、tsc は次のようなエラーを出します

```
src/checkSubtypeRelation.ts:116:7 - error TS2322: Type 'null' is not assignable to type '[["unknown", "unknown"], ["{}", "unknown"], ...
```

`create_graph.sh`は、sed を使って`[["unknown", "unknown"], ...`の部分の文字列を取り出します。

次に、`create_graph.sh`は`createGraph.ts`の先頭に、先程の型を TS の値として追加します。つまり、以下のようなコードを生成します。

```typescript
const relations = [["unknown", "unknown"], ["{}", "unknown"], ... ];
```

そして、`createGraph.ts`を実行すると、グラフの`mermaid`コードが生成され、それが`graph.md`に書き出されます。

したがって、`src`以下の 2 つのファイルで型エラーが起きているのは意図した挙動です。

上記の方法はまったく正攻法ではありません。本当は TS の API などを駆使して実現したかったのですが、それを調べる時間がありませんでした。
