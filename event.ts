import { assign, bool, Dic, float, str } from "./util.js";
/**event arg */
export interface Arg<T = any> {
  v: T;
  /**prevented */
  p?: bool
}
export interface Options<A extends any[] = any[]> {
  delay?: float,
  once?: bool,
  passive?: bool;
  check?: (...args: A) => bool;
}
export type EventTargetCallback<T, A extends any[] = any[]> = ((this: T, ...args: A) => any) & Options<A>;
export interface EventObject<T extends Dic<any[]> = any> {
  /**events handlers*/
  eh: { [K in keyof T]?: EventTargetCallback<this, T[K]>[] };
  /**when true this object do not raise events */
  slip?: bool;
}

export function on<E extends EventObject>(e: E, event: str, callback: EventTargetCallback<E>, options?: Options): E {
  callback && (e.eh[event] ||= []).push(options ? assign(callback, options) : callback);
  return e;
}
export function off<E extends EventObject>(e: E, event: str, callback?: EventTargetCallback<E>) {
  if (event in e.eh)
    if (callback) {
      let stack = e.eh[event];
      for (let i = 0, l = stack.length; i < l; i++) {
        if (stack[i] === callback) {
          stack.splice(i, 1);
          return;
        }
      }
    } else delete e.eh[event];
  return e
}

export function emit<T extends EventObject, K extends keyof T["eh"]>(e: T, event: K, ...args: any[]) {
  if (!e.slip) {
    let stack = e.eh[event];
    if (stack)
      for (let i = 0; i < stack.length; i++) {
        let h = stack[i];
        if (!h.check || h.check.apply(e, args)) {
          if (h.once)
            stack.splice(i--, 1);
          if (h.delay)
            setTimeout(() => h.apply(e, args), h.delay);
          else if (h.apply(e, args) === false)
            break;
        }
      }
  }
  return e;
}
export async function emitAsync(stack: EventTargetCallback<any>[], args: any[], me?: any) {
  if (stack)
    for (let i = 0; i < stack.length; i++) {
      let h = stack[i];
      if (h.once)
        stack.splice(i--, 1);
      if (h.delay)
        await new Promise(r => setTimeout(r, h.delay));
      if ((await h.apply(me, args)) === false)
        break;
    }
}