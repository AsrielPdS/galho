const { S } = require("./galho");
const { isS, put } = require("./s");

exports.query = (m, filter) => {
  for (let i = 0, l = m.length; i < l; i++) {
    let t = m[i];
    ;
    if (!t.matches(filter))
      t = t.querySelector(filter);
    if (t)
      return new S(t);
  }
  return S.empty;
}
exports.each = (m, callbackfn) => {
  m.forEach((value, index) => callbackfn(new S(value), index));
  return m;
}
exports.not = (m, filter) => {
  return m.filter((e) => !e.matches(filter));
}
exports.replace = (m, fn) => {
  for (let e of m) {
    put(e, 'beforebegin', fn(e));
    e.remove();
  }
  return m;
}
exports.push = (m, ...items) => {
  for (let i = 0; i < items.length; i++) {
    let t = items[i];
    if (t instanceof S)
      items[i] = t.e;
  }
  return m.push(...items);
}
exports.toArray = (m) => {
  return m.map(t => new S(t));
}
exports.find = (m, filter, thisArgs) => {
  if (isS(filter)) {
    for (var i = 0, e = m[0]; i < m.length; e = m[++i])
      if (e.matches(filter))
        return e;
  }
  else
    return m.find(filter, thisArgs);
}
exports.fromS = (s) => {
  return s.filter(s => s).map(s => s.e);
}
exports.empty = (length = 0) => {
  return new Array(length);
}