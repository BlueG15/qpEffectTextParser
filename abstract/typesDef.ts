//array of any level of nested arrays of T
export type nestedTree<T> = T[] | nestedTree<T>[]