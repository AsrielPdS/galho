/**event arg */
export interface Arg<T = any> {
  v: T;
  /**prevented */
  p?: boolean
}
export interface Options<DT = any> {
  delay?: number,
  once?: boolean,
  passive?: boolean;
  check?: (data: DT) => boolean;
}
export type EventTargetCallback<T = any, DT = any> = ((this: T, e: DT) => any) & Options<DT>;
export interface EventObject<T extends object = any> {
  /**events handlers*/
  eh: { [P in keyof T]?: EventTargetCallback<this, T[P]>[] };
  /**when true this List do not raise events */
  slip?: boolean;
}
export function on<E extends EventObject>(e: E, event: string, callback: EventTargetCallback<E>, options?: Options): E {
  if (callback) {
    options && Object.assign(callback, options);
    if (!(event in e.eh))
      e.eh[event] = [];

    e.eh[event].push(callback);
  }
  return e;
}
export function off<E extends EventObject>(e: E, event: string, callback?: EventTargetCallback<E>) {
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
export function emit<E extends EventObject>(e: E, event: string, data?) {
  if (!e.slip) {
    let stack = e.eh[event];
    if (stack)
      for (let i = 0, l = stack.length; i < l; i++) {
        let handler = stack[i];
        if (handler.once)
          stack.splice(i--, 1);
        if (handler.delay)
          setTimeout(() => { handler.call(e, data); }, handler.delay);
        else if (handler.call(e, data) === false)
          break;
      }
  }
}