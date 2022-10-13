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

export type falses = false | 0 | "" | undefined | null;
export type Pair<V = any, K = str> = [key: K, val: V];
export type Arr<T> = T[] | T;
export type Task<T> = T | Promise<T>;
/**is string */
export const isS = (value: unk): value is str => typeof value === 'string';
/**is function */
export const isF = (value: unk): value is Function => typeof value === 'function';

/** is object */
export const isO = (value: unk): value is Dic => typeof value === "object";
/**is number */
export const isN = (value: unk): value is number => typeof value === "number";
/** is boolean */
export const isB = (value: unk): value is boolean => typeof value === "boolean";
/** is undefined */
export const isU = (value: unk): value is undefined => typeof value === "undefined";
/** is promise like */
export const isP = (value: any): value is PromiseLike<any> => value && isF(value.then);
/** is array */
export const isA = <T = any>(value: any): value is T[] => Array.isArray(value);

export const assign: { <T>(t: T, ...s: Partial<T>[]): T } & typeof Object.assign = Object.assign;
export function extend<T extends object, U = Partial<T>>(obj: T, extension: U, override = true) {
  for (let key in extension) {
    let e = extension[key];
    isU(e) || ((override || isU(obj[key as any])) && (obj[key as any] = e));
  }
  return obj as T & U;
}
export function delay(index: number, cb: Function, time?: float): number {
  clearTimeout(index);
  return setTimeout(cb, time);
}
/**toString, obs null and undefined return an ""(empty string) */
export const toStr = (v: unk) => v == null ? v + "" : "";
/**return def if value is undefined */
export const def = <T, D = T>(value: T, def: D): T | D => isU(value) ? def : value;
/**returns true if value is not false ie.(value===false) t stands for true*/
export const t = (value: unknown): bool => value !== false;
export function call<T>(v: T, cb: (v: T) => any): T {
  cb(v);
  return v;
}
export const sub = <T, K extends keyof T>(arr: Array<T>, key: K): T[K][] => arr.map(v => v?.[key]);
export const distinct = <T>(arr: Array<T>) => arr.filter((f, i) => {
  return arr.indexOf(f, i + 1) == -1;
});
/**get last item of array */
export const z = <T>(a: ArrayLike<T>) => a[l(a) - 1];
export const filter: {
  <T>(arr: Array<T>, filter: (v: T, i: number) => boolean): T[];
  /**filter all true values */
  <T>(arr: Array<T>): T[];
} = <T>(arr: Array<T>, filter?: (v: T, i: number) => boolean) =>
    arr.filter(filter || (v => v));

/**get length of array */
export const l = (a: ArrayLike<any>) => a.length;
export const arr = <T>(v: T | T[]): T[] => isA(v) ? v : v === undefined ? [] : [v];
export const lazy = <T>(value: T | (() => T)): T => isF(value) ? value() : value;
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
export const create = <T extends Object>(constructor: new () => T, obj: Partial<T>): T => assign(new constructor(), obj);
export const json = JSON.stringify;