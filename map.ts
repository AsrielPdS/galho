export function first<K, V>(map: Map<K, V>, fn?: (value: V, key: K) => unknown) {
  for (let [key, val] of map)
    if (!fn || fn(val, key))
      return val;
  return void 0;
}
export function firstKey<K, V>(map: Map<K, V>, fn?: (value: V, key: K) => unknown) {
  for (let [key, val] of map)
    if (!fn || fn(val, key))
      return key;
  return void 0;
}
export function map<K, V, T>(map: Map<K, V>, fn?: (value: V, key: K) => T) {
  let r: T[] = [];
  for (let [key, val] of map)
    r.push(fn(val, key));
  return r;
}
export function filter<K, V, T extends V = V>(map: Map<K, V>, fn?: (value: V, key: K) => boolean): T[] {
  let r: T[] = [];
  for (let [key, val] of map)
    fn(val, key) && r.push(val as T);

  return r;
}
export function sort<K, V>(map: Map<K, V>, fn?: (a: [K, V], b: [K, V]) => number) {
  return new Map([...map].sort(fn));
}
