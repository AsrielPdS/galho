const { g } = require("./galho");

exports.css = (selector, tag) => {
  let r = "";
  for (let k in selector)
    r += parse(k, selector[k]);
  return tag ? tag.add(r) : g("style").text(r).addTo(document.head);
}
const
  subs = [">", " ", ":", "~", "+"],
  defSub = ">",
  regex = /[A-Z]/g,
  sub = (parent, child) => {
    return child.split(',').map(s => {
      let t = s[0];
      return parent.map(p => {
        if (t == "&")
          return p + s.slice(1);
        else if (subs.indexOf(t) == -1)
          return p + defSub + s;
        else
          return p + s;
      }).join(',');
    }).join(',');
  },
  parse = (selector, props) => {
    let r = "", subSel = "", split;
    if (selector[0] == '@') {
      for (let k in props)
        r += parse(k, props[k]);
      return r ? selector + "{" + r + "}" : '';
    }
    for (let key in props) {
      let val = props[key];
      if (val || val === 0) {
        if (typeof val === "object") {
          subSel += parse(sub(split || (split = selector.split(',')), key), val);
        }
        else
          r += key.replace(regex, m => "-" + m) + ":" + val + ";";
      }
    }
    return (r ? selector + "{" + r + "}" : "") + subSel;
  };