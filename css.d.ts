import { Properties as _p } from "csstype";
import { S } from "./galho";
interface Dic<T = any> {
  [key: string]: T;
}
export function css(selector: Dic<Style>, tag?: S): S<HTMLStyleElement>;
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
export var defSub: string;
export function sub(parent: string[], child: string): string;
export function parse(selector: string, props: Style): string;