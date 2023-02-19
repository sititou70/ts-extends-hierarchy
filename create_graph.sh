#!/bin/sh

set -eu
cd $(dirname $0)

# main

relations=$(npx tsc | sed -r "s/^.+'null' is not assignable to type '(.+)'.$/\1/")

rm -rf TEMP_*
mkdir TEMP_ws

echo "const relations: Relation[] = $relations;" >TEMP_ws/createGraph.ts
cat src/createGraph.ts >>TEMP_ws/createGraph.ts
graph=$(npx ts-node TEMP_ws/createGraph.ts)

echo '```mermaid' >graph.md
echo 'flowchart BT' >>graph.md
echo "$graph" >>graph.md
echo '```' >>graph.md
