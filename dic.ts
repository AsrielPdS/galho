import type { Dic } from "./util.js";

export function any<T = any>(dic: Dic<T>, fn?: (value: T, key: string) => unknown) {
  for (let key in dic)
    if (fn(dic[key], key))
      return true;
  return false;
}
export function first<T = any>(dic: Dic<T>, fn?: (value: T, key: string) => unknown) {
  for (let key in dic)
    if (!fn || fn(dic[key], key))
      return dic[key];
  return void 0;
}
export function last<T = any>(dic: Dic<T>, fn?: (value: T, key: string) => unknown) {
  let v: T;
  for (let key in dic)
    if (!fn || fn(dic[key], key))
      v = dic[key];
  return v;
}
export function firstKey<T = any>(dic: Dic<T>, fn?: (value: T, key: string) => unknown) {
  for (let key in dic)
    if (!fn || fn(dic[key], key))
      return key;
  return void 0;
}
export function each<T = any>(dic: Dic<T>, forEach: (value: T, key: string) => any | false) {
  for (let key in dic) {
    let t = forEach(dic[key], key);
    if (t === false)
      return;
  }
  return dic;
}
export function isEmpty(obj: Dic) {
  for (let _k in obj)
    return false;
  return true;
}
/**
 * dictionary to Array
 * @param dic
 * @param fn
 */
export function toArray<T, U>(dic: Dic<T>, fn: (value: T, key: string) => U): U[] {
  var result = [];
  for (var key in dic)
    result.push(fn(dic[key], key));
  return result;
}
/**
 * map dictionary
 * @param dic
 * @param fn
 */
export function filter<T>(dic: Dic<T>, fn: (value: T, key: string) => any = v => v): Dic<T> {
  let result = {};
  for (let key in dic)
    if (fn(dic[key], key))
      result[key] = dic[key];
  return result;
}
export function fromArray<T, U>(arr: Array<T>, callback: (value: T, index: number) => [string, U]): Dic<U> {
  let result = {};
  for (let i = 0; i < arr.length; i++) {
    let value = arr[i];
    let temp = callback(value, i);
    result[temp[0]] = temp[1];
  }
  return result;
}
