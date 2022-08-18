import { EventObject, Options, emit, off, on as h_on } from "./event.js";
import type { Properties } from "./css.js";
interface Dic<T = any> {
  [key: string]: T;
}
const isS = (value: unknown): value is string => typeof value === 'string';
const isF = (value: unknown): value is Function => typeof value === 'function';

// export function on<T extends S>(e: T, actions: HTMLEventMap<T>, options?: AddEventListenerOptions): T;
// export function on<T extends S>(e: T, actions: SVGEventMap<T>, options?: AddEventListenerOptions): T;
// export function on<T extends S, K extends keyof HTMLElementEventMap>(e: T, action: K, listener: (this: T, e: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions): T;
// export function on<T extends S, K extends keyof SVGElementEventMap>(e: T, action: K, listener: (this: T, e: SVGElementEventMap[K]) => any, options?: AddEventListenerOptions): T;
// export function on<T extends Element = Element, E extends Event = Event>(e: T, action: string, fn: EventHandler<T, E>, options?: AddEventListenerOptions): T;
// export function on<T extends S, K extends keyof HTMLElementEventMap>(e: T, action: K[], listener: (this: T, e: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions): T;
// export function on(e, event, listener, options?) {

// }

export function delay<T extends ANYElement, K extends keyof HTMLElementEventMap>(e: S<T>, action: K, delay: number, listener: (this: T, e: HTMLElementEventMap[K]) => any): T;
export function delay<T extends ANYElement, K extends keyof SVGElementEventMap>(e: S<T>, action: K, delay: number, listener: (this: T, e: SVGElementEventMap[K]) => any): T;
export function delay(e: S, event: string, delay: number, handler: (e: Event) => any) {
  handler = handler.bind(e);
  e.on(event, function (e) {
    var t = `_${event}_timer`;
    clearTimeout(this[t]);
    this[t] = setTimeout(handler, delay, e);
  });
  return e;
}
export default function create<K extends keyof HTMLElementTagNameMap>(element: K, props?: Partial<HTMLElementTagNameMap[K]> | string | string[] | 0, childs?: any): S<HTMLElementTagNameMap[K]>;
export default function create<T extends HTMLElement = HTMLElement>(element: Create, props?: Partial<T> | string | string[] | 0, childs?: any): S<T>
export default function create(e: Create, props, child) {
  if (!e)
    return new S();
  let result = (isS(e) ?
    new S(document.createElement(e)) :
    isD(e) ?
      new S(e) :
      'render' in e ?
        e.render() :
        e) as S;
  if (props)
    if (isS(props) || Array.isArray(props))
      result.cls(props);
    else
      result.props(props);
  if (child != null)
    result.add(child);
  return result;
}
export const g = create;
export const div = (props?: 0 | string[] | string | Partial<HTMLDivElement>, child?: any) =>
  g("div", props, child);
export const active = () => g(document.activeElement);
export type EventTargetCallback<T, E = any> = ((this: T, e: E) => any) & {
  options?: Options;
};
type EEv<Ev, I> = Ev & {
  set: Partial<I>;
};
export abstract class E<I = {}, Events extends Dic = {}> implements Render, EventObject<Events> {
  i: I;
  $: S;
  private bonds: { prop, handler: BindHandler<E, I, S | Render>, e: S | Render }[];
  validators: Dic<Array<(value: any, field: any) => boolean | void>>;
  constructor(i?: I) {
    this.bonds = [];
    this.eh = {};
    this.i = i || {} as I;
  }
  protected abstract view(): One<HSElement>;
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
  set(key?: string | string[] | Dic, value?) {
    let dt = this.i;
    if (typeof key == "object") {
      if (Array.isArray(key)) {
        let t = {};
        for (let i = 0; i < key.length; i++) {
          let t2 = key[i];
          t[t2] = dt[t2];
        }
        key = t;
      }
      else {
        let t = {};
        for (let k in key) {
          let val = key[k];
          if (val !== dt[k] && (!this.validators || this._valid(k, val)))
            dt[k] = t[k] = val;
        }
        if (!Object.keys(key = t).length)
          return this;
      }
    }
    else if (!key) {
      key = dt;
    }
    else {
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
    this.emit('set', key as any);
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
  on(callback: EventTargetCallback<this, Partial<I>>, options?: Options): this;
  on(event, callback, options?) {
    if (isF(event)) {
      callback = event;
      event = "set";
    }
    return h_on(this, event, callback, options);
  }
  off<K extends keyof Events>(event: K, callback?: EventTargetCallback<this, Events[K]>) {
    off(this, event as string, callback);
    return this;
  }
  emit<K extends keyof Events>(event: K, data?: Events[K]) {
    emit(this, event as string, data);
    return this;
  }
  onset<K extends keyof I>(props: K[] | K, callback: EventTargetCallback<this, Partial<I>>, options: Options = {}) {
    options.check = isS(props) ?
      e => props in e : e => (props as K[]).some(prop => prop in e);

    return h_on(this, "set", callback, options);
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
export class S<T extends HSElement = HTMLElement> {
  readonly e?: T;
  constructor();
  constructor(e: T);
  constructor(e: EventTarget);
  constructor(e?: T) {
    this.e = e;
  }
  toJSON() { }
  get valid() { return !!this.e; }
  rect() { return this.e.getBoundingClientRect(); }
  contains(child: S | HSElement) {
    return child ? this.e.contains(asE(child)) : false;
  }
  on(actions: HTMLEventMap<T>, options?: AddEventListenerOptions): this;
  on(actions: SVGEventMap<T>, options?: AddEventListenerOptions): this;
  on<K extends keyof HTMLElementEventMap>(action: K, listener: (this: T, e: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions): this;
  on<K extends keyof SVGElementEventMap>(action: K, listener: (this: T, e: SVGElementEventMap[K]) => any, options?: AddEventListenerOptions): this;
  on<TT extends Element = Element, E extends Event = Event>(action: string, fn: EventHandler<TT, E>, options?: AddEventListenerOptions): this;
  on<K extends keyof HTMLElementEventMap>(action: K[], listener: (this: T, e: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions): this;
  on(event, listener?, options?) {
    if (isS(event)) {
      if (listener)
        this.e.addEventListener(event, listener, options);
    }
    else if (Array.isArray(event)) {
      if (listener)
        for (let ev of event)
          this.e.addEventListener(ev, listener, options);
    }
    else
      for (let ev in event) {
        let t = event[ev];
        if (t)
          this.e.addEventListener(ev, t, listener);
      }
    return this;
  }
  one<K extends keyof HTMLElementEventMap>(event: K, listener: (this: HTMLElement, e: HTMLElementEventMap[K]) => any): this;
  one<K extends keyof SVGElementEventMap>(event: K, listener: (this: SVGElement, e: SVGElementEventMap[K]) => any): this;
  one(event: string, listener: (this: Element, e: Event) => any): this;
  one(event: string, listener: (this: Element, e: Event) => any) {
    return this.on(event, listener, { once: true });
  } t
  emit(name: string, event?: EventInit): this;
  emit(event: Event): this;
  emit(event, init?) {
    this.e.dispatchEvent(isS(event) ? new Event(event, init) : event);
    return this;
  }
  click() {
    (this.e as HTMLElement).click();
    return this;
  }
  off<K extends keyof HTMLElementEventMap>(event: K | K[], listener: EventListener) {
    for (let e of isS(event) ? [event] : event)
      this.e.removeEventListener(e, listener);
    return this;
  }
  try<T>(action: (e: this) => T) {
    if (this.valid)
      action(this);
    return this;
  }
  static empty: S<any>;
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
  putAfter(child: any) {
    return this.put('afterend', child);
  }
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
  prepend(child: any) {
    return this.put('afterbegin', child);
  }
  place(index: number, child: any) {
    if (!index)
      return this.put('afterbegin', child);
    var temp = this.e.children[index - 1];
    if (!temp)
      throw "out of flow";
    new S(temp).put('afterend', child);
    return this;
  }
  unplace(index: number) {
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
  text(value?) {
    if (value === undefined)
      return this.e.textContent;
    this.e.textContent = value;
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
    let childs = this.e.children;
    if (isS(filter)) {
      for (let i = 0; i < childs.length; i++) {
        let child = childs[i];
        if (child.matches(filter))
          return new S(child);
      }
      return new S();
    }
    else if (typeof filter === 'number')
      return new S(childs[filter < 0 ? childs.length + filter : filter]);

  }
  /**first child */
  first() {
    return new S(this.e.firstElementChild);
  }
  /**last child */
  last() {
    return new S(this.e.lastElementChild);
  }

  childs(): M;
  childs<T extends HSElement = HSElement>(from: number, to?: number): M<T>;
  childs<K extends keyof HTMLElementTagNameMap>(filter: K): M<HTMLElementTagNameMap[K]>;
  childs<T extends HSElement = HTMLElement>(filter: string): M<T>;
  childs<T extends HSElement = HTMLElement>(filter: (child: S) => boolean): M<T>;
  childs(filter?, to?) {
    let childs = Array.from(this.e.children);
    return new M(...(isS(filter) ? childs.filter(c => c.matches(filter)) :
      typeof filter == "number" ? childs.slice(filter, to) :
        isF(filter) ? childs.filter(c => filter(new S(c))) :
          childs) as HTMLElement[]);
  }

  query<K extends keyof HTMLElementTagNameMap>(filter: K): S<HTMLElementTagNameMap[K]>;
  query<U extends HTMLElement | SVGElement = HTMLElement>(filter: string): S<U>;
  query(filter: string) {
    return new S(this.e.querySelector(filter));
  }
  queryAll<K extends keyof HTMLElementTagNameMap>(filter: K): M<HTMLElementTagNameMap[K]>;
  queryAll<U extends HTMLElement | SVGElement = HTMLElement>(filter: string): M<U>;
  queryAll(filter: string) {
    return new M(...Array.from(this.e.querySelectorAll(filter)) as HTMLElement[]);
  }
  parent() {
    return new S(this.e.parentElement);
  }
  closest(filter: string) {
    return new S(this.e.closest(filter));
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
  prev() {
    return new S(this.e.previousElementSibling);
  }
  next() {
    return new S(this.e.nextElementSibling);
  }

  prop<K extends keyof T>(key: K): T[K];
  prop<T = any>(key: string): T;
  prop<K extends keyof T>(key: K, value: T[K]): this;
  prop(key: string, value: any): this;
  prop(props, value?) {
    if (isS(props))
      if (arguments.length == 1) {
        return this.e[props];
      }
      else
        this.e[props] = value;
    return this;
  }
  props(props: Partial<T>): this;
  props(props: Dic): this;
  props(props: Dic) {
    for (var key in props) {
      var value = props[key];
      if (value !== undefined)
        this.e[key] = props[key];
    }
    return this;
  }
  call<K extends keyof T>(key: K, ...params: any[]) {
    return (this.e[key] as any).call(this.e, ...params);
  }

  css<T extends keyof Properties>(property: T): string;
  css<T extends keyof Properties>(property: T, value: Properties[T]): this;
  css(styles: Properties): this;
  css(csss, value?) {
    let s = this.e.style;
    if (isS(csss))
      if (value === undefined)
        return s[csss];
      else
        s[csss] = value;
    else
      for (let css in csss)
        s[css] = csss[css];
    return this;
  }
  uncss(): any;
  uncss(properties: Array<keyof Properties>): any;
  uncss(properties?) {
    if (properties)
      for (let i = 0; i < properties.length; i++)
        this.e.style[properties[i]] = "";
    else
      this.e.removeAttribute('style');
    return this;
  }
  uncls() {
    this.e.removeAttribute('class');
    return this;
  }
  cls(classes: string | string[]): this;
  cls(names: string | string[], set: boolean): this;
  cls(names, set?) {
    this.e.classList[set === false ? 'remove' : 'add'].apply(this.e.classList, isS(names) ? names.trim().split(' ').filter(n => n) : names);
    return this;
  }
  /**toggle class */
  tcls(names: string) {
    for (let n of names.split(' '))
      if (n)
        this.e.classList.toggle(n.replace(' ', ''));
    return this;
  }
  hasClass(name: string) {
    return this.e.classList.contains(name);
  }
  attr(attr: string, value: string | boolean | number): this;
  attr(attr: string): string;
  attr(attr, value?) {
    if (value === undefined) {
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
  d(data?) {
    if (data === undefined)
      return this.e['_d'];
    this.e['_d'] = data;
    return this;
  }
  remove() {
    this.e.remove();
    return this;
  }
}
export const isE = (v: any): v is S<any> => v.e && v.e?.nodeType === 1;
export const asE = <T extends HSElement>(v: T | S<T>) => (v as S).e ? (v as S).e : v as T;
const isD = (v: any): v is HSElement => v.nodeType === 1;
export class M<T extends HSElement = HSElement> extends Array<T>{
  constructor(...elements: (S<T> | T)[]) {
    super(...elements.map(i => "e" in i ? i.e : i as T));
  }
  e(i: number) { return new S(this[i]); }
  on<K extends keyof HTMLElementEventMap>(action: K, listener: (this: T, e: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions): M<T>;
  on<K extends keyof SVGElementEventMap>(action: K, listener: (this: T, e: SVGElementEventMap[K]) => any, options?: AddEventListenerOptions): M<T>
  on(event, listener, options) {
    for (let i = 0; i < this.length; i++)
      this[i].addEventListener(event, listener, options);
    return this;
  }
  emit(event: Event) {
    for (let i = 0, l = this.length; i < l; i++)
      this[i].dispatchEvent(event);
    return this;
  }
  css(props: Properties) {
    for (let css in props)
      for (let i = 0; i < this.length; i++)
        this[i].style[css] = props[css];
    return this;
  }
  cls(names: string[] | string, set?: boolean) {
    isS(names) && (names = names.split(' ').filter(v => v));
    for (let i = 0; i < this.length; i++) {
      this[i].classList[set === false ? 'remove' : 'add'](...names);
    }
    return this;
  }
  prop<K extends keyof T>(prop: K, value: T[K]): this
  prop(prop: string, value: any): this
  prop(prop: string, value: any) {
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
        typeof filter === "number" ?
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
export const m = <T extends HSElement = HSElement>(...elements: (S<T> | T)[]) =>
  new M(...elements);
export function html<T extends keyof HTMLElementTagNameMap>(tag: T, props?: string | Partial<HTMLElement>, child?: any) {
  return g(document.createElementNS('http://www.w3.org/1999/xhtml', tag), props, child);
}
export function xml(tag: string, props?: string | Partial<SVGElement>, child?: any) {
  return g(document.createElementNS('http://www.w3.org/1999/xhtml', tag), props, child);
}
export function svg<T extends keyof SVGElementTagNameMap>(tag: T, attrs?: string | Dic<string | number> | 0 | string | string[], child?: any): S<SVGElementTagNameMap[T]> {
  var s = new S(document.createElementNS('http://www.w3.org/2000/svg', tag));
  if (attrs)
    if (isS(attrs) || Array.isArray(attrs))
      s.cls(attrs);
    else
      s.attrs(attrs);
  if (child || child === 0)
    s.add(child);
  return s;
}
export function toSVG<T extends SVGElement = SVGElement>(text: string): S<T> {
  let parser = new DOMParser(), doc = parser.parseFromString(text, "image/svg+xml");
  return new S(doc.firstChild);
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
export function onfocusout(e: S, handler: (e: FocusEvent) => any) {
  handler && e.on('focusout', ev => e.contains(ev.relatedTarget as HTMLElement) || handler.call(e, ev));
  return e;
}
export function get<T extends HSElement = HTMLElement>(query: string, ctx?: S | HSElement) {
  return new S((ctx ? asE(ctx) : document).querySelector<T>(query));
}
export function getAll<T extends HSElement = HTMLElement>(input?: string, ctx?: S | HSElement) {
  return new M(...Array.from((ctx ? asE(ctx) : document).querySelectorAll<T>(input)));
}
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
  tryAdd(cls: string) {
    if (!this.includes(cls))
      this.push(cls);
    return this;
  }
}
export function cl(...cls: Array<string | string[]>) {
  let c = new CL;
  if (cls.length)
    c.push(...cls);
  return c;
}
export interface Render<T extends HSElement = HSElement> {
  render(): S<T>;
}
export interface MRender<T = any> {
  render(): T;
}
let _id = 0;
export const id = () => 'i' + (_id++);
export type EventHandler<T, E> = (this: T, e: E) => any;
export type HSElement = HTMLElement | SVGElement;
export type ANYElement = HTMLElement | SVGElement;
export type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
export type One<T extends HSElement = HTMLElement> = S<T> | Render<T>;
export type Create = keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | Element | S | Render;
export type BindHandler<T, M, B> = (this: E<M>, s: B, model: M) => void;
export interface Bind<T, M, K extends keyof M> {
  e: S | Render;
  prop: K;
  handler: BindHandler<T, M, E<any> | S>;
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
export function clearEvent(e: Event) {
  e.stopImmediatePropagation();
  e.preventDefault();
}
export type Lazy<T> = (() => T) | T

export type Tr = S<HTMLTableRowElement>;
export type Input = S<HTMLInputElement>;