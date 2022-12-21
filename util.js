export const isS = (value) => typeof value === 'string';
export const isF = (value) => typeof value === 'function';
export const isO = (value) => typeof value === "object";
export const isN = (value) => typeof value === "number";
export const isB = (value) => typeof value === "boolean";
export const isU = (value) => value === undefined;
export const isP = (value) => value && isF(value.then);
export const isA = (value) => Array.isArray(value);
export const wait = (ms) => new Promise(r => setTimeout(r, ms));
export const assign = Object.assign;
export function extend(obj, extension, override = true) {
    for (let key in extension) {
        let e = extension[key];
        isU(e) || ((override || isU(obj[key])) && (obj[key] = e));
    }
    return obj;
}
export function delay(index, cb, time) {
    clearTimeout(index);
    return setTimeout(cb, time);
}
export const toStr = (v) => v == null ? v + "" : "";
export const def = (value, def) => isU(value) ? def : value;
export const t = (value) => value !== false;
export function call(v, cb) {
    cb(v);
    return v;
}
export const sub = (arr, key) => arr.map(v => v?.[key]);
export const distinct = (arr) => arr.filter((f, i) => {
    return arr.indexOf(f, i + 1) == -1;
});
export const z = (a) => a[l(a) - 1];
export const filter = (arr, filter) => arr.filter(filter || (v => v));
export const l = (a) => a.length;
export const arr = (v) => isA(v) ? v : v === undefined ? [] : [v];
export const lazy = (value) => isF(value) ? value() : value;
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
export const create = (constructor, obj) => assign(new constructor(), obj), json = JSON.stringify, date = (d) => [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
const _fmtc = new Intl.NumberFormat(void 0, { style: "currency", currency: "AOA" }), _fmtp = new Intl.NumberFormat(void 0, { style: "percent" }), _fmtd = new Intl.DateTimeFormat(void 0, { dateStyle: "short" }), _fmtt = new Intl.DateTimeFormat(void 0, { timeStyle: "short" }), _fmtm = new Intl.DateTimeFormat(void 0, { year: "numeric", month: "long" }), _fmtn = new Intl.NumberFormat(), _fmtDT = new Intl.DateTimeFormat(void 0, { dateStyle: "short", timeStyle: "short" });
export const fmtd = (v) => _fmtd.format(v), fmtt = (v) => _fmtt.format(v), fmtm = (v) => _fmtm.format(v), fmtDT = (v) => _fmtDT.format(v), fmtc = (v) => _fmtc.format(v), fmtp = (v) => _fmtp.format(v), fmtn = (v) => _fmtn.format(v), fmts = {
    d: fmtd, t: fmtt, D: fmtDT,
    c: fmtc, f: fmtn, p: fmtp,
    n: fmtn,
};
export function fmt(v, pattern) {
    isS(v) && (v = new Date());
    return fmts[pattern ||= isN(v) ? "n" : v.getHours() || v.getMinutes() ? "D" : "d"](v);
}
export const concat = (separator, ...parts) => parts.filter(p => p != null).join(separator);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBdUJBLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQVUsRUFBZ0IsRUFBRSxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQztBQUUzRSxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFVLEVBQXFCLEVBQUUsQ0FBQyxPQUFPLEtBQUssS0FBSyxVQUFVLENBQUM7QUFHbEYsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBVSxFQUFnQixFQUFFLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDO0FBRTNFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQVUsRUFBbUIsRUFBRSxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQztBQUU5RSxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFVLEVBQW9CLEVBQUUsQ0FBQyxPQUFPLEtBQUssS0FBSyxTQUFTLENBQUM7QUFFaEYsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBVSxFQUFzQixFQUFFLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQztBQUUzRSxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFVLEVBQTZCLEVBQUUsQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUV2RixNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBVSxLQUFVLEVBQWdCLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9FLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLEVBQVEsRUFBRSxFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEUsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFnRSxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2pHLE1BQU0sVUFBVSxNQUFNLENBQW1DLEdBQU0sRUFBRSxTQUFZLEVBQUUsUUFBUSxHQUFHLElBQUk7SUFDNUYsS0FBSyxJQUFJLEdBQUcsSUFBSSxTQUFTLEVBQUU7UUFDekIsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDekU7SUFDRCxPQUFPLEdBQVksQ0FBQztBQUN0QixDQUFDO0FBQ0QsTUFBTSxVQUFVLEtBQUssQ0FBQyxLQUFhLEVBQUUsRUFBWSxFQUFFLElBQVk7SUFDN0QsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BCLE9BQU8sVUFBVSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM5QixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFekQsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQVcsS0FBUSxFQUFFLEdBQU0sRUFBUyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUVuRixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFjLEVBQVEsRUFBRSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUM7QUFDM0QsTUFBTSxVQUFVLElBQUksQ0FBSSxDQUFJLEVBQUUsRUFBaUI7SUFDN0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ04sT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBQ0QsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQXVCLEdBQWEsRUFBRSxHQUFNLEVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ25HLE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxDQUFJLEdBQWEsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNoRSxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNyQyxDQUFDLENBQUMsQ0FBQztBQUVILE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFJLENBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNyRCxNQUFNLENBQUMsTUFBTSxNQUFNLEdBSWYsQ0FBSSxHQUFhLEVBQUUsTUFBcUMsRUFBRSxFQUFFLENBQzVELEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBR25DLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDakQsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUksQ0FBVSxFQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25GLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFJLEtBQW9CLEVBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUNqRixNQUFNLFVBQVUsTUFBTSxDQUF1QixHQUFpQixFQUFFLElBQVUsRUFBRSxNQUFTLEtBQVksRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUN0RyxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtRQUN4QixJQUFJLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQ3RCLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNaLENBQUM7QUFDRCxNQUFNLFVBQVUsS0FBSyxDQUF1QixHQUFpQixFQUFFLElBQVUsRUFBRSxNQUFTLEtBQVksRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUNyRyxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtRQUN4QixJQUFJLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQ3RCLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUNELE1BQU0sQ0FBQyxNQUNMLE1BQU0sR0FBRyxDQUFtQixXQUF3QixFQUFFLEdBQWUsRUFBSyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksV0FBVyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQzNHLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxFQUNyQixJQUFJLEdBQUcsQ0FBQyxDQUFPLEVBQW9ELEVBQUUsQ0FDbkUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztBQUVuRyxNQUNFLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUM3RSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQzNELEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFDL0QsS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUMvRCxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFDM0UsS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxFQUMvQixNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUN2RixNQUFNLENBQUMsTUFFTCxJQUFJLEdBQUcsQ0FBQyxDQUFnQixFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUU1QyxJQUFJLEdBQUcsQ0FBQyxDQUFnQixFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUU1QyxJQUFJLEdBQUcsQ0FBQyxDQUFnQixFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUU1QyxLQUFLLEdBQUcsQ0FBQyxDQUFnQixFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUU5QyxJQUFJLEdBQUcsQ0FBQyxDQUF3QixFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFTLENBQUMsQ0FBQyxFQUU1RCxJQUFJLEdBQUcsQ0FBQyxDQUF3QixFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFTLENBQUMsQ0FBQyxFQUU1RCxJQUFJLEdBQUcsQ0FBQyxDQUF3QixFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFTLENBQUMsQ0FBQyxFQUM1RCxJQUFJLEdBQXVDO0lBQ3pDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSztJQUMxQixDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUk7SUFDekIsQ0FBQyxFQUFFLElBQUk7Q0FDUixDQUFDO0FBV0osTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUF5QixFQUFFLE9BQWM7SUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQztJQUMzQixPQUFPLElBQUksQ0FBQyxPQUFPLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEYsQ0FBQztBQUNELE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRyxDQUFDLFNBQWEsRUFBQyxHQUFHLEtBQVksRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMifQ==