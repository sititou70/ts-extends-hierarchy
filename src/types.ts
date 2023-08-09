export type TypeName = string;
// 代入可能関係を表す。[subtype, supertype]、Relation[1] = Relation[0];
export type Relation = [TypeName, TypeName];
