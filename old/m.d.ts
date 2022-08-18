import { HSElement, M, S } from "../galho.js";

export declare function query<T extends HSElement, K extends keyof HTMLElementTagNameMap>(m: M<T>, filter: K): S<HTMLElementTagNameMap[K]>;
export declare function query<T extends HSElement, U extends HTMLElement | SVGElement = HTMLElement>(m: M<T>, filter: string): S<U>;
export declare function each<T extends HSElement>(m: M<T>, callbackfn: (value: S<T>, index: number) => void): M<T>;
export declare function not<T extends HSElement>(m: M<T>, filter: string): M<T>;
export declare function replace<T extends HSElement>(m: M<T>, fn: (v: T) => any): M<T>;
export declare function push<T extends HSElement>(m: M<T>, ...items: (T | S<any>)[]): number;
export declare function toArray<T extends HSElement>(m: M<T>): S<T>[];
export declare function find<T extends HSElement, S extends T>(m: M<T>, predicate: (value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
export declare function find<T extends HSElement>(m: M<T>, predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): T | undefined;
export declare function find<T extends HSElement>(m: M<T>, filter: string): T;
export declare function fromS<T extends HSElement>(s: S<T>[]): T[];
export declare function empty<T extends HSElement = HTMLElement>(length?: number): any[];
