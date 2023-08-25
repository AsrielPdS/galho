import type { Properties } from "csstype";
import { EventObject, EventTargetCallback, Options, emit, off, on } from "./event.js";
import { Arr, Dic, Key, bool, def, falsy, int, is, isA, isF, isN, isO, isS, isU, l, str, unk } from "./util.js";

export { Properties } from "csstype";

// #region --------- interfices -----------------------
export type HTMLTag = keyof HTMLElementTagNameMap;
export type SVGTag = keyof SVGElementTagNameMap;
export type HSElement = HTMLElement | SVGElement;
export type One<T extends HSElement = HTMLElement> = G<T> | Render<G<T>>;

export interface Render<T = any> {
  render(): T;
}
export type HTMLEventMap<T> = {
  [K in keyof HTMLElementEventMap]?: (this: T, e: HTMLElementEventMap[K]) => any;
};
export type SVGEventMap<T> = {
  [K in keyof SVGElementEventMap]?: (this: T, e: SVGElementEventMap[K]) => any;
};

export type Styles = Dic<Style>;
export type Style = Properties | Styles | {
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
};
// #endregion

// #region --------- utility -----------------------

/**
* create new element and append content to it
* @param tagName tag name of element to create
* @param content elements, string, number, function, PromiseLike or anything that can be append to an element. true, false, null and undefined will be ignored
*/
export function g<K extends HTMLTag>(tagName: K, content: any[] | (() => any)): G<HTMLElementTagNameMap[K]>;

/**
* create new element define a class attribute and append content to it
* @param tagName tag name of element to create
* @param className a class or a space separted list of classes, {@link falsy} values will be ignored
* @param content elements, string, number, function, PromiseLike or anything that can be append to an element. true, false, null and undefined will be ignored
*/
export function g<K extends HTMLTag>(tagName: K, className?: str | falsy, content?: any): G<HTMLElementTagNameMap[K]>;
/**
* create new element define a class attribute and append content to it
* @param tagName tag name of element to create
* @param properties an object contain properties (not attributes) to assigned to it.
* @param content elements, string, number, function, PromiseLike or anything that can be append to an element. true, false, null and undefined will be ignored
*/
export function g<K extends HTMLTag>(tagName: K, properties: Partial<HTMLElementTagNameMap[K]>, content?: any): G<HTMLElementTagNameMap[K]>;
/**
* create a wrapper around an element, set properties to it and append content
* @param element element to wrap
* @param properties an object contain properties (not attributes) to assigned to it.
* @param content elements, string, number, function, PromiseLike or anything that can be append to an element. true, false, null and undefined will be ignored
*/
export function g<T extends HTMLElement = HTMLElement>(element: Element | T | One<T>, properties: Partial<T>, content?: any): G<T>;
/**
 * 
 * @param element 
 * @param className 
 * @param content 
 */
export function g<T extends HTMLElement = HTMLElement>(element: Element | T | One<T>, className?: str | falsy, content?: any): G<T>;

export function g<T extends HTMLElement = HTMLElement>(element: Element | T | One<T>, content: any[] | (() => any)): G<T>;

export function g(e: HTMLTag | Element | One, arg0?: any[] | (() => any) | str | falsy | Partial<HTMLElement>, arg1?: any) {
  if (!e) return null;
  let r = isS(e) ?
    new G(document.createElement(e)) :
    'render' in e ?
      e.render() :
      is(e, G) ? e : new G(e);
  if (arg0)
    isS(arg0) ?
      isS(e) ?
        r.attr("class", arg0) :
        r.c(arg0) :
      isA(arg0) || isF(arg0) ?
        r.add(arg0) :
        r.p(arg0);

  arg1 != null && r.add(arg1);
  return r;
}
export default g;
export const m = <T extends HSElement = HSElement>(...elements: (G<T> | T)[]) =>
  new M(...elements);


/** create div element
* @param properties if is string or string array will the class if not will be set as props of created element 
* @param content elements, string, number or anything that can be append to an element */
export function div(properties?: Partial<HTMLDivElement>, content?: any): G<HTMLDivElement>
export function div(className?: str | falsy, content?: any): G<HTMLDivElement>
export function div(content: any[] | (() => any)): G<HTMLDivElement>
export function div(arg0?: any[] | (() => any) | falsy | Arr<str> | Partial<HTMLDivElement>, arg1?: any) {
  let r = new G(document.createElement("div"))
  if (arg0)
    isS(arg0) ?
      r.attr("class", arg0) :
      isA(arg0) || isF(arg0) ?
        r.add(arg0) :
        r.p(arg0);

  arg1 != null && r.add(arg1);
  return r;
}
const cssPropRgx = /[A-Z]/g;
/**html empty char */
export const empty = '&#8203;';
/**get `document.activeElement` */
export const active = () => g(document.activeElement as HTMLElement);
/** @ignore */
export const isE = (v: any): v is G<any> => v.e && v.e?.nodeType === 1;
/** convert to DOM Element @ignore */
export const asE = <T extends HSElement>(v: T | G<T>) => (v as G).e ? (v as G).e : v as T;
/** check if dom element */
const isD = (v: any): v is HSElement => v.nodeType === 1;

/**create an element using ns:`http://www.w3.org/1999/xhtml` */
export function html<T extends keyof HTMLElementTagNameMap>(tag: T, props?: string | Partial<HTMLElement>, child?: any) {
  return g(document.createElementNS('http://www.w3.org/1999/xhtml', tag), props, child);
}
/**
 * create an svg element
 * @param tag 
 * @param attrs 
 * @param child 
 * @returns 
 */
export function svg<T extends keyof SVGElementTagNameMap>(tag: T, attrs?: string | Dic<string | number> | 0 | string | string[], child?: any): G<SVGElementTagNameMap[T]> {
  var s = new G(document.createElementNS('http://www.w3.org/2000/svg', tag));
  if (attrs)
    if (isS(attrs) || isA(attrs))
      s.c(attrs);
    else
      s.attr(attrs);
  if (child || child === 0)
    s.add(child);
  return s;
}
/**convert html string to svg element */
export function toSVG<T extends SVGElement = SVGElement>(text: string): M<T> {
  let parser = new DOMParser(), doc = parser.parseFromString(text, "image/svg+xml");
  return new M(...Array.from(doc.children) as T[]);
}

export function onfocusout(e: G, handler: (e: FocusEvent) => any) {
  handler && e.on('focusout', ev => e.contains(ev.relatedTarget as HTMLElement) || handler.call(e, ev));
  return e;
}

export function wrap<T extends HSElement = HTMLElement>(content: any, properties: Partial<T>, tag?: keyof HTMLElementTagNameMap): G<T>
export function wrap<T extends HSElement = HTMLElement>(content: any, properties?: falsy | str, tag?: keyof HTMLElementTagNameMap): G<T>
export function wrap<T extends HSElement = HTMLElement>(c: any, p?: falsy | str | Partial<T>, tag?: keyof HTMLElementTagNameMap): G<T> {
  if (isF(c)) c = c();
  if (isF((c)?.render)) c = c.render();
  if (c instanceof Element) c = new G(c);
  else if (!(c instanceof G))
    c = g(tag || "div", 0, c);
  p && g(c as One, p);
  return c;
}

/** select first element that match query same as `document.querySelect` */
export const get = <T extends HSElement = HTMLElement>(selectors: string) =>
  g(document.querySelector(selectors) as T);

/** select all element that match query same as `document.querySelectAll` */
export const getAll = <T extends HSElement = HTMLElement>(selectors?: string) =>
  new M(...Array.from(document.querySelectorAll<T>(selectors)));
/**fire event after specified amount of time */
export function delay<T extends HSElement, K extends keyof HTMLElementEventMap>(e: G<T>, action: K, delay: number, listener: (this: T, e: HTMLElementEventMap[K]) => any): G<T>;
export function delay<T extends HSElement, K extends keyof SVGElementEventMap>(e: G<T>, action: K, delay: number, listener: (this: T, e: SVGElementEventMap[K]) => any): G<T>;
export function delay(e: any, event: any, time: number, handler: (e: Event) => any) {
  handler = handler.bind(e.e);
  return e.on(event, function (this: any, e) {
    var t = `__${event}`;
    clearTimeout(this[t]);
    this[t] = setTimeout(handler, time, e);
  });
}
/** wrap for stopImmediatePropagation and preventDefault on Event */
export function clearEvent(e: Event) {
  e.stopImmediatePropagation();
  e.preventDefault();
}

/** simple style builder */
export function css(props: Style, selector?: string, defSubSelector?: str): str;
export function css(props: Style, s?: string, defSub = " ") {
  let subs = [">", " ", ":", "~", "+"];
  let r = "", subSel = "", split: string[];
  function sub(parent: string[], child: string) {
    return child.split(',')
      .map(s => parent.map(p => {
        if (subs.indexOf(s[0]) != -1)
          return p + s;
        if (s.includes("&"))
          return s.replaceAll("&", p);
        return p + defSub + s;
      }).join(',')).join(',');
  }
  if (!s || s[0] == '@') {
    for (let k in props)
      r += css(props[k], k, defSub);
    return r ? s ? s + "{" + r + "}" : r : '';
  }
  for (let key in props) {
    let val = props[key];
    if (val || val === 0) {
      if (isO(val)) {
        subSel += css(val, sub(split || (split = s.split(',')), key), defSub);
      }
      else
        r += key.replace(cssPropRgx, m => "-" + m.toLowerCase()) + ":" + val + ";";
    }
  }
  return (r ? s + "{" + r + "}" : "") + subSel;
}

// #endregion

// #region ----------main structures ----------------------

/**
 * A Wrapper for an HTML OR SVG Element
 */
export class G<T extends HSElement = HTMLElement> {
  readonly e?: T;
  constructor();
  constructor(e: T);
  constructor(e: EventTarget);
  constructor(e?: T) { this.e = e; }
  static empty: G<any>;
  get active() {
    return this.e.ownerDocument.activeElement == this.e;
  }
  get parent() {
    let e = this.e.parentElement;
    return e && new G(e);
  }
  /**get previus element sibling */
  get prev() {
    let e = this.e.previousElementSibling;
    return e && new G(e);
  }
  /**get next element sibling */
  get next() {
    let e = this.e.nextElementSibling;
    return e && new G(e);
  }
  /**first children element */
  get first() {
    let e = this.e.firstElementChild as T;
    return e && new G(e);
  }
  /**last children element */
  get last() {
    let e = this.e.lastElementChild as T;
    return e && new G(e);
  }
  /**get bounding client rect */
  get rect() { return this.e.getBoundingClientRect(); }

  /** @ignore */
  toJSON() { }
  /** check if `this` contains `child` */
  contains(child: G<any> | HSElement) {
    return child ? this.e.contains(asE(child)) : false;
  }
  /** get Input value */
  v(): str
  /** set Input value */
  v(value: Key): this;
  v(v?: Key) {
    let e = (this.e as HTMLInputElement);
    return isU(v) ? e.value : (e.value = v as str, this);
  }
  /** add listener to one or more HTML Event */
  on(actions: HTMLEventMap<T>, options?: AddEventListenerOptions): this;
  /** add listener to one or more SVG Event */
  on(actions: SVGEventMap<T>, options?: AddEventListenerOptions): this;
  /** add listener to one HTML Event  if `listener` is {@link falsy} do not anything*/
  on<K extends keyof HTMLElementEventMap>(action: K, listener: ((this: T, e: HTMLElementEventMap[K]) => any) | falsy, options?: AddEventListenerOptions): this;
  on<K extends keyof SVGElementEventMap>(action: K, listener: ((this: T, e: SVGElementEventMap[K]) => any) | falsy, options?: AddEventListenerOptions): this;
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
  /** add event listener with `once` option, E.g: remove alement after it has been dispached */
  one<K extends keyof HTMLElementEventMap>(event: K, listener: (this: HTMLElement, e: HTMLElementEventMap[K]) => any): this;
  one<K extends keyof SVGElementEventMap>(event: K, listener: (this: SVGElement, e: SVGElementEventMap[K]) => any): this;
  one(event, listener: (this: Element, e: Event) => any) {
    return this.on(event, listener, { once: true });
  }
  emit(name: str, event?: EventInit): this;
  emit(event: Event): this;
  emit(event: Event | str, init?: EventInit) {
    this.e.dispatchEvent(isS(event) ? new Event(event, init) : event);
    return this;
  }
  /**remove event listener */
  off<K extends keyof HTMLElementEventMap>(event: K | K[], listener: EventListener) {
    for (let e of isS(event) ? [event] : event)
      this.e.removeEventListener(e, listener);
    return this;
  }
  /** insert adjacent content to `this` 
   * @param child can be any valid content
  */
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
  /**insert adjacent before begin */
  before(child: any) {
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
  /**append child */
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

  /**
   * insert content at an specified index
   * @throws `invalid index` if index is outside [0, `children.length`[
   * @param index 
   * @param content 
   * @returns `this`
   */
  place(index: int, content: any) {
    if (!index)
      return this.badd(content);
    var c = this.e.children, temp = c[index < 0 ? c.length + index : index - 1];
    if (!temp)
      throw "invalid index";
    new G(temp).put('afterend', content);
    return this;
  }
  /**remove child at an specified index @returns `this` */
  unplace(index: int) {
    this.e.children[index].remove();
    return this;
  }
  addHTML(html: string) {
    return this.putHTML("beforeend", html);
  }
  /**clear content and append new content */
  set(content?: any) {
    this.e.textContent = '';
    this.add(content);
    return this;
  }
  is<T extends G>(filter: T): this is T;
  is<T extends HSElement>(filter: T): this is G<T>;
  is<T extends HTMLTag>(filter: T): this is G<HTMLElementTagNameMap[T]>;
  is(filter: string): bool
  is(filter: string | HSElement | G) {
    return isS(filter) ? this.e.matches(filter) : this.e == asE(filter);
  }
  /**get id */
  id(): string;
  /**set id */
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
  /** add `this` to another element
   * @param parent element to insert into
   */
  addTo(parent: HSElement | G) {
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
    // if (this.parent) {
    this.put('beforebegin', child);
    this.remove();
    // }
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

  /**get child element at specified index */
  child<C extends HSElement = T>(index: number): G<C>;
  /**get first child element that match filter */
  child<K extends keyof HTMLElementTagNameMap>(filter: K): G<HTMLElementTagNameMap[K]>;
  child(filter: string): G;
  child(filter: string | number) {
    let childs = this.e.children, child: Element;
    if (isS(filter)) {
      for (let i = 0; i < childs.length; i++) {
        if ((child = childs[i]).matches(filter))
          return new G(child);
      }
      return null;
    }
    else if (isN(filter))
      return (child = childs[filter < 0 ? l(childs) + filter : filter]) ? new G(child) : null;

  }

  /**get all children element  */
  childs(): M;
  childs<T extends HSElement = HSElement>(from: number, to?: number): M<T>;
  childs<K extends keyof HTMLElementTagNameMap>(filter: K): M<HTMLElementTagNameMap[K]>;
  childs<T extends HSElement = HTMLElement>(filter: string): M<T>;
  childs<T extends HSElement = HTMLElement>(filter: (child: G) => boolean): M<T>;
  childs(filter?, to?) {
    let childs = Array.from(this.e.children);
    return new M(...(isS(filter) ? childs.filter(c => c.matches(filter)) :
      isN(filter) ? childs.slice(filter, to) :
        isF(filter) ? childs.filter(c => filter(new G(c))) :
          childs) as HTMLElement[]);
  }
  query<K extends keyof HTMLElementTagNameMap>(filter: K): G<HTMLElementTagNameMap[K]>;
  query<U extends HTMLElement | SVGElement = HTMLElement>(filter: string): G<U>;
  query(filter: string) {
    let e = this.e.querySelector(filter);
    return e && new G(e);
  }
  queryAll<K extends keyof HTMLElementTagNameMap>(filter: K): M<HTMLElementTagNameMap[K]>;
  queryAll<U extends HTMLElement | SVGElement = HTMLElement>(filter: string): M<U>;
  queryAll(filter: string) {
    return new M(...Array.from(this.e.querySelectorAll(filter)) as HTMLElement[]);
  }
  closest<K extends keyof HTMLElementTagNameMap>(filter: K): G<HTMLElementTagNameMap[K]>;
  closest(filter: string): G
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
    return new G(this.e.cloneNode(deep));
  }
  /**get property */
  p<K extends keyof T>(key: K): T[K];
  /**set property */
  p<K extends keyof T>(key: K, value: T[K]): this;
  /**set multiple properties undefined value are ignored */
  p(props: Partial<T>): this;
  p(props: Dic): this;
  p(a0: str | Dic, a1?: unk) {
    if (isS(a0))
      if (isU(a1))
        return this.e[a0];
      else this.e[a0] = a1;
    else for (let key in a0)
      this.e[key] = a0[key];
    return this;
  }
  call<K extends keyof T>(key: K, ...args: any[]) {
    (this.e[key] as any)(...args);
    return this;
  }

  /**get  */
  css<T extends keyof Properties>(property: T): string;
  css<T extends keyof Properties>(property: T, value: Properties[T], important?: bool): this;
  css(styles: Properties, important?: bool): this;
  css(k: Properties | keyof Properties, v?, i?: bool) {
    let s = this.e.style;
    if (isS(k))
      if (isU(v))
        return s[k];
      else
        s.setProperty(k.replace(cssPropRgx, m => "-" + m), v, i ? "important" : "");
    else
      for (let _ in k)
        s.setProperty(_.replace(cssPropRgx, m => "-" + m), k[_], v ? "important" : "");
    return this;
  }
  /**remove all inline style */
  uncss(): this;
  /**remove a list of inline style */
  uncss(...properties: Array<keyof Properties>): this;
  uncss(...p) {
    if (p.length)
      for (let i = 0; i < p.length; i++)
        this.e.style[p[i]] = "";
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
  /**toggle class */
  tcls(names: string) {
    for (let n of names.split(' '))
      if (n) this.e.classList.toggle(n);
    return this;
  }
  /**get attribute */
  attr(name: string): string;
  /**set attribute  
   * `false` value will remove the attribute  
   * `true` value will set attribute value to a blank string eg:
   * ```html
   * <div attr></div>
   * ```
   */
  attr(name: string, value: string | boolean | number): this;
  attr(attrs: Dic<string | boolean | number>): this
  attr(attr, value?) {
    let fn = (k: str, v: string | boolean | number) =>
      v === false ?
        this.e.removeAttribute(k) :
        this.e.setAttribute(k, v === true ? '' : v as string);
    if (isS(attr)) {
      if (isU(value)) {
        return this.e.getAttribute(attr);
      }
      else fn(attr, value)
    } else for (let key in attr)
      fn(key, attr[key]);

    return this;
  }
  /**attach data to `this` element  
   * an element can only have one data attached to it
   */
  d(data: any): this;
  /**retrive data attached to this element if no data is attachad try get data attached with his parent */
  d<T = unknown>(): T;
  d(data?: any) {
    let e = this.e as HTMLElement & { _d?};
    if (isU(data))
      return def(e._d, (e = e.parentElement) && new G(e).d());
    e._d = data;
    return this;
  }
  remove() {
    this.e.remove();
    return this;
  }
}
/**
 * Represent Multiples {@link Element} have part of the functions of  {@link G} but applied to multple element at once
 */
export class M<T extends HSElement = HSElement> extends Array<T>{
  constructor(...elements: (G<T> | T)[])
  constructor(lenght: int)
  constructor(...elements: (G<T> | T)[]) {
    if (isN(elements[0]))
      super(elements[0]);
    else super(...elements.map(i => "e" in i ? i.e : i as T));
  }
  e(i: number) { return new G(this[i]); }
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
      for (let key in props)
        t.setProperty(key.replace(cssPropRgx, m => "-" + m), props[key], important ? "important" : "");
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
          result.push(...Array.from(item.children));
    return result;
  }
  next() {
    return new M(...this.map(e => e.nextElementSibling as HSElement));
  }
  prev() {
    return new M(...this.map(e => e.previousElementSibling as HSElement));
  }
  do(cb: (v: G<T>, index: number) => any) {
    for (let i = 0; i < this.length; i++)
      cb(new G(this[i]), i);
    return this;
  }
  eachS(callbackfn: (value: G<T>, index: number) => void) {
    this.forEach((value, index) => callbackfn(new G(value), index));
    return this;
  }
  push(...items: (T | Element | One<T> | keyof HTMLElementTagNameMap)[]) {
    return super.push(...items.map(i => g(i as T).e as T));
  }
}
export interface M<T extends HSElement = HSElement> {
  /** @ignore */
  slice: (start?: number, end?: number) => M<T>;
}

export type BindHandler<T, P, B> = (this: T, s: B, p: P) => void;
export abstract class Component<P = {}, Ev extends Dic<any[]> = {}, T extends HSElement = HTMLElement> implements Render<G<T>>, EventObject<Ev & { set: [P]; }> {
  /**properties */
  p: P;
  $: G<T>;
  #bonds: { prop, handler(s: One, p: P): void, e: G | Render }[];
  validators: Dic<Array<(value: any, field: any) => boolean | void>>;
  constructor(i?: P) {
    this.#bonds = [];
    this.eh = {};
    this.p = i || {} as P;
  }
  protected view?(): One<T>;
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
        null);
    }
    return this.$;
  }
  dispose() {
    if (this.$) {
      this.$.remove();
      delete this.$;
    }
    this.#bonds.length = 0;
  }
  addValidators<K extends keyof P>(field: K, validator: (value: P[K], field: K) => boolean | void) {
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
  set<K extends keyof P>(key: K[]): this;
  set<K extends keyof P>(key: K, value: Pick<P, K>): this;
  set<K extends keyof P>(key: K, value: P[K]): this;
  set(values: Partial<P>): this;
  set(key?: Arr<str> | Dic, value?) {
    let dt = this.p;
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
    for (let i = 0, b = this.#bonds; i < b.length; i++) {
      let bond = b[i];
      if (!bond.prop || bond.prop in key)
        bond.handler.call(this, bond.e, key);
    }
    emit(this, 'set', key as P);
    return this;
  }
  toggle(key: keyof P) {
    return this.set(key, !this.p[key] as any);
  }
  clone(): this {
    return new (this.constructor as any)(this.p);
  }
  readonly eh: { [K in keyof Ev | 'set']?: EventTargetCallback<this, (Ev & { set: [P] })[K]>[] };
  on<K extends keyof Ev>(event: K, callback: EventTargetCallback<this, Ev[K]>, options?: Options): this;
  on(callback: EventTargetCallback<this, [Partial<P>]>, options?: Options): this;
  on(event, callback, options?) {
    if (isF(event)) {
      callback = event;
      event = "set";
    }
    return on(this, event, callback, options);
  }
  off<K extends keyof Ev | 'set'>(event: K, callback?: EventTargetCallback<this, (Ev & { set: [P] })[K]>) {
    return off(this, event as string, callback);
  }
  emit(event: "set", arg: P): this;
  emit<K extends keyof Ev>(event: K, ...args: Ev[K]): this;
  emit(event: str, ...args: any[]) {
    return emit(this, event as string, ...args);
  }
  onset<K extends keyof P>(props: K[] | K, callback: EventTargetCallback<this, [Partial<P>]>, options: Options = {}) {
    options.check = isS(props) ?
      e => props in e : e => (props as K[]).some(prop => prop in e);

    return on(this, "set", callback, options);
  }
  bind<R extends Render, K extends keyof P>(e: R, handler: (this: this, s: R, p: P) => void, prop?: K, noInit?: bool): G;
  bind<T extends HSElement, K extends keyof P>(s: G<T>, handler: (this: this, s: G<T>, p: P) => void, prop?: K, noInit?: bool): G<T>;
  bind(element, handler, prop, noInit) {
    if ('render' in element) {
      this.#bonds.push({ e: element, handler: handler, prop: prop });
      if (!noInit)
        handler.call(this, element, this.p);
      return element.render();
    } else {
      this.#bonds.push({ e: element, handler: handler, prop: prop });
      if (!noInit)
        handler.call(this, element, this.p);
      return element;
    }
  }
  unbind(s: One) {
    var i = this.#bonds.findIndex(b => (b.e as G).e == (s as G).e || (s as Render) == b.e as Render);
    if (i != -1)
      this.#bonds.splice(i, 1);
  }
  private toJSON() { }
}
// #endregion