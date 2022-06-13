import { Properties } from "./css";
import { HSElement, S } from "./galho";
import { isS, put } from "./s";

/**mult selection*/
export type M<T extends HSElement = HSElement> = Array<T>

export function on<T extends HSElement, K extends keyof HTMLElementEventMap>(m: M<T>, action: K, listener: (this: T, e: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions): M<T>;
export function on<T extends HSElement, K extends keyof SVGElementEventMap>(m: M<T>, action: K, listener: (this: T, e: SVGElementEventMap[K]) => any, options?: AddEventListenerOptions): M<T>;
export function on<T extends HSElement>(m: M<T>, event, listener?, options?: AddEventListenerOptions) {
  for (let i = 0; i < m.length; i++)
    m[i].addEventListener(event, listener, options);
  return m;
}
export function emit<T extends HSElement>(m: M<T>, event: Event) {
  for (let i = 0, l = m.length; i < l; i++)
    m[i].dispatchEvent(event);
  return m;
}
export function css<T extends HSElement>(m: M<T>, props: Properties): M<T> {
  for (let css in props)
    for (let i = 0; i < m.length; i++)
      m[i].style[css] = props[css];

  return m;
}
export function cls<T extends HSElement>(m: M<T>, names: string[] | string, set?: boolean): M<T> {
  isS(names) && (names = names.split(' ').filter(v => v));
  for (let i = 0; i < m.length; i++) {
    m[i].classList[set === false ? 'remove' : 'add'](...names);
  }

  return m;
}
export function prop<T extends HSElement, K extends keyof T>(m: M<T>, prop: K, value: T[K]): M<T>;
export function prop<T extends HSElement>(m: M<T>, prop: string, value: any): M<T>;
export function prop<T extends HSElement>(m: M<T>, prop: string, value: any): M<T> {
  for (let i = 0; i < m.length; i++)
    m[i][prop] = value;

  return m;
}
/**
 * Performs the specified action for each element in an array.
 * @param callbackfn  A function that accepts up to two arguments. forEach calls the callbackfn function one time for each element in the array.
 */
export function query<T extends HSElement, K extends keyof HTMLElementTagNameMap>(m: M<T>, filter: K): S<HTMLElementTagNameMap[K]>;
export function query<T extends HSElement, U extends HTMLElement | SVGElement = HTMLElement>(m: M<T>, filter: string): S<U>;
export function query<T extends HSElement, U extends HTMLElement | SVGElement = HTMLElement>(m: M<T>, filter: string) {
  for (let i = 0, l = m.length; i < l; i++) {
    let t = m[i];;
    if (!t.matches(filter))
      t = t.querySelector(filter)
    if (t)
      return new S(t);
  }
  return S.empty;
}

export function each<T extends HSElement>(m: M<T>, callbackfn: (value: S<T>, index: number) => void) {
  m.forEach((value, index) => callbackfn(new S(value), index));
  return m;
}
export function not<T extends HSElement>(m: M<T>, filter: string) {
  return <M<T>>m.filter((e) => !e.matches(filter));
}
export function remove<T extends HSElement>(m: M<T>,) {
  for (let e of m)
    e.remove();
  return m;
}
export function replace<T extends HSElement>(m: M<T>, fn: (v: T) => any) {
  for (let e of m){
    put(e, 'beforebegin', fn(e));
    e.remove();
  }
  return m;
}
export function child<T extends HSElement>(m: M<T>,): M;
export function child<T extends HSElement>(m: M<T>, filter?: string): M;
export function child<T extends HSElement>(m: M<T>, index?: number): M;
export function child<T extends HSElement>(m: M<T>, filter?: string | number) {
  let result: Element[];
  if (isS(filter)) {
    result = [];
    for (let i = 0; i < m.length; i++) {
      let childs = m[i].children;
      for (let j = 0; j < childs.length; j++) {
        let child = childs[j];
        if (child.matches(filter))
          result.push(child);
      }
    }
  } else if (typeof filter == "number") {
    result = Array(filter);
    for (let i = 0; i < m.length; i++)
      result[i] = m[i].children[filter];
  } else {
    result = [];
    for (let i = 0; i < m.length; i++)
      result.push.apply(result, m[i].children);
  }

  return result;
}
export function push<T extends HSElement>(m: M<T>, ...items: (T | S<any>)[]): number {
  for (let i = 0; i < items.length; i++) {
    let t = items[i];
    if (t instanceof S)
      items[i] = t.e;
  }
  return m.push(...<T[]>items);
}
export function toArray<T extends HSElement>(m: M<T>,) {
  return m.map(t => new S(t));
}
export function find<T extends HSElement, S extends T>(m: M<T>, predicate: (value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
export function find<T extends HSElement>(m: M<T>, predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): T | undefined;
export function find<T extends HSElement>(m: M<T>, filter: string): T;
export function find<T extends HSElement>(m: M<T>, filter: string | ((value: T, index: number, obj: T[]) => boolean), thisArgs?) {
  if (isS(filter)) {
    for (var i = 0, e = m[0]; i < m.length; e = m[++i])
      if (e.matches(filter))
        return e;
  } else return m.find(filter, thisArgs);
}

export function fromS<T extends HSElement>(s: S<T>[]) {
  return s.filter(s => s).map(s => s.e);
}
export function empty<T extends HSElement = HTMLElement>(length: number = 0) {
  return new Array(length);
}