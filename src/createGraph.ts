// const relations: Relation[] = [];

type Type = string;
// extends関係を表す。左の型 extends 右の型
type Relation = [Type, Type];

const allTypes: Set<Type> = new Set(
  relations.flatMap((relation) => [relation[0], relation[1]])
);

const getTypeId: Map<Type, string> = new Map(
  Array.from(allTypes.values()).map((type, i) => [type, i.toString()])
);

const getSuperTypes = (type: Type, relations: Relation[]): Type[] =>
  relations
    .filter((relation) => relation[0] !== relation[1])
    .filter((relation) => relation[0] === type)
    .map((relation) => relation[1]);

const isExtendsRelation = (
  subtype: Type,
  superType: Type,
  relations: Relation[]
): boolean => {
  const visitSuperTypes = (type: Type, path: Type[]): boolean => {
    if (type === superType) return true;
    if (path.includes(type)) return false;

    const nextTypes = getSuperTypes(type, relations);
    if (nextTypes === undefined) return false;

    for (const nextType of nextTypes) {
      if (visitSuperTypes(nextType, [...path, type])) return true;
    }

    return false;
  };
  return visitSuperTypes(subtype, []);
};

const isCompatibleRelations = (
  simplifiedRelations: Relation[],
  relations: Relation[]
): boolean => {
  for (const relation of relations) {
    if (!isExtendsRelation(relation[0], relation[1], simplifiedRelations))
      return false;
  }

  return true;
};

const printEdge = (
  relation: Relation,
  mode: "normal" | "not-related" | "limited-relation"
) => {
  const arrow = {
    normal: "-->",
    "not-related": "-.-x",
    "limited-relation": "-.->",
  }[mode];

  console.log(
    `${getTypeId.get(relation[0])}["${relation[0]}"] ${arrow} ${getTypeId.get(
      relation[1]
    )}["${relation[1]}"]`
  );
};

const main = () => {
  let simplifiedRelations = relations.filter(
    (relation) => relation[0] !== relation[1]
  );

  // 削除しても問題ないエッジを削除。推移律を仮定して、元の関係と互換性があれば削除する
  for (const relation of relations) {
    const moreSimplifiedRelations = simplifiedRelations.filter(
      (simplifiedRelation) =>
        !(
          relation[0] === simplifiedRelation[0] &&
          relation[1] === simplifiedRelation[1]
        )
    );

    if (isCompatibleRelations(moreSimplifiedRelations, relations)) {
      simplifiedRelations = moreSimplifiedRelations;
    }
  }
  // 通常のエッジを描画する
  for (const relation of simplifiedRelations) {
    printEdge(relation, "normal");
  }

  // 推移律を仮定したとき、simplifiedRelationsと元の関係で齟齬があるエッジを描画する
  for (const subType of allTypes) {
    for (const superType of allTypes) {
      const isOriginalRelation = relations.some(
        (relation) => relation[0] === subType && relation[1] === superType
      );
      const isSimplifiedRelation = isExtendsRelation(
        subType,
        superType,
        simplifiedRelations
      );

      if (isOriginalRelation !== isSimplifiedRelation) {
        if (isOriginalRelation) {
          printEdge([subType, superType], "limited-relation");
        } else {
          printEdge([subType, superType], "not-related");
        }
      }
    }
  }
};
main();
