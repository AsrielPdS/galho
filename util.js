/**check if value is instance of type */
export const is = (value, type) => value instanceof type;
/**is string */
export const isS = (value) => typeof value === "string";
/**is function */
export const isF = (value) => typeof value === "function";
/** is object */
export const isO = (value) => typeof value === "object";
/**is number */
export const isN = (value) => typeof value === "number";
/** is boolean */
export const isB = (value) => typeof value === "boolean";
/** is undefined */
export const isU = (value) => value === undefined;
/** is promise like */
export const isP = (value) => value && isF(value.then);
/** is array */
export const isA = (value) => Array.isArray(value);
export const wait = (ms) => new Promise(r => setTimeout(r, ms));
export const assign = Object.assign;
export const clone = (v) => assign({}, v);
/**toString, obs null and undefined return an ""(empty string) */
export const toStr = (v) => v == null ? v + "" : "";
/**return def if value is undefined */
export const def = (value, def) => isU(value) ? def : value;
/**returns true if value is not false ie.(value===false) t stands for true*/
export const t = (value) => value !== false;
export const call = (v, cb) => (cb(v), v);
export const sub = (arr, key) => arr.map(v => v?.[key]);
export const distinct = (arr) => arr.filter((f, i) => {
    return arr.indexOf(f, i + 1) == -1;
});
/**get last item of array */
export const z = (a) => a[l(a) - 1];
export const filter = (arr, filter) => arr.filter(filter || (v => v));
/**get length of array */
export const l = (a) => a.length;
export const arr = (v) => isA(v) ? v : v === undefined ? [] : [v];
export function iByKey(arr, name, key = "key", i = 0) {
    for (; i < arr.length; i++)
        if (name === arr[i][key])
            return i;
    return -1;
}
export function byKey(arr, name, key = "key", i = 0) {
    for (; i < arr.length; i++)
        if (name === arr[i][key])
            return arr[i];
    return null;
}
export const create = (constructor, obj, ...a) => assign(new constructor(...a), obj);
export const json = JSON.stringify;
export function set(o, key, val) {
    o[key] = val;
    return o;
}
export const notImp = () => new Error("not implemented");
export const notF = (key, itemTp, src, srcTp) => new Error(`${itemTp || 'item'} '${key}' not found` + (src ? ` in '${src}' ${srcTp || ""}` : ''));
