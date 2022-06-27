import { EventObject, Options } from "handler";
import type { Properties } from "./css";
interface Dic<T = any> {
  [key: string]: T;
}
export default function create<K extends keyof HTMLElementTagNameMap>(element: K, props?: Partial<HTMLElementTagNameMap[K]> | string | string[] | 0, childs?: any): S<HTMLElementTagNameMap[K]>;
export default function create<T extends HTMLElement = HTMLElement>(element: Create, props?: Partial<T> | string | string[] | 0, childs?: any): S<T>;
export declare const g: typeof create;
export declare const div: (props?: 0 | string[] | string | Partial<HTMLDivElement>, child?: any) => S<HTMLDivElement>;
export declare const active: () => S<HTMLElement>;
export declare function clone<T extends Object>(obj: T): T;
export declare type EventTargetCallback<T, E = any> = ((this: T, e: E) => any) & {
  options?: Options;
};
declare type EEv<Ev, I> = Ev & {
  set: Partial<I>;
};
export declare abstract class E<I = {}, Events extends Dic = {}> implements Render, EventObject<Events> {
  i: I;
  $: S;
  private bonds;
  validators: Dic<Array<(value: any, field: any) => boolean | void>>;
  constructor(i?: I);
  protected abstract view(): One<HSElement>;
  focus(): this;
  render(): S;
  dispose(): void;
  reRender(): S;
  removeKey(key: string | string[]): this;
  addValidators<K extends keyof I>(field: K, validator: (value: I[K], field: K) => boolean | void): this;
  private _valid;
  set(): this;
  set<K extends keyof I>(key: K[]): this;
  set<K extends keyof I>(key: K, value: Pick<I, K>): this;
  set<K extends keyof I>(key: K, value: I[K]): this;
  set(values: Partial<I>): this;
  toggle(key: keyof I): void;
  clone(): this;
  readonly eh: {
    [P in keyof Events]?: EventTargetCallback<this, Events[P]>[];
  };
  on<K extends keyof EEv<Events, I>>(event: K, callback: EventTargetCallback<this, Events[K]>, options?: Options): this;
  on(callback: EventTargetCallback<this, Partial<I>>, options?: Options): this;
  off<K extends keyof Events>(event: K, callback?: EventTargetCallback<this, Events[K]>): this;
  emit<K extends keyof Events>(event: K, data?: Events[K]): this;
  onset<K extends keyof I>(props: K[] | K, callback: EventTargetCallback<this, Partial<I>>, options?: Options): this;
  bind<K extends keyof I, R extends Render>(e: R, handler: BindHandler<this, I, R>, prop?: K, noInit?: boolean): S;
  bind<K extends keyof I, T extends HSElement>(s: S<T>, handler: BindHandler<this, I, S<T>>, prop?: K, noInit?: boolean): S<T>;
  inputBind<K extends keyof I>(element: E<any, {
    input: unknown;
  }>, src: K, target?: string): S;
  inputBind<Inp extends InputElement>(input: S<Inp>, prop: keyof I, fieldSet?: keyof Inp, fieldGet?: keyof Inp): S;
  unbind(s: One): void;
  private toJSON;
}
export declare class S<T extends HSElement = HTMLElement> {
  readonly e?: T;
  constructor();
  constructor(e: T);
  constructor(e: EventTarget);
  toJSON(): void;
  get valid(): boolean;
  contains(child: S | Node): boolean;
  on(actions: HTMLEventMap<T>, options?: AddEventListenerOptions): this;
  on(actions: SVGEventMap<T>, options?: AddEventListenerOptions): this;
  on<K extends keyof HTMLElementEventMap>(action: K, listener: (this: T, e: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions): this;
  on<K extends keyof SVGElementEventMap>(action: K, listener: (this: T, e: SVGElementEventMap[K]) => any, options?: AddEventListenerOptions): this;
  on<TT extends Element = Element, E extends Event = Event>(action: string, fn: EventHandler<TT, E>, options?: AddEventListenerOptions): this;
  on<K extends keyof HTMLElementEventMap>(action: K[], listener: (this: T, e: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions): this;
  one<K extends keyof HTMLElementEventMap>(event: K, listener: (this: HTMLElement, e: HTMLElementEventMap[K]) => any): this;
  one<K extends keyof SVGElementEventMap>(event: K, listener: (this: SVGElement, e: SVGElementEventMap[K]) => any): this;
  one(event: string, listener: (this: Element, e: Event) => any): this;
  emit(name: string, event?: EventInit): this;
  emit(event: Event): this;
  click(): this;
  off<K extends keyof HTMLElementEventMap>(event: K | K[], listener: EventListener): this;
  try<T>(action: (e: this) => T): this;
  static empty: S<any>;
  put(position: InsertPosition, child: any): this;
  putAfter(child: any): this;
  putBefore(child: any): this;
  putText(pos: InsertPosition, text: string | number): this;
  putHTML(pos: InsertPosition, html: string): this;
  add(child: any): this;
  prepend(child: any): this;
  place(index: number, child: any): this;
  unplace(index: number): void;
  addHTML(html: string): this;
  set(child?: any): this;

  id(): string;
  id(value: string | number): this;

  text(): string;
  text(text: number | string): this;

  addTo(parent: Element | S): this;

  html(): string;
  html(content: string): this;

  replace(child: any): this;

  focus(options?: FocusOptions): this;

  blur(): this;

  child<C extends HSElement = HSElement>(index: number): S<C>;
  child<K extends keyof HTMLElementTagNameMap>(filter: K): S<HTMLElementTagNameMap[K]>;
  child(filter: string): S;

  first(): S<HTMLElement>;

  last(): S<HTMLElement>;

  childs(): M;
  childs<T extends HSElement = HSElement>(from: number, to?: number): M<T>;
  childs<K extends keyof HTMLElementTagNameMap>(filter: K): M<HTMLElementTagNameMap[K]>;
  childs<T extends HSElement = HTMLElement>(filter: string): M<T>;
  childs<T extends HSElement = HTMLElement>(filter: (child: S) => boolean): M<T>;

  query<K extends keyof HTMLElementTagNameMap>(filter: K): S<HTMLElementTagNameMap[K]>;
  query<U extends HTMLElement | SVGElement = HTMLElement>(filter: string): S<U>;

  queryAll<K extends keyof HTMLElementTagNameMap>(filter: K): M<HTMLElementTagNameMap[K]>;
  queryAll<U extends HTMLElement | SVGElement = HTMLElement>(filter: string): M<U>;

  parent(): S<HTMLElement>;
  closest(filter: string): S<HTMLElement>;
  parents(filter: string): M;

  clone(): S;
  clone(deep: boolean): S;

  prev(): S<HTMLElement>;
  next(): S<HTMLElement>;

  prop<K extends keyof T>(key: K): T[K];
  prop<T = any>(key: string): T;
  prop<K extends keyof T>(key: K, value: T[K]): this;
  prop(key: string, value: any): this;

  props(props: Partial<T>): this;
  props(props: Dic): this;

  call<K extends keyof T>(key: K, ...params: any[]): any;

  css<T extends keyof Properties>(property: T): string;
  css<T extends keyof Properties>(property: T, value: Properties[T]): this;
  css(styles: Properties): this;

  uncss(): any;
  uncss(properties: Array<keyof Properties>): any;

  uncls(): this;
  cls(classes: string | string[]): this;
  cls(names: string | string[], set: boolean): this;
  /**toggle class */
  tcls(names: string): this;
  hasClass(name: string): boolean;
  attr(attr: string, value: string | boolean | number): this;
  attr(attr: string): string;
  attrs(attrs: Dic<string | boolean | number>): this;
  d(data: any): this;
  d<T = unknown>(): T;
  remove(): this;
}
export declare class M<T extends HSElement = HSElement> extends Array<T>{
  constructor(...elements: (S<T> | T)[]);
  on<K extends keyof HTMLElementEventMap>(action: K, listener: (this: T, e: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions): M<T>;
  on<K extends keyof SVGElementEventMap>(action: K, listener: (this: T, e: SVGElementEventMap[K]) => any, options?: AddEventListenerOptions): M<T>;
  emit(event: Event): M<T>;
  css(props: Properties): M<T>;
  cls(names: string[] | string, set?: boolean): M<T>;
  prop<K extends keyof T>(prop: K, value: T[K]): M<T>;
  prop(prop: string, value: any): M<T>;
  remove(): M<T>;
  child(): M;
  child(filter?: string): M;
  child(index?: number): M;
  do(cb: (v: S<T>, index: number) => any): this;
}
export declare function html<T extends keyof HTMLElementTagNameMap>(tag: T, props?: string | Partial<SVGElement>, child?: any): S;
export declare function xml<T extends keyof HTMLElementTagNameMap>(tag: T, props?: string | Partial<SVGElement>, child?: any): S;
export declare function svg<T extends keyof SVGElementTagNameMap>(tag: T, attrs?: string | Dic<string | number> | 0 | string | string[], child?: any): S<SVGElementTagNameMap[T]>;
export declare function toSVG<T extends SVGElement = SVGElement>(text: string): S<T>;
export declare function wrap<T extends HTMLElement = HTMLElement>(child: any, props?: string | 0 | string[] | Partial<T>, tag?: keyof HTMLElementTagNameMap): S<T>;
export declare function get(): S;
export declare function get<T extends HTMLElement | SVGElement = HTMLElement>(query: T | S | E<any, any>): S<T>;
export declare function get<T extends HTMLElement | SVGElement = HTMLElement>(query: string, context?: S | Element): S<T>;
export declare function getAll(input?: string, context?: Element): M;
declare class CL extends Array<string> {
  push(...cls: Array<string | string[]>): number;
  tryAdd(cls: string): this;
}
export declare function cl(...cls: Array<string | string[]>): CL;
export interface Render<T extends HSElement = HSElement> {
  render(): S<T>;
}
export interface MRender {
  render();
}
export declare const id: () => string;
export declare type EventHandler<T, E> = (this: T, e: E) => any;
export declare type HSElement = HTMLElement | SVGElement;
export declare type ANYElement = HTMLElement | SVGElement;
export declare type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
export declare type One<T extends HSElement = HTMLElement> = S<T> | Render<T>;
export declare type Create = keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | Element | S | Render;
export declare type BindHandler<T, M, B> = (this: E<M>, s: B, model: M) => void;
export interface Bind<T, M, K extends keyof M> {
  e: S | Render;
  prop: K;
  handler: BindHandler<T, M, E<any> | S>;
}
export declare type EventMap<T> = HTMLEventMap<T> | SVGEventMap<T> | {
  [key: string]: (this: Element, e: Event) => any;
};
export declare type HTMLEventMap<T> = {
  [K in keyof HTMLElementEventMap]?: (this: T, e: HTMLElementEventMap[K]) => any;
};
export declare type SVGEventMap<T> = {
  [K in keyof SVGElementEventMap]?: (this: T, e: SVGElementEventMap[K]) => any;
};
export declare function clearEvent(e: Event): void;
export type Lazy<T> = (() => T) | T

export type Tr = S<HTMLTableRowElement>;
export type Input = S<HTMLInputElement>;