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
export function iByKey(arr, name, key, i = 0) {
    for (; i < arr.length; i++)
        if (name === arr[i][key])
            return i;
    return -1;
}
export function byKey(arr, name, key, i = 0) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBdUJBLHdDQUF3QztBQUN4QyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBbUIsS0FBVSxFQUFFLElBQXNDLEVBQWMsRUFBRSxDQUFDLEtBQUssWUFBWSxJQUFJLENBQUM7QUFDOUgsZUFBZTtBQUNmLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQVUsRUFBZ0IsRUFBRSxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQztBQUMzRSxpQkFBaUI7QUFDakIsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBVSxFQUFxQixFQUFFLENBQUMsT0FBTyxLQUFLLEtBQUssVUFBVSxDQUFDO0FBRWxGLGdCQUFnQjtBQUNoQixNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFVLEVBQWdCLEVBQUUsQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUM7QUFDM0UsZUFBZTtBQUNmLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQVUsRUFBbUIsRUFBRSxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQztBQUM5RSxpQkFBaUI7QUFDakIsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBVSxFQUFvQixFQUFFLENBQUMsT0FBTyxLQUFLLEtBQUssU0FBUyxDQUFDO0FBQ2hGLG1CQUFtQjtBQUNuQixNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFVLEVBQXNCLEVBQUUsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDO0FBQzNFLHNCQUFzQjtBQUN0QixNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFVLEVBQTZCLEVBQUUsQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RixlQUFlO0FBQ2YsTUFBTSxDQUFDLE1BQU0sR0FB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