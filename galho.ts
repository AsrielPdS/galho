import type { EventObject, Options, EventTargetCallback } from "./event.js";
import { emit, off, on } from "./event.js";
import type { Properties as _p } from "csstype";
import { Arr, Dic, str, falses, unk, bool, float, int, Key, is } from "./util.js";
import { isA, isN, isO, isF, def, isS, isU, l, } from "./util.js";

type _ = keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | Element | EventTarget | S | Render;
/**
* create new element set props and append child
* @param tagName tag name of element to create
* @param props if is string or string array will the class if not will be set as props of created element 
* @param childs elements, string, number or anything that can be append to an element
*/
export function g<K extends keyof HTMLElementTagNameMap>(tagName: K, props?: Partial<HTMLElementTagNameMap[K]> | Arr<str> | falses, childs?: any): S<HTMLElementTagNameMap[K]>;
export function g<T extends HSElement = HTMLElement>(element: Element | T | S<T> | Render<T>, props?: Partial<T> | Arr<str> | falses, childs?: any): S<T>;
export function g<T extends HSElement = HTMLElement>(tagName: EventTarget, props?: Partial<T> | Arr<str> | falses, childs?: any): S<T>;
export function g(e: _, arg0: any, arg1: any) {
  if (!e) return null;
  let r = isS(e) ?
    new S(document.createElement(e)) :
    'render' in e ?
      e.render() :
      is(e, S) ? e : new S(e);
  if (arg0)
    isS(arg0) ?
      isS(e) ?
        r.attr("class", arg0) :
        r.c(arg0) :
      isA(arg0) ?
        r.c(arg0) :
        r.p(arg0);

  arg1 != null && r.add(arg1);
  return r;
}
export default g;
export const m = <T extends HSElement = HSElement>(...elements: (S<T> | T)[]) =>
  new M(...elements);

// #region --------- interfices -----------------------
export type EventHandler<T, E> = (this: T, e: E) => any;
export type HSElement = HTMLElement | SVGElement;
export type ANYElement = HTMLElement | SVGElement;
export type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
export type One<T extends HSElement = HTMLElement> = S<T> | Render<T>;

export type Tr = S<HTMLTableRowElement>;
export type Input = S<HTMLInputElement>;

export type Lazy<T> = (() => T) | T;
export type Properties = _p & {
  /**electron drag-region */
  webkitAppRegion?: "drag" | "no-drag";
};
export interface Render<T extends HSElement = HSElement> {
  render(): S<T>;
}
export interface MRender<T = any> {
  render(): T;
}

export type EventMap<T> = HTMLEventMap<T> | SVGEventMap<T> | {
  [key: string]: (this: Element, e: Event) => any;
};
export type HTMLEventMap<T> = {
  [K in keyof HTMLElementEventMap]?: (this: T, e: HTMLElementEventMap[K]) => any;
};
export type SVGEventMap<T> = {
  [K in keyof SVGElementEventMap]?: (this: T, e: SVGElementEventMap[K]) => any;
};
/**pseudo css elements */
export interface Pseudo {
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
export type Style = Properties | Pseudo | Styles;
export type Styles = Dic<Style>;
// #endregion

// #region --------- utility -----------------------

let _id = 0;
export const id = () => 'i' + (_id++);
/** create div element
* @param props if is string or string array will the class if not will be set as props of created element 
* @param childs elements, string, number or anything that can be append to an element */
export function div(props?: falses | Arr<str> | Partial<HTMLDivElement>, childs?: any) {
  let r = new S(document.createElement("div"))
  if (props)
    isS(props) ?
      r.attr("class", props) :
      isA(props) ?
        r.c(props) :
        r.p(props);

  childs != null && r.add(childs);
  return r;
}
/**html empty char */
export const empty = '&#8203;';
/**get dom active element */
export const active = () => g(document.activeElement as HTMLElement);
export const isE = (v: any): v is S<any> => v.e && v.e?.nodeType === 1;
/** convert @type {S<any>} to dom element */
export const asE = <T extends HSElement>(v: T | S<T>) => (v as S).e ? (v as S).e : v as T;
/** check if dom element */
const isD = (v: any): v is HSElement => v.nodeType === 1;

/**create an html element */
export function html<T extends keyof HTMLElementTagNameMap>(tag: T, props?: string | Partial<HTMLElement>, child?: any) {
  return g(document.createElementNS('http://www.w3.org/1999/xhtml', tag), props, child);
}
/**create an svg element */
export function svg<T extends keyof SVGElementTagNameMap>(tag: T, attrs?: string | Dic<string | number> | 0 | string | string[], child?: any): S<SVGElementTagNameMap[T]> {
  var s = new S(document.createElementNS('http://www.w3.org/2000/svg', tag));
  if (attrs)
    if (isS(attrs) || isA(attrs))
      s.c(attrs);
    else
      s.attrs(attrs);
  if (child || child === 0)
    s.add(child);
  return s;
}
/**convert html string to svg element */
export function toSVG<T extends SVGElement = SVGElement>(text: string): S<T> {
  let parser = new DOMParser(), doc = parser.parseFromString(text, "image/svg+xml");
  return new S(doc.firstChild);
}

export function onfocusout(e: S, handler: (e: FocusEvent) => any) {
  handler && e.on('focusout', ev => e.contains(ev.relatedTarget as HTMLElement) || handler.call(e, ev));
  return e;
}
type Wrap0 = S<HSElement> | Element | boolean | number | string | any[];
type Wrap1 = MRender<Wrap0> | Wrap0;
type Wrap2 = (() => Wrap1) | Wrap1;
export function wrap<T extends HTMLElement = HTMLElement>(child: Wrap2, props?: string | 0 | string[] | Partial<T>, tag?: keyof HTMLElementTagNameMap): S<T> {
  if (isF(child)) child = child();
  if (isF((child as MRender<Wrap0>)?.render)) child = (child as MRender<Wrap0>).render();
  if (child instanceof Element) child = new S(child);
  else if (!(child instanceof S))
    child = g(tag || "div", 0, child);
  props && g(child as One, props);
  return child as any;
}
/** select first element that match query same as `document.querySelect` */
export function get<T extends HSElement = HTMLElement>(selectors: string, ctx?: S | HSElement) {
  let t = (ctx ? asE(ctx) : document).querySelector(selectors) as T;
  return t && g(t) as S<T>;
}
/** select all element that match query same as `document.querySelectAll` */
export function getAll<T extends HSElement = HTMLElement>(selectors?: string, context?: S | HSElement) {
  return new M(...Array.from((context ? asE(context) : document).querySelectorAll<T>(selectors)));
}
/**fire event after specified amount of time */
export function delay<T extends ANYElement, K extends keyof HTMLElementEventMap>(e: S<T>, action: K, delay: number, listener: (this: T, e: HTMLElementEventMap[K]) => any): S<T>;
export function delay<T extends ANYElement, K extends keyof SVGElementEventMap>(e: S<T>, action: K, delay: number, listener: (this: T, e: SVGElementEventMap[K]) => any): S<T>;
export function delay(e: S, event: string, time: number, handler: (e: Event) => any) {
  handler = handler.bind(e.e);
  return e.on(event, function (e) {
    var t = `_${event}_timer`;
    clearTimeout(this[t]);
    this[t] = setTimeout(handler, time, e);
  });
}
/** stopImmediatePropagation and preventDefault from Event */
export function clearEvent(e: Event) {
  e.stopImmediatePropagation();
  e.preventDefault();
}
const cssPropRgx = /[A-Z]/g;
export function css(props: Style, selector?: string): str;
export function css(props: Style, s?: string) {
  let
    subs = [">", " ", ":", "~", "+"],
    r = "", subSel = "", split: string[];
  function sub(parent: string[], child: string) {
    return child.split(',')
      .map(s => parent.map(p => {
        if (subs.indexOf(s[0]) != -1)
          return p + s;
        if (s.includes("&"))
          return s.replaceAll("&", p);
        return p + ">" + s;
      }).join(',')).join(',');
  }
  if (!s || s[0] == '@') {
    for (let k in props)
      r += css(props[k], k);
    return r ? s ? s + "{" + r + "}" : r : '';
  }
  for (let key in props) {
    let val = props[key];
    if (val || val === 0) {
      if (isO(val)) {
        subSel += css(val, sub(split || (split = s.split(',')), key));
      }
      else
        r += key.replace(cssPropRgx, m => "-" + m.toLowerCase()) + ":" + val + ";";
    }
  }
  return (r ? s + "{" + r + "}" : "") + subSel;
}
export const rgba = (r: float, g: float, b: float, a: float) => `rgba(${r},${g},${b},${a})`;
export const rgb = (r: float, g: float, b: float) => `rgb(${r},${g},${b})`;

// #endregion

// #region ----------main structures ----------------------
export class S<T extends HSElement = HTMLElement> {
  readonly e?: T;
  constructor();
  constructor(e: T);
  constructor(e: EventTarget);
  constructor(e?: T) { this.e = e; }
  static empty: S<any>;
  get active() {
    return this.e.ownerDocument.activeElement == this.e;
  }
  get parent() {
    let e = this.e.parentElement;
    return e && new S(e);
  }
  get prev() {
    let e = this.e.previousElementSibling;
    return e && new S(e);
  }
  get next() {
    let e = this.e.nextElementSibling;
    return e && new S(e);
  }
  /**first child */
  get first() {
    let e = this.e.firstElementChild as T;
    return e && new S(e);
  }
  /**last child */
  get last() {
    let e = this.e.lastElementChild as T;
    return e && new S(e);
  }
  /**get bounding client rect */
  get rect() { return this.e.getBoundingClientRect(); }
  toJSON() { }

  contains(child: S<any> | HSElement) {
    return child ? this.e.contains(asE(child)) : false;
  }
  /**get Input value */
  v(): str
  /**set Input value */
  v(value: Key): this;
  v(v?: Key) {
    let e = (this.e as InputElement);
    return isU(v) ? e.value : (e.value = v as str, this);
  }
  on(actions: HTMLEventMap<T>, options?: AddEventListenerOptions): this;
  on(actions: SVGEventMap<T>, options?: AddEventListenerOptions): this;
  on<K extends keyof HTMLElementEventMap>(action: K, listener: ((this: T, e: HTMLElementEventMap[K]) => any) | falses, options?: AddEventListenerOptions): this;
  on<K extends keyof SVGElementEventMap>(action: K, listener: ((this: T, e: SVGElementEventMap[K]) => any) | falses, options?: AddEventListenerOptions): this;
  on<TT extends Element = Element, E extends Event = Event>(action: string, fn: EventHandler<TT, E> | falses, options?: AddEventListenerOptions): this;
  on<K extends keyof HTMLElementEventMap>(action: K[], listener: (this: T, e: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions): this;
  on(e, l?, o?) {
    if (isS(e)) {
      if (l) this.e.addEventListener(e, l, o);
    } else if (isA(e)) {
      if (l) for (let _ of e)
        this.e.addEventListener(_, l, o);
    } else for (let _ in e) {
      let t = e[_];
      if (t) this.e.addEventListener(_, t, l);
    }
    return this;
  }
  one<K extends keyof HTMLElementEventMap>(event: K, listener: (this: HTMLElement, e: HTMLElementEventMap[K]) => any): this;
  one<K extends keyof SVGElementEventMap>(event: K, listener: (this: SVGElement, e: SVGElementEventMap[K]) => any): this;
  one(event: string, listener: (this: Element, e: Event) => any): this;
  one(event: string, listener: (this: Element, e: Event) => any) {
    return this.on(event, listener, { once: true });
  }
  emit(name: str, event?: EventInit): this;
  emit(event: Event): this;
  emit(event: Event | str, init?: EventInit) {
    this.e.dispatchEvent(isS(event) ? new Event(event, init) : event);
    return this;
  }
  off<K extends keyof HTMLElementEventMap>(event: K | K[], listener: EventListener) {
    for (let e of isS(event) ? [event] : event)
      this.e.removeEventListener(e, listener);
    return this;
  }
  put(position: InsertPosition, child: any) {
    switch (typeof child) {
      case 'object':
        if (!child) break;
        if (isE(child) ? child = child.e : isD(child))
          this.e.insertAdjacentElement(position, child);
        else if (isF(child.render))
          this.put(position, child.render());
        else if (isF(child.then))
          child.then(c => this.put(position, c));
        else if (position[0] == 'a')
          for (let i = child.length - 1; i >= 0; i--)
            this.put(position, child[i]);
        else
          for (let i = 0, l = child.length; i < l; i++)
            this.put(position, child[i]);
        break;
      case 'string':
      case 'number':
      case 'bigint':
        this.e.insertAdjacentText(position, child as string);
        break;
      case 'function':
        this.put(position, child());
        break;
    }
    return this;
  }
  /**insert adjacent after end */
  after(child: any) {
    return this.put('afterend', child);
  }
  /**@deprecated */
  putAfter(child: any) {
    return this.put('afterend', child);
  }
  /**insert adjacent before begin */
  before(child: any) {
    return this.put('beforebegin', child);
  }
  /**@deprecated */
  putBefore(child: any) {
    return this.put('beforebegin', child);
  }
  putText(pos: InsertPosition, text: string | number) {
    this.e.insertAdjacentText(pos, text as string);
    return this;
  }
  putHTML(pos: InsertPosition, html: string) {
    this.e.insertAdjacentHTML(pos, html);
    return this;
  }
  add(child: any) {
    switch (typeof child) {
      case 'object':
        if (!child) break;
        if (isE(child) ? child = child.e : isD(child))
          this.e.append(child);
        else if (isF(child.render))
          this.add(child.render());
        else if (isF(child.then))
          child.then(c => this.add(c));
        else
          for (let i = 0, l = child.length; i < l; i++)
            this.add(child[i]);
        break;
      case 'string':
      case 'number':
      case 'bigint':
        this.e.append(child as string);
        break;
      case 'function':
        this.add(child());
        break;
    }
    return this;
  }
  /**(begin add) add child at begin of element */
  badd(child: any) { return this.put('afterbegin', child); }
  /**@deprecated */
  prepend(child: any) { return this.badd(child); }
  place(index: int, child: any) {
    if (!index)
      return this.badd(child);
    var c = this.e.children, temp = c[index < 0 ? c.length + index : index - 1];
    if (!temp)
      throw "out of flow";
    new S(temp).put('afterend', child);
    return this;
  }
  unplace(index: int) {
    this.e.children[index].remove();
  }
  addHTML(html: string) {
    return this.putHTML("beforeend", html);
  }
  set(child?: any) {
    this.e.textContent = '';
    this.add(child);
    return this;
  }
  is(filter: string | HSElement | S) {
    return isS(filter) ? this.e.matches(filter) : this.e == asE(filter);
  }
  id(): string;
  id(value: string | number): this
  id(v?: string | number) {
    if (v)
      this.e.id = v as string;
    else
      return this.e.id;
    return this;
  }

  text(): string;
  text(text: number | string): this;
  text(v?) {
    if (isU(v))
      return this.e.textContent;
    this.e.textContent = v;
    return this;
  }

  addTo(parent: HSElement | S) {
    asE(parent).appendChild(this.e);
    return this;
  };

  html(): string;
  html(content: string): this;
  html(value?: string) {
    if (arguments.length) {
      this.e.innerHTML = value;
      return this;
    }
    return this.e.innerHTML;
  }

  replace(child: any) {
    this.put('beforebegin', child);
    this.remove();
    return this;
  }

  focus(options?: FocusOptions) {
    this.e.focus(options);
    return this;
  }

  blur() {
    this.e.blur();
    return this;
  }

  child<C extends HSElement = HSElement>(index: number): S<C>;
  child<K extends keyof HTMLElementTagNameMap>(filter: K): S<HTMLElementTagNameMap[K]>;
  child(filter: string): S;
  child(filter: string | number) {
    let childs = this.e.children, child: Element;
    if (isS(filter)) {
      for (let i = 0; i < childs.length; i++) {
        if ((child = childs[i]).matches(filter))
          return new S(child);
      }
      return null;
    }
    else if (isN(filter))
      return (child = childs[filter < 0 ? l(childs) + filter : filter]) ? new S(child) : null;

  }

  childs(): M;
  childs<T extends HSElement = HSElement>(from: number, to?: number): M<T>;
  childs<K extends keyof HTMLElementTagNameMap>(filter: K): M<HTMLElementTagNameMap[K]>;
  childs<T extends HSElement = HTMLElement>(filter: string): M<T>;
  childs<T extends HSElement = HTMLElement>(filter: (child: S) => boolean): M<T>;
  childs(filter?, to?) {
    let childs = Array.from(this.e.children);
    return new M(...(isS(filter) ? childs.filter(c => c.matches(filter)) :
      isN(filter) ? childs.slice(filter, to) :
        isF(filter) ? childs.filter(c => filter(new S(c))) :
          childs) as HTMLElement[]);
  }

  query<K extends keyof HTMLElementTagNameMap>(filter: K): S<HTMLElementTagNameMap[K]>;
  query<U extends HTMLElement | SVGElement = HTMLElement>(filter: string): S<U>;
  query(filter: string) {
    let e = this.e.querySelector(filter);
    return e && new S(e);
  }
  queryAll<K extends keyof HTMLElementTagNameMap>(filter: K): M<HTMLElementTagNameMap[K]>;
  queryAll<U extends HTMLElement | SVGElement = HTMLElement>(filter: string): M<U>;
  queryAll(filter: string) {
    return new M(...Array.from(this.e.querySelectorAll(filter)) as HTMLElement[]);
  }
  closest<K extends keyof HTMLElementTagNameMap>(filter: K): S<HTMLElementTagNameMap[K]>;
  closest(filter: string): S
  closest(filter: string) {
    return g(this.e.closest(filter));
  }
  parents(filter: string) {
    let l = new M(), p = this.e as HTMLElement;
    while (p = p.parentElement)
      if (!filter || p.matches(filter))
        l.push(p);
    return l;
  }

  clone(deep?: boolean) {
    return new S(this.e.cloneNode(deep));
  }
  /**get property */
  p<K extends keyof T>(key: K): T[K];
  /**set property */
  p<K extends keyof T>(key: K, value: T[K]): this;
  p(key: string, value: any): this;
  p(props: Partial<T>): this;
  p<T = any>(key: string): T;
  p(props: Dic): this;
  p(a0: str | Dic, a1?: unk) {
    if (isS(a0))
      if (isU(a1))
        return this.e[a0];
      else this.e[a0] = a1;
    else for (let key in a0) {
      let v = a0[key];
      isU(v) || (this.e[key] = v);
    }
    return this;
  }
  /**@deprecated */
  prop<K extends keyof T>(key: K): T[K];
  /**@deprecated */
  prop<T = any>(key: string): T;
  /**@deprecated */
  prop<K extends keyof T>(key: K, value: T[K]): this;
  /**@deprecated */
  prop(key: string, value: any): this;
  prop(props, value?) {
    if (arguments.length == 1) {
      return this.e[props];
    }
    else
      this.e[props] = value;
    return this;
  }
  /**@deprecated */
  props(props: Partial<T>): this;
  props(props: Dic): this;
  props(props: Dic) {
    for (let key in props) {
      let v = props[key];
      isU(v) || (this.e[key] = v);
    }
    return this;
  }
  call<K extends keyof T>(key: K, ...args: any[]) {
    (this.e[key] as any)(...args);
    return this;
  }

  css<T extends keyof Properties>(property: T, important?: bool): string;
  css<T extends keyof Properties>(property: T, value: Properties[T], important?: bool): this;
  css(styles: Properties): this;
  css(k, v?, i?: bool) {
    let s = this.e.style;
    if (isS(k))
      if (isU(v))
        return s[k];
      else
        s.setProperty(k.replace(cssPropRgx, m => "-" + m), v, i ? "important" : "");
    else
      for (let _ in k)
        s.setProperty(_.replace(cssPropRgx, m => "-" + m), k[_], i ? "important" : "");
    return this;
  }
  uncss(): this;
  uncss(properties: Array<keyof Properties>): this;
  uncss(properties?) {
    if (properties)
      for (let i = 0; i < properties.length; i++)
        this.e.style[properties[i]] = "";
    else
      this.e.removeAttribute('style');
    return this;
  }
  /**add classes */
  c(classes: Arr<str>): this;
  /**add or remove classes */
  c(classes: Arr<str>, set: bool): this;
  c(names: Arr<str>, set?: bool) {
    if (names)
      this.e.classList[set === false ? 'remove' : 'add'].apply(this.e.classList, (isS(names) ? names.trim().split(' ') : names).filter(n => n));
    return this;
  }
  /**@deprecated */
  cls(classes: Arr<str>): this;
  cls(names: Arr<str>, set: boolean): this;
  cls(names: Arr<str>, set?) {
    this.e.classList[set === false ? 'remove' : 'add'].apply(this.e.classList, (isS(names) ? names.trim().split(' ') : names).filter(n => n));
    return this;
  }
  /**toggle class */
  tcls(names: string) {
    for (let n of names.split(' '))
      if (n) this.e.classList.toggle(n);
    return this;
  }
  hasClass(name: string) {
    return this.e.classList.contains(name);
  }
  attr(attr: string, value: string | boolean | number): this;
  attr(attr: string): string;
  attr(attr, value?) {
    if (isU(value)) {
      return this.e.getAttribute(attr);
    }
    else if (value === false)
      this.e.removeAttribute(attr);
    else
      this.e.setAttribute(attr, value === true ? '' : value);
    return this;
  }
  attrs(attrs: Dic<string | boolean | number>) {
    for (let key in attrs) {
      let value = attrs[key];
      if (value === false)
        this.e.removeAttribute(key);
      else
        this.e.setAttribute(key, value === true ? '' : value as string);
    }
    return this;
  }
  d(data: any): this;
  d<T = unknown>(): T;
  d(data?: any) {
    let e = this.e as HTMLElement & { _d?};
    if (isU(data))
      return def(e._d, (e = e.parentElement) && new S(e).d());
    e._d = data;
    return this;
  }
  remove() {
    this.e.remove();
    return this;
  }
}
export class M<T extends HSElement = HSElement> extends Array<T>{
  constructor(...elements: (S<T> | T)[])
  constructor(lenght: int)
  constructor(...elements: (S<T> | T)[]) {
    if (isN(elements[0]))
      super(elements[0]);
    else super(...elements.map(i => "e" in i ? i.e : i as T));
  }
  e(i: number) { return new S(this[i]); }
  on<K extends keyof HTMLElementEventMap>(action: K, listener: (this: T, e: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions): M<T>;
  on<K extends keyof SVGElementEventMap>(action: K, listener: (this: T, e: SVGElementEventMap[K]) => any, options?: AddEventListenerOptions): M<T>
  on(event: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) {
    for (let i = 0; i < this.length; i++)
      this[i].addEventListener(event, listener, options);
    return this;
  }
  emit(event: Event) {
    for (let i = 0, l = this.length; i < l; i++)
      this[i].dispatchEvent(event);
    return this;
  }
  css(props: Properties, important?: bool) {
    for (let i = 0; i < this.length; i++) {
      let t = this[i].style;
      for (let css in props)
        t.setProperty(css, props[css], important ? "important" : "");
    }
    return this;
  }
  /**remove all inline css */
  uncss(): this;
  /**remove inline css */
  uncss(properties: Array<keyof Properties>): this;
  uncss(p?: str[]) {
    for (let i = 0; i < this.length; i++) {
      let t = this[i];
      if (p) for (let i = 0; i < p.length; i++)
        t.style.removeProperty(p[i]);
      else t.removeAttribute('style');
    }
    return this;
  }
  /**add classes */
  c(names: str[] | str): this;
  /**add or remove classes 
   * @param set if `false` remove classes otherwise add
  */
  c(names: str[] | str, set: boolean): this;
  c(names: str[] | str, set?: boolean) {
    isS(names) && (names = names.split(' ').filter(v => v));
    for (let i = 0; i < this.length; i++) {
      this[i].classList[set === false ? 'remove' : 'add'](...names);
    }
    return this;
  }
  p<K extends keyof T>(prop: K, value: T[K]): this
  p(prop: string, value: any): this
  p(prop: string, value: any) {
    for (let i = 0; i < this.length; i++)
      this[i][prop] = value;
    return this;
  }
  remove() {
    for (let e of this)
      e.remove();
    return this;
  }
  child(): M;
  child(filter: string): M;
  child(index: number): M;
  child(filter?: number | string) {
    let result = new M();
    for (let item of this)
      if (isS(filter))
        for (let i = 0; i < item.children.length; i++) {
          let child = item.children[i];
          if (child.matches(filter))
            result.push(child as HSElement);
        }
      else
        isN(filter) ?
          (filter in item.children) && result.push(item.children[filter] as HSElement) :
          result.push.apply(result, item.children);
    return result;
  }
  do(cb: (v: S<T>, index: number) => any) {
    for (let i = 0; i < this.length; i++)
      cb(new S(this[i]), i);
    return this;
  }
  eachS(callbackfn: (value: S<T>, index: number) => void) {
    this.forEach((value, index) => callbackfn(new S(value), index));
    return this;
  }
}
export interface M<T extends HSElement = HSElement> {
  slice: (start?: number, end?: number) => M<T>;
}

type EEv<Ev, I> = Ev & { set: Partial<I>; };
export type BindHandler<T, M, B> = (this: E<M>, s: B, model: M) => void;
export interface Bind<T, M, K extends keyof M> {
  e: S | Render;
  prop: K;
  handler: BindHandler<T, M, E<any> | S>;
}
export abstract class E<I = {}, Events extends Dic<any[]> = {}> implements Render, EventObject<Events & { set: [I] }> {
  /**interface */
  i: I;
  $: S;
  private bonds: { prop, handler: BindHandler<E, I, S | Render>, e: S | Render }[];
  validators: Dic<Array<(value: any, field: any) => boolean | void>>;
  constructor(i?: I) {
    this.bonds = [];
    this.eh = {};
    this.i = i || {} as I;
  }
  protected view?(): One<HSElement>;
  focus() {
    this.$.focus();
    return this;
  }
  render() {
    if (this.$ === void 0) {
      let view = this.view();
      this.$ = (view ?
        'render' in view ?
          view.render() : view :
        null) as S;
    }
    return this.$;
  }
  dispose() {
    if (this.$) {
      this.$.remove();
      delete this.$;
    }
    this.bonds.length = 0;
  }
  reRender() {
    this.dispose();
    return this.render();
  }
  removeKey(key: string | string[]) {
    if (isS(key))
      delete this.i[key];
    return this;
  }
  addValidators<K extends keyof I>(field: K, validator: (value: I[K], field: K) => boolean | void) {
    var _a, _b;
    ((_a = (this.validators || (this.validators = {})))[_b = field as any] || (_a[_b] = [])).push(validator);
    return this;
  }
  private _valid(key, value) {
    let temp = this.validators[key];
    if (temp)
      for (let i = 0; i < temp.length; i++)
        if (!temp[i](value, key))
          return false;
    return true;
  }
  set(): this;
  set<K extends keyof I>(key: K[]): this;
  set<K extends keyof I>(key: K, value: Pick<I, K>): this;
  set<K extends keyof I>(key: K, value: I[K]): this;
  set(values: Partial<I>): this;
  set(key?: Arr<str> | Dic, value?) {
    let dt = this.i;
    if (isO(key)) {
      if (isA(key)) {
        let t = {};
        for (let i = 0; i < key.length; i++) {
          let t2 = key[i];
          t[t2] = dt[t2];
        }
        key = t;
      } else {
        let t = {};
        for (let k in key) {
          let val = key[k];
          if (val !== dt[k] && (!this.validators || this._valid(k, val)))
            dt[k] = t[k] = val;
        }
        if (!Object.keys(key = t).length)
          return this;
      }
    } else if (!key) {
      key = dt;
    } else {
      if (dt[key] === value || (this.validators && !this._valid(key, value)))
        return this;
      dt[key] = value;
      key = { [key]: value };
    }
    for (let i = 0, b = this.bonds; i < b.length; i++) {
      let bond = b[i];
      if (!bond.prop || bond.prop in key)
        bond.handler.call(this, bond.e, key);
    }
    this.emit('set', key as I);
    return this;
  }
  toggle(key: keyof I) {
    return this.set(key, !this.i[key] as any);
  }
  clone(): this {
    return new (this.constructor as any)(this.i);
  }
  readonly eh: {
    [P in keyof Events]?: EventTargetCallback<this, Events[P]>[];
  };
  on<K extends keyof EEv<Events, I>>(event: K, callback: EventTargetCallback<this, Events[K]>, options?: Options): this;
  on(callback: EventTargetCallback<this, [Partial<I>]>, options?: Options): this;
  on(event, callback, options?) {
    if (isF(event)) {
      callback = event;
      event = "set";
    }
    return on(this, event, callback, options);
  }
  off<K extends keyof Events>(event: K, callback?: EventTargetCallback<this, Events[K]>) {
    return off(this, event as string, callback);
  }
  emit(event: "set", arg: I): this;
  emit<K extends keyof Events>(event: K, ...args: Events[K]): this;
  emit(event: str, ...args: any[]) {
    return emit(this, event as string, ...args);
  }
  onset<K extends keyof I>(props: K[] | K, callback: EventTargetCallback<this, [Partial<I>]>, options: Options = {}) {
    options.check = isS(props) ?
      e => props in e : e => (props as K[]).some(prop => prop in e);

    return on(this, "set", callback, options);
  }
  bind<K extends keyof I, R extends Render>(e: R, handler: BindHandler<this, I, R>, prop?: K, noInit?: boolean): S;
  bind<K extends keyof I, T extends HSElement>(s: S<T>, handler: BindHandler<this, I, S<T>>, prop?: K, noInit?: boolean): S<T>;
  bind(element, handler, prop, noInit) {
    if ('render' in element) {
      this.bonds.push({ e: element, handler: handler, prop: prop });
      if (!noInit)
        handler.call(this, element, this.i);
      return element.render();
    } else {
      this.bonds.push({ e: element, handler: handler, prop: prop });
      if (!noInit)
        handler.call(this, element, this.i);
      return element;
    }
  }
  unbind(s: One) {
    var i = this.bonds.findIndex(b => (b.e as S).e == (s as S).e || (s as Render) == b.e as Render);
    if (i != -1)
      this.bonds.splice(i, 1);
  }
  private toJSON() { }
}
// #endregion

/**@deprecated */
class CL extends Array<string> {
  push(...cls: Array<string | string[]>) {
    for (let t of cls) {
      if (t)
        for (let t2 of isS(t) ? t.split(' ') : t)
          if (t2)
            super.push(t2);
    }
    return this.length;
  }
}
/**@deprecated */
export function cl(...cls: Array<string | string[]>) {
  let c = new CL;
  if (cls.length)
    c.push(...cls);
  return c;
}