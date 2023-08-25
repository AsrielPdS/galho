export type int = number;
export type float = number;
export type str = string;
export type bool = boolean;
export type unk = unknown;
export type Obj = Object;
export type Primitive = str | number | bool;
export type Key = string | number;
export interface Dic<T = any> {
  [key: string]: T;
}
/**json array */
export type JsonA = JsonR[];
/**json object */
export type JsonO = { [key: string]: JsonR }
/**json result */
export type JsonR = str | float | bool | null | JsonA | JsonO;

export type falsy = false | 0 | 0n | -0 | "" | undefined | null;
export type Pair<V = any, K = str> = [key: K, val: V];
export type Arr<T> = T[] | T;
export type Task<T> = T | Promise<T>;

/**check if value is instance of type */
export const is = <T extends Object>(value: unk, type: abstract new (...args: any) => T): value is T => value instanceof type;
/**is string */
export const isS = (value: unk): value is str => typeof value === "string";
/**is function */
export const isF = (value: unk): value is Function => typeof value === "function";

/** is object */
export const isO = (value: unk): value is Dic => typeof value === "object";
/**is number */
export const isN = (value: unk): value is number => typeof value === "number";
/** is boolean */
export const isB = (value: unk): value is boolean => typeof value === "boolean";
/** is undefined */
export const isU = (value: unk): value is undefined => value === undefined;
/** is promise like */
export const isP = (value: any): value is PromiseLike<any> => value && isF(value.then);
/** is array */
export const isA = <T = any>(value: any): value is T[] => Array.isArray(value);
export const wait = (ms?: int) => new Promise(r => setTimeout(r, ms));
export const assign: { <T>(t: T, ...s: Partial<T>[]): T } & typeof Object.assign = Object.assign;
export const clone = <T>(v: T) => assign({}, v) as T;
/**toString, obs null and undefined return an ""(empty string) */
export const toStr = (v: unk) => v == null ? v + "" : "";
/**return def if value is undefined */
export const def = <T, D = T>(value: T, def: D): T | D => isU(value) ? def : value;
/**returns true if value is not false ie.(value===false) t stands for true*/
export const t = (value: unknown): bool => value !== false;
export const call = <T>(v: T, cb: (v: T) => any): T => (cb(v), v);
export const sub = <T, K extends keyof T>(arr: Array<T>, key: K): T[K][] => arr.map(v => v?.[key]);
export const distinct = <T>(arr: Array<T>) => arr.filter((f, i) => {
  return arr.indexOf(f, i + 1) == -1;
});
/**get last item of array */
export const z = <T>(a: ArrayLike<T>) => a[l(a) - 1];
export const filter: {
  <T>(arr: Array<T>, filter: (v: T, i: number) => boolean): T[];
  /**filter all truethfull values */
  <T>(arr: Array<T>): Exclude<T, falsy>[];
} = <T>(arr: Array<T>, filter?: (v: T, i: number) => boolean) =>
    arr.filter(filter || (v => v));

/**get length of array */
export const l = (a: ArrayLike<any>) => a.length;
export const arr = <T>(v: T | T[]): T[] => isA(v) ? v : v === undefined ? [] : [v];
export function iByKey<T, K extends keyof T>(arr: ArrayLike<T>, name: T[K], key: K = "key" as any, i = 0) {
  for (; i < arr.length; i++)
    if (name === arr[i][key])
      return i;
  return -1;
}
export function byKey<T, K extends keyof T>(arr: ArrayLike<T>, name: T[K], key: K = "key" as any, i = 0): T {
  for (; i < arr.length; i++)
    if (name === arr[i][key])
      return arr[i];
  return null;
}
export const create = <T extends Object, A extends any[] = any[]>(constructor: new (...a: A) => T, obj: Partial<T>, ...a: A): T => assign(new constructor(...a), obj);
export const json = JSON.stringify;
export function set<T, K extends keyof T>(o: T, key: K, val: T[K]) {
  o[key] = val;
  return o;
}
export const notImp = () => new Error("not implemented");
export const notF = (key: Key, itemTp?: str, src?: str, srcTp?: str) => new Error(`${itemTp || 'item'} '${key}' not found` + (src ? ` in '${src}' ${srcTp || ""}` : ''));
