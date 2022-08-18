
// exports.isSelection = isSelection;
// exports.g = g;
// exports.isS = isS;
// exports.isF = isF;
// exports.put = put;
// exports.add = add;
// exports.on = on;

// exports.div = (props, childs) => {
//   return g("div", props, childs);
// }
// exports.delay = 
// exports.one = (e, event, listener) => {
//   if (isS(event))
//     on(e, event, listener, { once: true });
//   else
//     on(e, event, { once: true });
//   return e;
// }
// exports.frag = (e, child) => {
//   let doc = new DocumentFragment();
//   add(doc, child);
//   e.append(doc);
//   return e;
// }
// exports.bind = (e, prop, src, value) => {
//   throw "not implemented";
//   return e;
// }
// exports.focusin = (e, handler) => {
//   let t = _(e);
//   handler && on(t, 'focusin', e => t.contains(e.relatedTarget) || handler.call(t, e));
//   return e;
// }
// exports.focusout = (e, handler) => {
//   let t = _(e);
//   handler && on(t, 'focusout', e => t.contains(e.relatedTarget) || handler.call(t, e));
//   return e;
// }
// exports.index = (e) => {
//   var p = e.parentElement;
//   if (p)
//     return Array.prototype.indexOf.call(p.children, e);
//   return -1;
// }
// exports.indexInDocument = (e) => {
//   let c = 0;
//   while (e && e.parentElement) {
//     c += Array.prototype.indexOf.call(e.children, e);
//     e = e.parentElement;
//   }
//   return c;
// }
// exports.childByCls = (e, cls) => {
//   if (cls)
//     for (let i = 0; i < e.children.length; i++) {
//       let child = e.children.item(i);
//       if (child.classList.contains(cls))
//         return child;
//     }
//   return null;
// }
// exports.count = (e) => {
//   return e.childElementCount;
// }
// exports.fullHtml = (e) => { return _(e).outerHTML; }
// exports.isEmpty = (e) => {
//   return !_(e).hasChildNodes();
// }
// const _ = (e) => isSelection(e) ? e.e : e;
// exports.rect = (e) => {
//   return _(e).getBoundingClientRect();
// }
// exports.focused = (e) => {
//   return document.activeElement == _(e);
// }
// exports.prevE = (e) => {
//   return e.previousElementSibling;
// }
// exports.prev = (e) => {
//   return e.previousSibling;
// }
// exports.parent = (e) => {
//   return e.parentElement;
// }
// exports.text = (e) => {
//   return e.textContent;
// }
// exports.last = (e) => {
//   return e.lastChild;
// }
// exports.contains = (e, child) => {
//   return _(e).contains(isSelection(child) ? child.e : child);
// }
// exports.inDOM = (e) => {
//   return !!e.parentNode;
// }
// exports.tag = (e) => {
//   return e.localName;
// }
// exports.isInput = (e) => {
//   return _(e).matches('input,textarea,select');
// }
// exports.vScroll = (e, value, type) => {
//   if ((e = _(e)).scroll)
//     e.scroll({
//       top: value,
//       behavior: type
//     });
//   else
//     e.scrollTop = value;
// }
// exports.width = (e) => {
//   return _(e).offsetWidth;
// }
// exports.height = (e) => {
//   return _(e).offsetHeight;
// }
// exports.is = (e, filter) => {
//   e = _(e);
//   return isS(filter) ? e.matches(filter) : _(filter) == e;
// }
// exports.isCls = (e, cls) => {
//   return e.classList.contains(cls);
// }
// exports.when = (e, selector, action) => {
//   if (e && is(e, selector))
//     action(e);
//   return e;
// }
// exports.putIn = (e, position, parent) => {
//   (isSelection(parent) ? parent.e : parent)
//     .insertAdjacentElement(position, e);
//   return e;
// }






// export function css<T extends S, P extends keyof Properties>(e: T, property: P): string;
// export function css<T extends S, P extends keyof Properties>(e: T, property: P, value: Properties[P]): T;
// export function css<T extends S>(e: T, styles: Properties): T;
// export function css(e, csss, value?) {
//   let s = e.style;
//   if (isS(csss))
//     if (value === undefined)
//       return s[csss];
//     else
//       s[csss] = value;
//   else
//     for (let css in csss)
//       s[css] = csss[css];
//   return e;
// }
// export function g<K extends keyof HTMLElementTagNameMap>(element: K, props?: string | string[] | 0, childs?: any): HTMLElementTagNameMap[K];
// export function g<T extends HTMLElement = HTMLElement>(element: Create, props?: string | string[] | 0, childs?: any): T;
// export function g(e, props, child) {
//   let result = isS(e) ? document.createElement(e) : e;
//   if (props)
//     if (isS(props))
//       result.setAttribute("class", props);
//     else
//       result.classList.add(...props);
//   if (child != null)
//     add(result, child);
//   return result;
// }
// export function div<K extends keyof HTMLElementTagNameMap>(props?: Partial<HTMLElementTagNameMap[K]> | string | string[] | 0, childs?: any): HTMLDivElement;
// export function div<T extends HTMLElement = HTMLElement>(props?: Partial<T> | string | string[] | 0, childs?: any): HTMLDivElement;

// export function delay<T extends S, E extends Event = Event>(e: SS<T>, action: string, delay: number, fn: EventHandler<T, E>): T;
// export function one<T extends S>(e: T, actions: HTMLEventMap<T>): T;
// export function one<T extends S>(e: T, actions: SVGEventMap<T>): T;
// export function one<T extends S, K extends keyof HTMLElementEventMap>(e: T, action: K, listener: (this: HTMLElement, e: HTMLElementEventMap[K]) => any): T;
// export function one<T extends S, K extends keyof SVGElementEventMap>(e: T, action: K, listener: (this: SVGElement, e: SVGElementEventMap[K]) => any): T;
// export function one<T extends S>(e: T, action: string, listener: (this: Element, e: Event) => any): T;
// export function frag<T extends S>(e: T, child: any): T;
// export function bind<T extends S, M>(e: T, prop: keyof T, src: E<M>, field: keyof M): T;
// export function bind<T extends S, M>(e: T, prop: keyof T, src: E<M>, expression: string): T;
// export function bind<T extends S, U extends S>(e: T, prop: keyof T, src: S, field: keyof U): T;
// export function bind<T extends S>(e: T, prop: keyof T, src: S, expression: string): T;
// export function bind<T extends S, U extends Object>(e: T, prop: keyof T, src: U, field: keyof U): T;
// export function bind<T extends S>(e: T, prop: keyof T, src: Object, expression: string): T;
// export function focusin<T extends S>(e: T, handler?: (e: FocusEvent) => any): T;
// export function focusout<T extends S>(e: SS<T>, handler?: (e: FocusEvent) => any): SS<T>;
// export function index<T extends S>(e: T): number;
// export function indexInDocument(e: Element): number;
// export function childByCls<T extends S>(e: T, cls: string): S;
// export function count<T extends S>(e: T): number;
// export function fullHtml<T extends S>(e: SS<T>): string;
// export function isEmpty<T extends S>(e: SS<T>): boolean;
// export function focused<T extends S>(e: SS<T>): boolean;
// export function prevE<T extends S>(e: T): Element;
// export function prev<T extends Node>(e: T): ChildNode;
// export function parent<T extends Node>(e: T): HTMLElement;
// export function text<T extends Node>(e: T): string;
// export function last<T extends Node>(e: T): ChildNode;
// export function contains<T extends S>(e: SS<T>, child: S | Node): boolean;
// export function inDOM<T extends S>(e: T): boolean;
// export function tag<T extends S>(e: T): string;
// export function isInput<T extends S>(e: SS<T>): boolean;
// export function width<T extends HTMLElement>(e: SS<T>): number;
// export function height<T extends HTMLElement>(e: SS<T>): number;
// export function is<T extends S>(e: SS<T>, filter: string): boolean;
// export function is<T extends S>(e: SS<T>, filter: EventTarget): boolean;
// export function is<T extends S>(e: SS<T>, filter: S): boolean;
// export function isCls<T extends S>(e: T, cls: string): boolean;
// export function when<T extends S>(e: T, selector: string, action: (e: T) => T): T;
// export function putIn<T extends S>(e: T, position: InsertPosition, parent: Element | S): T;