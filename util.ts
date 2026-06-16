/** Integer number representation */
export type int = number;
/** Floating point number representation */
export type float = number;
/** String representation */
export type str = string;
/** Boolean representation */
export type bool = boolean;
/** Unknown type representation */
export type unk = unknown;
/** Object constructor interface alias */
export type Obj = Object;
/** Primitive JS types */
export type Primitive = str | number | bool;
/** Key type representation */
export type Key = string | number;
/** Dictionary type mapping string keys to values */
export interface Dic<T = any> {
  [key: string]: T;
}
/** Dictionary type mapping property keys to values */
export interface AnyDic<T = any> {
  [key: PropertyKey]: T;
}
/**json array */
export type JsonA = JsonR[];
/**json object */
export type JsonO = { [key: string]: JsonR }
/**json result */
export type JsonR = str | float | bool | null | JsonA | JsonO;

/** Represent JS falsy values */
export type falsy = false | 0 | 0n | -0 | "" | undefined | null;
/** Pair of key and value */
export type Pair<V = any, K = str> = [key: K, val: V];
/** Type representing an array or a single value */
export type Arr<T> = T[] | T;
/** Type representing a value or a promise of that value */
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
/**
 * Delay execution for a number of milliseconds
 * @param ms Milliseconds to wait
 */
export const wait = (ms?: int) => new Promise(r => setTimeout(r, ms));
/** Object.assign alias with strict typing */
export const assign: { <T>(t: T, ...s: Partial<T>[]): T } & typeof Object.assign = Object.assign;
/**
 * Shallow clone an object
 * @param v Object to clone
 */
export const clone = <T>(v: T) => assign({}, v) as T;
/**toString, obs null and undefined return an ""(empty string) */
export const toStr = (v: unk) => v == null ? "" : v + "";
/**return def if value is undefined */
export const def = <T, D = T>(value: T, def: D): T | D => isU(value) ? def : value;
/**returns true if value is not false ie.(value===false) t stands for true*/
export const t = (value: unknown): bool => value !== false;
/**
 * Invoke a callback function with the provided value and return the value
 * @param v Value to pass
 * @param cb Callback function
 */
export const call = <T>(v: T, cb: (v: T) => any): T => (cb(v), v);
/**
 * Extract a property array from an object array
 * @param arr Array of objects
 * @param key Property key to extract
 */
export const sub = <T, K extends keyof T>(arr: Array<T>, key: K): (T[K] | null)[] => arr.map(v => v ? v[key] : null);
/**
 * Get distinct elements of an array
 * @param arr Input array
 */
export const distinct = <T>(arr: Array<T>) => arr.filter((f, i) => {
  return arr.indexOf(f, i + 1) == -1;
});
/**get last item of array */
export const z = <T>(a: ArrayLike<T>) => a[l(a) - 1];
/**
 * Filter elements of an array
 * @param arr Input array
 * @param filter Optional filter function
 */
export const filter: {
  <T>(arr: Array<T>, filter: (v: T, i: number) => boolean): T[];
  /**filter all truethfull values */
  <T>(arr: Array<T>): Exclude<T, falsy>[];
} = <T>(arr: Array<T>, filter?: (v: T, i: number) => boolean) =>
    arr.filter(filter || (v => v));

/**get length of array */
export const l = (a: ArrayLike<any>) => a.length;
/**
 * Force a value or array to be an array
 * @param v Value or array
 */
export const arr = <T>(v: T | T[]): T[] => isA(v) ? v : v === undefined ? [] : [v];
/**
 * Find index of an object in array-like structures matching a key value
 * @param arr Array-like structure
 * @param name Value of the key to match
 * @param key Key of the object
 * @param i Start index
 */
export function iByKey<T, K extends keyof T>(arr: ArrayLike<T>, name: T[K], key: K, i = 0) {
  for (; i < arr.length; i++)
    if (name === arr[i][key])
      return i;
  return -1;
}
/**
 * Find an object in array-like structures matching a key value
 * @param arr Array-like structure
 * @param name Value of the key to match
 * @param key Key of the object
 * @param i Start index
 */
export function byKey<T, K extends keyof T>(arr: ArrayLike<T>, name: T[K], key: K, i = 0): T | null {
  for (; i < arr.length; i++)
    if (name === arr[i][key])
      return arr[i];
  return null;
}
/** Constructor type representing newable class */
export type Constructor<T extends Object, A extends any[] = any[]> = new (...a: A) => T
/**
 * Create an instance of a constructor and assign properties to it
 * @param constructor Class constructor
 * @param obj Properties to assign
 * @param a Constructor arguments
 */
export const create = <T extends Object, A extends any[] = any[]>(constructor: Constructor<T, A>, obj: Partial<T>, ...a: A): T => assign(new constructor(...a), obj);
/** JSON stringify alias */
export const json = JSON.stringify;
/**
 * Set a key on an object and return the object
 * @param o Object
 * @param key Key to set
 * @param val Value to set
 */
export function set<T, K extends keyof T>(o: T, key: K, val: T[K]) {
  o[key] = val;
  return o;
}
/** Error indicating not implemented */
export const notImp = () => new Error("not implemented");
/**
 * Error message helper for not found items
 * @param key Key not found
 * @param itemTp Optional item type name
 * @param src Optional source object
 * @param srcTp Optional source type name
 */
export const notF = (key: Key, itemTp?: str, src?: any, srcTp?: str) => `${itemTp || 'item'} '${key}' not found` + (src ? ` in '${src}' ${srcTp || ""}` : '');
