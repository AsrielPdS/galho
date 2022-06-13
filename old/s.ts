import { Properties } from "./css";
import type { EventHandler, HTMLEventMap, SVGEventMap, S as _S, E } from "./galho";

/**single selection*/
export type S = HTMLElement | SVGElement;
export type Create = keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | S;
type SS<T extends S> = T | _S<T>;

export const isS = (value: unknown): value is string => typeof value === 'string';
export const isF = (value: unknown): value is Function => typeof value === 'function';
export function css<T extends S, P extends keyof Properties>(e: T, property: P): string;
/**
 * 
 * @param property
 * @param value
 * @param important
 */
export function css<T extends S, P extends keyof Properties>(e: T, property: P, value: Properties[P]): T;
/**
 * 
 * @param styles
 */
export function css<T extends S>(e: T, styles: Properties): T;
export function css(e: S, csss: Properties | string, value?) {
  let s = e.style;
  if (isS(csss))
    if (value === undefined)
      return s[csss];
    else s[csss] = value as string;

  else for (let css in csss)
    s[css] = <string>csss[css];

  return e;
}
export function g<K extends keyof HTMLElementTagNameMap>(element: K, props?: string | string[] | 0, childs?): HTMLElementTagNameMap[K];
export function g<T extends HTMLElement = HTMLElement>(element: Create, props?: string | string[] | 0, childs?): T;
export function g(e: Create, props?: string | string[], child?/*: Child*/) {
  let result = isS(e) ? document.createElement(e) : e;

  if (props)
    if (isS(props))
      result.setAttribute("class", props)
    else result.classList.add(...props);

  if (child != null)
    add(result, child);

  return result;
}
export function div<K extends keyof HTMLElementTagNameMap>(props?: Partial<HTMLElementTagNameMap[K]> | string | string[] | 0, childs?): HTMLDivElement;
export function div<T extends HTMLElement = HTMLElement>(props?: Partial<T> | string | string[] | 0, childs?): HTMLDivElement;
export function div(props, childs) {
  return g("div", props, childs)
}
export function add(e: ParentNode, child: any) {
  switch (typeof child) {
    case 'object':
      if (child)
        if (
          isSelection(child) ? (child = child.e) :
            'render' in child ? (child = child.render().e) :
              child instanceof Element)
          e.append(<Element>child);

        else if (!child) break;
        else if (isF(child.then))
          child.then(c => add(e, c));
        else for (let i = 0, l = child.length; i < l; i++)
          add(e, child[i]);
      break;
    case 'string':
    case 'number':
    case 'bigint':
      e.append(<string>child);
      break;
    case 'function':
      add(e, child());
      break;
  }
}
export function put(e: Element, position: InsertPosition, child: any) {
  switch (typeof child) {
    case 'object':
      if (child)
        if (
          isSelection(child) ? (child = child.e) :
            'render' in child ? (child = child.render().e) :
              child instanceof Element)
          e.insertAdjacentElement(position, <Element>child);

        else if (!child) break;
        else if (isF(child.then))
          child.then(c => put(e, position, c));
        //if 'afterbegin' or 'afterend' insert from last to first to mantain order;
        else if (position[0] == 'a')
          for (let i = (<ArrayLike<any>>child).length - 1; i >= 0; i--)
            put(e, position, child[i]);
        else for (let i = 0, l = (<ArrayLike<any>>child).length; i < l; i++)
          put(e, position, child[i]);
      break;
    case 'string':
    case 'number':
    case 'bigint':
      e.insertAdjacentText(position, <string>child);
      break;
    case 'function':
      put(e, position, child());
      break;
  }
}
export function on<T extends S>(e: T, actions: HTMLEventMap<T>, options?: AddEventListenerOptions): T;
export function on<T extends S>(e: T, actions: SVGEventMap<T>, options?: AddEventListenerOptions): T;
export function on<T extends S, K extends keyof HTMLElementEventMap>(e: T, action: K, listener: (this: T, e: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions): T;
export function on<T extends S, K extends keyof SVGElementEventMap>(e: T, action: K, listener: (this: T, e: SVGElementEventMap[K]) => any, options?: AddEventListenerOptions): T;
export function on<T extends Element = Element, E extends Event = Event>(e: T, action: string, fn: EventHandler<T, E>, options?: AddEventListenerOptions): T;
export function on<T extends S, K extends keyof HTMLElementEventMap>(e: T, action: K[], listener: (this: T, e: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions): T;
export function on<T extends S>(e: T, event: string | string[] | HTMLEventMap<T> | SVGEventMap<T>, listener?, options?: AddEventListenerOptions) {
  // let on: Dic = this.e['_on'] || (this.e['_on'] = {});
  if (isS(event)) {
    if (listener)
      // (on[event] || (on[event] = [])).push(listener);

      e.addEventListener(event, listener, options);

  } else if (Array.isArray(event)) {
    if (listener)
      for (let ev of event)
        // (on[e] || (on[e] = [])).push(listener);
        e.addEventListener(ev, listener, options);


  } else for (let ev in event) {
    let t = event[ev];
    if (t)
      // (on[e] || (on[e] = [])).push(t);
      e.addEventListener(ev, t, listener);

  }
  return e;
}
// #region event
export function delay<T extends S, K extends keyof HTMLElementEventMap>(e: SS<T>, action: K, delay: number, listener: (this: T, e: HTMLElementEventMap[K]) => any): T;
export function delay<T extends S, K extends keyof SVGElementEventMap>(e: SS<T>, action: K, delay: number, listener: (this: T, e: SVGElementEventMap[K]) => any): T;
export function delay<T extends S, E extends Event = Event>(e: SS<T>, action: string, delay: number, fn: EventHandler<T, E>): T;
export function delay<T extends S>(e: SS<T>, event, delay?, handler?: (a?, b?, c?) => any) {
  handler = handler.bind(e);
  on(_(e), event, function (e) {
    var t = `_${event}_timer`;
    clearTimeout(this[t]);
    this[t] = setTimeout(handler, delay, e);
  });
  return e;
}
export function one<T extends S>(e: T, actions: HTMLEventMap<T>): T;
export function one<T extends S>(e: T, actions: SVGEventMap<T>): T;
export function one<T extends S, K extends keyof HTMLElementEventMap>(e: T, action: K, listener: (this: HTMLElement, e: HTMLElementEventMap[K]) => any): T;
export function one<T extends S, K extends keyof SVGElementEventMap>(e: T, action: K, listener: (this: SVGElement, e: SVGElementEventMap[K]) => any): T;
export function one<T extends S>(e: T, action: string, listener: (this: Element, e: Event) => any): T;
export function one<T extends S>(e: T, event, listener?) {
  if (isS(event))
    on(e, event, listener, { once: true });
  else on(e, event, { once: true });
  return e;
}
// #endregion
/**append element using DocumentFragment */
export function frag<T extends S>(e: T, child/*: Child*/): T {
  let doc = new DocumentFragment();
  add(doc, child);
  e.append(doc);
  return e;
}

export function bind<T extends S, M>(e: T, prop: keyof T, src: E<M>, field: keyof M): T;
export function bind<T extends S, M>(e: T, prop: keyof T, src: E<M>, expression: string): T;

export function bind<T extends S, U extends S>(e: T, prop: keyof T, src: S, field: keyof U): T;
export function bind<T extends S>(e: T, prop: keyof T, src: S, expression: string): T;


export function bind<T extends S, U extends Object>(e: T, prop: keyof T, src: U, field: keyof U): T;
export function bind<T extends S>(e: T, prop: keyof T, src: Object, expression: string): T;

export function bind<T extends S>(e: T, prop, src, value?) {
  throw "not implemented";
  return e;
}
export function focusin<T extends S>(e: T, handler?: (e: FocusEvent) => any) {
  let t = _(e);
  handler && on(t, 'focusin', e => t.contains(<Node>e.relatedTarget) || handler.call(t, e));
  return e;
}
export function focusout<T extends S>(e: SS<T>, handler?: (e: FocusEvent) => any) {
  let t = _(e);
  handler && on(t, 'focusout', e => t.contains(<Node>e.relatedTarget) || handler.call(t, e));
  return e;
}

/** */
export function index<T extends S>(e: T,): number {
  var p = e.parentElement;
  if (p)
    return Array.prototype.indexOf.call(p.children, e);
  return -1;
}

/** */
export function indexInDocument(e: Element): number {
  let c = 0;
  while (e && e.parentElement) {
    c += Array.prototype.indexOf.call(e.children, e);
    e = e.parentElement;
  }
  return c;
}
export function childByCls<T extends S>(e: T, cls: string): S {
  if (cls)
    for (let i = 0; i < e.children.length; i++) {
      let child = e.children.item(i);
      if (child.classList.contains(cls))
        return <S>child;
    }

  return null;
}
export function count<T extends S>(e: T,) {
  return e.childElementCount;
}
export function fullHtml<T extends S>(e: SS<T>) { return _(e).outerHTML; }
export function isEmpty<T extends S>(e: SS<T>) {
  return !_(e).hasChildNodes();
}
const _ = <T extends S>(e: SS<T>) => isSelection<T>(e) ? e.e : e;
export function rect<T extends S>(e: SS<T>) {
  return _(e).getBoundingClientRect();
}
export function focused<T extends S>(e: SS<T>) {
  return document.activeElement == _(e);
}
/**prev element */
export function prevE<T extends S>(e: T) {
  return e.previousElementSibling;
}
export function prev<T extends Node>(e: T) {
  return e.previousSibling;
}
export function parent<T extends Node>(e: T) {
  return e.parentElement;
}
export function text<T extends Node>(e: T) {
  return e.textContent;
}
export function last<T extends Node>(e: T) {
  return e.lastChild;
}
export function contains<T extends S>(e: SS<T>, child: S | Node) {
  return _(e).contains(isSelection(child) ? child.e : child);
}
export function inDOM<T extends S>(e: T,) {
  return !!e.parentNode;
}
export function tag<T extends S>(e: T,) {
  return e.localName;
}
export function isInput<T extends S>(e: SS<T>) {
  return _(e).matches('input,textarea,select');
}
export function vScroll<T extends S>(e: SS<T>, value: number, type?: ScrollBehavior) {
  if ((e = _(e)).scroll)
    e.scroll({
      top: value,
      behavior: type
    });
  else e.scrollTop = value;
}
export function width<T extends HTMLElement>(e: SS<T>) {
  return _(e).offsetWidth;
}
/**offset height */
export function height<T extends HTMLElement>(e: SS<T>) {
  return _(e).offsetHeight;
}
export const isSelection = <T extends S>(value: any): value is _S<T> => value && 'e' in value;
export function is<T extends S>(e: SS<T>, filter: string): boolean;
export function is<T extends S>(e: SS<T>, filter: EventTarget): boolean;
export function is<T extends S>(e: SS<T>, filter: S): boolean;
export function is<T extends S>(e: SS<T>, filter: string | EventTarget | S) {
  e = _(e);

  return isS(filter) ? e.matches(<string>filter) : _(<SS<T>>filter) == e;
}
export function isCls<T extends S>(e: T, cls: string) {
  return e.classList.contains(cls);
}
export function when<T extends S>(e: T, selector: string, action: (e: T) => T) {
  if (e && is(e, selector))
    action(e);

  return e;
}
export function putIn<T extends S>(e: T, position: InsertPosition, parent: Element | S) {
  (isSelection(parent) ? parent.e : parent)
    .insertAdjacentElement(position, e);

  return e;
}
// #region event

// #endregion