import { emit, EventObject, off, on as h_on } from "handler";
import type { Properties } from "./css";
import type { M } from "./m";
import { add, isF, isS, on, put } from "./s";

interface Dic<T = any> { [key: string]: T; }

export default function create<K extends keyof HTMLElementTagNameMap>(element: K, props?: Partial<HTMLElementTagNameMap[K]> | string | string[] | 0, childs?): S<HTMLElementTagNameMap[K]>;
export default function create<T extends HTMLElement = HTMLElement>(element: Create, props?: Partial<T> | string | string[] | 0, childs?): S<T>;
export default function create(e: Create, props?: string | string[] | Dic, child?/*: Child*/): S {
  if (!e) return S.empty;

  let result =
    isS(e) ?
      //element.indexOf('-') ? element.f :
      new S(document.createElement(e)) :
      e instanceof Element ?
        new S(e) :
        'render' in e ?
          e.render() :
          e;

  if (props)
    if (isS(props))
      result.attr("class", props)
    else if (Array.isArray(props))
      result.cls(props);
    else result.props(<Dic>props)

  if (child != null)
    add(result.e, child);

  return <S>result;
}
export const g = create;
export const div = (props?: 0 | string[] | string | Partial<HTMLDivElement>, child?: any) => create("div", props, child);
/**active element */
export const active = () => g(document.activeElement);
export function clone<T extends Object>(obj: T): T {
  if (typeof obj === 'object') {
    let nObj: any;
    if (obj instanceof Array) {
      nObj = Array(obj.length);
      for (let i = 0; i < obj.length; i++)
        nObj[i] = clone(obj[i]);
    } else {
      nObj = {};
      for (let key in obj)
        nObj[key] = clone(obj[key]);
    }
    obj = nObj;
  }
  return obj;
}
// #region core
export type EventTargetCallback<T, E = any> = ((this: T, e: E) => any) & { options?: EventListenerOptions; };

type EEv<Ev, I> = Ev & { set: Partial<I>; };
export abstract class E<I = {}, Events extends Dic = {}> implements Render, EventObject<Events> {
  /**interface  */
  i: I;

  /** Content rendered, filled when render is called*/
  $: S;
  //protected static default: any;
  private bonds: Array<Bind<this, I, any>> = [];
  validators: Dic<Array<(value, field) => boolean | void>>;

  /**
   * 
   * @param i interface
   */
  constructor(i?: I) {
    this.i = i || <any>{};
  }
  protected abstract view(): One<HSElement>;

  /** */
  focus() {
    this.$.focus();
    return this;
  }
  /** */
  render(): S {
    if (this.$ === void 0) {
      let view = <One<any>>this.view();
      this.$ = view ?
        'render' in view ?
          view.render() : view :
        null;
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

  /**remove all bind and element then recreate element*/
  reRender(): S {
    this.dispose();
    return this.render();
  }

  removeKey(key: string | string[]) {
    if (isS(key))
      delete this.i[key];
    return this;
  }


  addValidators<K extends keyof I>(field: K, validator: (value: I[K], field: K) => boolean | void) {
    ((this.validators ||= {})[<string>field] ||= []).push(validator);
    return this;
  }

  /**
   * if false block update of this field
   * @param key
   * @param value
   */
  private _valid(key: string, value) {
    let temp = this.validators[key];

    if (temp)
      for (let i = 0; i < temp.length; i++)
        //se apenas um retornar falso return false;
        if (!temp[i](value, key))
          return false;

    return true;
  }
  /**rebind entiry E */
  set(): this;
  /**
   * 
   * @param key
   */
  set<K extends keyof I>(key: K[]): this;
  /**
   * 
   * @param key
   * @param value
   */
  set<K extends keyof I>(key: K, value: Pick<I, K>): this;
  set<K extends keyof I>(key: K, value: I[K]): this;
  /**
   * 
   * @param values
   */
  set(values: Partial<I>): this;
  set(key?: string | Partial<I> | string[], value?) {
    let dt = this.i;
    if (typeof key == "object") {
      if (Array.isArray(key)) {
        let t: Partial<I> = {};
        for (let i = 0; i < key.length; i++) {
          let t2 = key[i]
          t[t2] = dt[t2];
        }
        key = t;
      } else {
        let t: Partial<I> = {};
        for (let k in key) {
          let val = key[k];
          if (val !== dt[k] && (!this.validators || this._valid(k, val)))
            dt[k] = t[k] = val;
        }
        if (!Object.keys(key = t).length) return this;
      }
    } else if (!key) {
      key = dt;
    } else {
      if (dt[key] === value || (this.validators && !this._valid(key, value)))
        return this;

      dt[key] = value;
      key = <Partial<I>>{ [key]: value };
    }

    for (let i = 0, b = this.bonds; i < b.length; i++) {
      let bond = b[i];
      if (!bond.prop || bond.prop in <Partial<I>>key)
        bond.handler.call(this, bond.e, key);
    }
    this.emit('set', <any>key);
    return this;
  }

  toggle(key: keyof I) {
    this.set(key, <any>!this.i[key]);
  }
  clone(): this {
    return new (<any>this.constructor)(this.i);
  }

  /**event handlers */
  readonly eh: { [P in keyof Events]?: EventTargetCallback<this, Events[P]>[] } = {};

  on<K extends keyof EEv<Events, I>>(event: K, callback: EventTargetCallback<this, Events[K]>, options?: EventListenerOptions): this;
  on(callback: EventTargetCallback<this, Partial<I>>, options?: EventListenerOptions): this;
  on(event, callback?, options?): this {
    if (isF(event)) {
      callback = event;
      event = "set";
    }
    h_on(this, event, callback, options);
    return this;
  }

  off<K extends keyof Events>(event: K, callback?: EventTargetCallback<this, Events[K]>) {
    off(this, <string>event, callback);
    return this;
  }

  emit<K extends keyof Events>(event: K, data?: Events[K]) {
    emit(this, <string>event, data);
    return this;
  }

  /**
   * 
   * @param e
   * @param handler
   * @param prop
   */
  bind<K extends keyof I, R extends Render>(e: R, handler: BindHandler<this, I, R>, prop?: K, noInit?: boolean): S;
  /**
   * 
   * @param s
   * @param handler
   * @param prop
   */
  bind<K extends keyof I, T extends HSElement>(s: S<T>, handler: BindHandler<this, I, S<T>>, prop?: K, noInit?: boolean): S<T>;
  bind(element: Render | S, handler: BindHandler<this, I, any>, prop?: string, noInit?: boolean) {
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
  /**
  * 
  * @param element Elemento onde sera feito o bind
  * @param src propiedade do model que sera feito o bind
  * @param target propiedade no bind onde se retirara o dado
  */
  inputBind<K extends keyof I>(element: E<any, { input: unknown }>, src: K, target?: string): S;
  /**
   * 
   * @param input Elemento onde sera feito o bind
   * @param prop propiedade do model que sera feito o bind
   * @param fieldSet propiedade no input onde se retirara o dado 
   * @param fieldGet propiedade no input onde sera reposto o dado
   */
  inputBind<Inp extends InputElement>(input: S<Inp>, prop: keyof I, fieldSet?: keyof Inp, fieldGet?: keyof Inp): S;
  inputBind(s: S | E<any, { input: unknown }>, prop, fieldSet = 'value', fieldGet = fieldSet) {
    if (s instanceof S) {
      //s.prop(fieldSet, this.model[prop] || '');
      s.on('input', (e) => {
        let v = e.target[fieldGet];
        this.set(<any>prop, v === '' || (typeof v === 'number' && isNaN(v)) ? null : v);
      });
      this.bind(s, () => {
        //if (reloading)
        //  reloading = false;
        //else {
        var t = this.i[prop];
        s.prop(fieldSet, t == null ? '' : t);
        //}
      }, <any>prop);

      return s;
    } else {
      //let _this = this;
      //s.update(<any>fieldGet, this.model[prop]);
      s.on('input', (value) => {
        this.set(<any>prop, <any>value);
      });
      //s.on('update', (model: EUpdate) => {
      //  if (model.has(fieldSet)) {
      //    if (reloading) {
      //      reloading = false;
      //    } else {
      //      this.update(<any>prop, model.values[fieldSet]);
      //      reloading = true;
      //    }
      //  }
      //});

      var view = s.render();
      //this.on('update', (e) => {
      //  if(e.has(''))
      //});
      this.bind(view, () => {
        //if (reloading) {
        //  reloading = false;
        //} else {
        //  let t = this.model[prop];
        //  if (t !== s.model[fieldSet]) {
        //    reloading = true;
        s.set(<any>fieldSet, this.i[prop]);
        //}
        //}

      }, <any>prop);
      return view;
    }
  }

  unbind(s: One) {
    var i = this.bonds.findIndex((b) => (<S>b.e).e == (<S>s).e || s == b.e);
    if (i != -1)
      this.bonds.splice(i, 1);
  }
  /**element by serialize to json*/
  private toJSON() { }
}
/**Macro document Single Selection, Manipulate only one element per time */
export class S<T extends HSElement = HTMLElement> {

  constructor();
  constructor(e: T);
  constructor(e: EventTarget);
  constructor(public readonly e?: T) { }
  toJSON() { }
  get valid() { return !!this.e; }
  //events
  on(actions: HTMLEventMap<T>, options?: AddEventListenerOptions): this;
  on(actions: SVGEventMap<T>, options?: AddEventListenerOptions): this;
  on<K extends keyof HTMLElementEventMap>(action: K, listener: (this: T, e: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions): this;
  on<K extends keyof SVGElementEventMap>(action: K, listener: (this: T, e: SVGElementEventMap[K]) => any, options?: AddEventListenerOptions): this;
  on<T extends Element = Element, E extends Event = Event>(action: string, fn: EventHandler<T, E>, options?: AddEventListenerOptions): this;
  on<K extends keyof HTMLElementEventMap>(action: K[], listener: (this: T, e: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions): this;
  on(event, listener?, options?) {
    on(this.e, event, listener, options);
    return this;
  }
  one<K extends keyof HTMLElementEventMap>(event: K, listener: (this: HTMLElement, e: HTMLElementEventMap[K]) => any):this;
  one<K extends keyof SVGElementEventMap>(event: K, listener: (this: SVGElement, e: SVGElementEventMap[K]) => any):this;
  one(event: string, listener: (this: Element, e: Event) => any):this;
  one(event: string, listener?: (this: Element, e: Event) => any) {
    return this.on(event, listener, { once: true });
  }

  emit(name: string, event?: EventInit): this;
  emit(event: Event): this;
  emit(event: string | Event, init?: EventInit) {
    this.e.dispatchEvent(isS(event) ? new Event(event, init) : event);
    return this;
  }
  click() {
    (<HTMLElement>this.e).click();
    return this;
  }
  off<K extends keyof HTMLElementEventMap>(event: K | K[], listener: EventListener) {
    for (let e of isS(event) ? [event] : event)
      this.e.removeEventListener(e, listener);
    return this;
  }

  /**
   * execute the action if the element is valid
   * @param action 
   */
  try<T>(action: (e: this) => T) {
    if (this.valid)
      action(this);

    return this;
  }

  static empty = new S<any>();
  put(position: InsertPosition, child: any): this {
    put(this.e, position, child);
    return this;
  }
  putAfter(child/*: Child*/): this {
    return this.put('afterend', child);
  }
  putBefore(child/*: Child*/): this {
    return this.put('beforebegin', child);
  }

  putText(pos: InsertPosition, text: string | number) {
    this.e.insertAdjacentText(pos, <any>text);
    return this;
  }
  putHTML(pos: InsertPosition, html: string) {
    this.e.insertAdjacentHTML(pos, html);
    return this;
  }

  /**  Append element and return them */
  add(child/*: Child*/): this {
    add(this.e, child);
    return this;
  }

  /**
   * Append element in begin
   * @param element
   */
  prepend(child/*: Child*/): this {
    return this.put('afterbegin', child);
  }

  /**
   * 
   * @param child
   * @param index zero based index
   */
  place(index: number, child/*: Child*/): this {
    if (!index)
      return this.put('afterbegin', child);

    var temp = this.e.children[index - 1];
    if (!temp)
      throw "out of flow";

    //var t2 = bind.s.child(pos - 1);
    new S(temp).put('afterend', child);
    return this;
  }
  /** remove child at index*/
  unplace(index: number) {
    this.e.children[index].remove();
  }
  /**
   * this method is not aconselhavel use append when possible
   * @param html
   */
  addHTML(html: string) {
    return this.putHTML("beforebegin", html);
  }

  /**
   * clear element and insert the child
   * @param child
   */
  set(child?/*: Child*/): this {
    this.e.textContent = '';
    add(this.e, child);
    return this;
  }

  id(): string;
  id(value: string | number): this;
  id(v?: string | number) {
    if (v)
      this.e.id = v as string;
    else return this.e.id;
    return this;
  }
  text(): string;
  text(text: number | string): this;
  text(value?: number | string): this | string {
    if (value === undefined) return this.e.textContent;
    this.e.textContent = <any>value;
    return this;
  }

  addTo(parent: Element | S) {
    (parent instanceof S ? parent.e : parent)
      .appendChild(this.e);

    return this;
  }
  html(): string;
  html(content: string): this;
  html(value?: string): this | string {
    if (arguments.length) {
      this.e.innerHTML = value;
      return this;
    }
    return this.e.innerHTML;
  }

  /**
   * replace selected element with new elements
   * @param val
   */
  replace(child/*: Child*/) {
    this.put('beforebegin', child);
    this.remove();
    //this.e.replaceWith((child instanceof E ? child.render() : child).e);
    //this.insert('beforebegin', e);
    //this.remove();
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
  //Data
  ////data(key: string, value: any): E
  ////data<T>(key: string): T;
  ////data(key: string): any;
  ////removeData(key: string): E;

  //Document walk



  /**get child at especific index */
  child<C extends HSElement = HSElement>(index: number): S<C>;
  child<K extends keyof HTMLElementTagNameMap>(filter: K): S<HTMLElementTagNameMap[K]>;
  child(filter: string): S;
  child(filter: string | number) {
    if (isS(filter)) {
      let childs = this.e.children;
      for (let i = 0; i < childs.length; i++) {
        let child = childs[i];
        if (child.matches(filter))
          return new S(child);
      }
      return S.empty;
    } else if (typeof filter === 'number') {
      let childs = this.e.children;
      return new S(childs[filter < 0 ? childs.length + filter : filter]);
    } else {
      return new S(this.e.firstElementChild);
    }
  }
  first() {
    return new S(this.e.firstElementChild);
  }
  last() {
    return new S(this.e.lastElementChild);
  }
  childs(): M;
  childs<T extends HSElement = HSElement>(from: number, to?: number): M<T>;
  childs<K extends keyof HTMLElementTagNameMap>(filter: K): M<HTMLElementTagNameMap[K]>;
  childs<T extends HSElement = HTMLElement>(filter: string): M<T>;
  childs<T extends HSElement = HTMLElement>(filter: (child: S) => boolean): M<T>;
  childs(filter?: ((child: S) => boolean) | string | number, to?: number) {
    let childs = Array.from(this.e.children);
    return isS(filter) ? childs.filter(c => c.matches(filter)) :
      typeof filter == "number" ? childs.slice(filter, to) :
        isF(filter) ? childs.filter(c => filter(new S(<any>c))) :
          childs;
  }

  query<K extends keyof HTMLElementTagNameMap>(filter: K): S<HTMLElementTagNameMap[K]>;
  query<U extends HTMLElement | SVGElement = HTMLElement>(filter: string): S<U>;
  query<U extends HTMLElement | SVGElement = HTMLElement>(filter: string) {
    return new S<U>(this.e.querySelector(filter));
  }
  queryAll<K extends keyof HTMLElementTagNameMap>(filter: K): M<HTMLElementTagNameMap[K]>;
  queryAll<U extends HTMLElement | SVGElement = HTMLElement>(filter: string): M<U>
  queryAll<U extends HTMLElement | SVGElement = HTMLElement>(filter: string) {
    return Array.from(<ArrayLike<U>>this.e.querySelectorAll(filter));
  }

  parent() {
    return new S(this.e.parentElement);
  }

  closest(filter: string) {
    return new S(this.e.closest(filter));
  }

  parents(filter: string): M {
    let
      l = [],
      p = this.e;
    while (p = <any>p.parentElement)
      if (!filter || p.matches(filter))
        l.push(p);
    return l;
  }



  clone(): S;
  clone(deep: boolean): S;
  clone(deep?: boolean) {
    return new S(<Element>this.e.cloneNode(deep));
  }

  prev() {
    return new S(this.e.previousElementSibling);
  }

  next() {
    return new S(this.e.nextElementSibling);
  }
  //properties manipulation
  prop<K extends keyof T>(key: K): T[K];
  prop<T = any>(key: string): T;
  prop<K extends keyof T>(key: K, value: T[K]): this;
  prop(key: string, value): this;
  prop(props: string, value?: unknown) {
    if (isS(props))
      if (arguments.length == 1) {
        return this.e[props];
      } else this.e[props] = value;

    return this;
  }
  //properties manipulation
  props(props: Partial<T>): this;
  props(props: Dic): this;
  props(props: Partial<T>) {
    for (var key in props) {
      var value = props[key];
      if (value !== undefined)
        this.e[key] = props[key];
    }

    return this;
  }

  call<K extends keyof T>(key: K, ...params: any[]) {
    return (<Function>this.e[<any>key]).call(this.e, ...params);
  }
  css<T extends keyof Properties>(property: T): string;
  /**
   * 
   * @param property
   * @param value
   * @param important
   */
  css<T extends keyof Properties>(property: T, value: Properties[T]): this;
  /**
   * 
   * @param styles
   */
  css(styles: Properties): this;
  css(csss: Properties | string, value?) {
    let s = this.e.style;
    if (isS(csss))
      if (value === undefined)
        return s[csss];
      else s[csss] = value as string;

    else for (let css in csss)
      s[css] = <string>csss[css];

    return this;
  }

  /**
   * remove all inline style
   * @param properties
   */
  uncss()
  /**
   * remove inline style
   * @param properties
   */
  uncss(properties: Array<keyof Properties>)
  /**
   * remove inline style
   * @param properties
   */
  uncss(properties?: Array<keyof Properties>) {
    if (properties)
      for (let i = 0; i < properties.length; i++)
        this.e.style[properties[i]] = "";
    else this.e.removeAttribute('style');

    return this;
  }
  uncls() {
    this.e.removeAttribute('class');
    //var cls = this.e.classList;
    //while (cls.length)
    //  cls.remove(cls.item(0));
    return this;
  }
  /**
   * add one or more classes to element
   * @param classes
   */
  cls(classes: string | string[]): this;
  /**
   * add or remove classes to element
   * @param names
   * @param set if false remove else add
   */
  cls(names: string | string[], set: boolean): this;
  cls(names: string | string[], set?: boolean) {
    this.e.classList[set === false ? 'remove' : 'add'].apply(this.e.classList, isS(names) ? names.trim().split(' ').filter(n => n) : names);
    return this;
  }
  /**toogle class */
  tcls(names: string) {
    for (let n of names.split(' '))
      if (n) this.e.classList.toggle(n.replace(' ', ''));
    return this;
  }
  hasClass(name: string) {
    return this.e.classList.contains(name);
  }
  attr(attr: string, value: string | boolean | number): this;
  attr(attr: string): string;
  attr(attr: string, value?: string | boolean | number): this | string {
    if (value === undefined) {
      return this.e.getAttribute(attr);
    } else if (value === false)
      this.e.removeAttribute(attr);
    else this.e.setAttribute(attr, value === true ? '' : <string>value);

    return this;
  }
  attrs(attrs: Dic<string | boolean | number>): this {
    for (let key in attrs) {
      let value = attrs[key];
      if (value === false)
        this.e.removeAttribute(key);
      else this.e.setAttribute(key, value === true ? '' : <string>value);
    }

    return this;
  }

  /**bind data to element */
  d(data: any): this;
  /**get data binded in the first element in the selection */
  d<T = unknown>(): T;
  d(data?: any) {
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

// #endregion

// #region utility
export function html<T extends keyof HTMLElementTagNameMap>(tag: T, props?: string | Partial<SVGElement>, child?/*: Child*/): S {
  return create(<any>document.createElementNS('http://www.w3.org/1999/xhtml', tag), props, child);
}
export function xml<T extends keyof HTMLElementTagNameMap>(tag: T, props?: string | Partial<SVGElement>, child?/*: Child*/): S {
  return create(<any>document.createElementNS('http://www.w3.org/1999/xhtml', tag), props, child);
}
export function svg<T extends keyof SVGElementTagNameMap>(tag: T, attrs?: string | Dic<string | number> | 0 | string | string[], child?/*: Child*/) {
  var s = new S<SVGElementTagNameMap[T]>(document.createElementNS('http://www.w3.org/2000/svg', tag));
  if (attrs)
    if (isS(attrs) || Array.isArray(attrs))
      s.cls(attrs);
    else s.attrs(attrs);

  if (child || child === 0)
    s.add(child);

  return s;
}
export function toSVG<T extends SVGElement = SVGElement>(text: string) {
  let parser = new DOMParser(),
    doc = parser.parseFromString(text, "image/svg+xml");
  return new S(<T>doc.firstChild);
}
export function wrap<T extends HTMLElement = HTMLElement>(child/*: Child*/, props?: string | 0 | string[] | Partial<T>, tag?: keyof HTMLElementTagNameMap): S<T> {
  if (isF(child))
    child = child();

  if (child instanceof E)
    child = child.render();

  else if (child instanceof Element)
    child = new S(child);

  else if (!(child instanceof S))
    child = create(tag || 'div', null, [child]);

  if (props)
    create(<S>child, props);

  return <any>child;
}
export function get(): S;
export function get<T extends HTMLElement | SVGElement = HTMLElement>(query: T | S | E<any, any>): S<T>;
export function get<T extends HTMLElement | SVGElement = HTMLElement>(query: string, context?: S | Element): S<T>;
export function get(input?: string | Element | S | E, context?: S | Element) {
  if (input) {
    if (isS(input)) {
      if (context instanceof S)
        context = context.e;
      return new S((context || document).querySelector(input));
    }
    if ((input instanceof E && (input = input.render())) || input instanceof S)
      return input;

  } else {
    return S.empty;
  }
}

export function getAll(input?: string, context?: Element): M {
  return Array.from((context || document).querySelectorAll(<string>input));
}

/**class list */
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
/**class list */
export function cl(...cls: Array<string | string[]>) {
  let c = new CL;
  if (cls.length)
    c.push(...cls);
  return c;
}
// #endregion


// #region types

// #endregion




export interface Render<T extends HSElement = HSElement> {
  render(): S<T>;
}
let _id = 0;
export const id = () => 'i' + (_id++);
export type EventHandler<T, E> = (this: T, e: E) => any;

export type HSElement = HTMLElement | SVGElement;
export type ANYElement = HTMLElement | SVGElement;
export type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export type One<T extends HSElement = HTMLElement> = S<T> | Render<T>;
/**ElementNotation */
export type Create = keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | Element | S | Render;

// const be = 'beforeend';

export type BindHandler<T, M, B> = (this: E<M>, s: B, model: M) => void;
export interface Bind<T, M, K extends keyof M> {
  e: S | Render,
  prop: K,
  handler: BindHandler<T, M, E<any> | S>;
}

export type EventMap<T> = HTMLEventMap<T> | SVGEventMap<T> | { [key: string]: (this: Element, e: Event) => any; };
export type HTMLEventMap<T> = { [K in keyof HTMLElementEventMap]?: (this: T, e: HTMLElementEventMap[K]) => any };
export type SVGEventMap<T> = { [K in keyof SVGElementEventMap]?: (this: T, e: SVGElementEventMap[K]) => any };

/** call stopImmediatePropagation and preventDefault */
export function clearEvent(e: Event) {
  e.stopImmediatePropagation();
  e.preventDefault();
}