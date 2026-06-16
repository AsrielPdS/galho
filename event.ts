import type { bool, Dic, float, str } from "./util.js";
import { assign } from "./util.js";
/**event arg */
export interface Arg<T = any> {
  v: T;
  /**prevented */
  p?: bool
}
/** Event listening and execution options */
export interface Options<A extends any[] = any[]> {
  delay?: float,
  once?: bool,
  passive?: bool;
  check?: (...args: A) => bool;
}
/** Event target callback definition */
export type EventTargetCallback<T, A extends any[] = any[]> = ((this: T, ...args: A) => any) & Options<A>;
/** Interface for objects that support event registration and emission */
export interface EventObject<T extends Dic<any[]> = any> {
  /**events handlers*/
  eh: { [K in keyof T]?: EventTargetCallback<this, T[K]>[] };
  /**when true this object do not raise events */
  slip?: bool;
}

/**
 * Register an event listener on an EventObject
 * @param e EventObject instance
 * @param event Event name
 * @param callback Callback function
 * @param options Event options
 */
export function on<E extends EventObject>(e: E, event: str, callback: EventTargetCallback<E>, options?: Options): E {
  callback && (e.eh[event] ||= []).push(options ? assign(callback, options) : callback);
  return e;
}
/**
 * Remove an event listener from an EventObject
 * @param e EventObject instance
 * @param event Event name or key
 * @param callback Optional callback to remove. If omitted, removes all callbacks for the event.
 */
export function off<E extends EventObject>(e: E, event: PropertyKey, callback?: EventTargetCallback<E>): E
export function off<E extends EventObject>(e: E, event: any, callback?: EventTargetCallback<E>) {
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

/**
 * Emit an event on an EventObject, triggering all registered callbacks
 * @param e EventObject instance
 * @param event Event key to emit
 * @param args Arguments to pass to callback listeners
 */
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
/**
 * Asynchronously emit event stack callbacks
 * @param stack Event target callbacks stack
 * @param args Arguments to pass to callbacks
 * @param me Event context thisArg value
 */
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