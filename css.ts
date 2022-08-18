import { Properties as _p } from "csstype";
import { S, g } from "./galho.js";
interface Dic<T = any> {
  [key: string]: T;
}
export function css(selector: Dic<Style>, tag?: S) {
  let r = "";
  for (let k in selector)
    r += parse(k, selector[k]);
  return tag ? tag.add(r) : g("style").text(r).addTo(document.head) as S<HTMLStyleElement>;
}
export type Properties = _p & {
  webkitAppRegion?: "drag" | "no-drag";
};
interface Pseudo {
  ":hover": Style;
  ":active": Style;
  ":focus": Style;
  ":focus-within": Style;
  ":autofill": Style;
  ":checked": Style;
  ":invalid": Style;
  ":empty": Style;
  ":root": Style;
  ":enabled": Style;
  ":disabled": Style;
  ":link": Style;
  ":visited": Style;
  ":lang": Style;
  ":first-child": Style;
  ":last-child": Style;
  ":only-child": Style;
}
export type Style = _p | Pseudo | Dic<Style>;
export type Styles = Dic<Style>;
const
  subs = [">", " ", ":", "~", "+"],
  defSub = ">",
  regex = /[A-Z]/g;
export function sub(parent: string[], child: string){
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
}
export function parse(selector: string, props: Style){
  let r = "", subSel = "", split:string[];
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
}