import { assign } from "./util.js";
export function on(e, event, callback, options) {
    callback && (e.eh[event] ||= []).push(options ? assign(callback, options) : callback);
    return e;
}
export function off(e, event, callback) {
    if (event in e.eh)
        if (callback) {
            let stack = e.eh[event];
            for (let i = 0, l = stack.length; i < l; i++) {
                if (stack[i] === callback) {
                    stack.splice(i, 1);
                    return;
                }
            }
        }
        else
            delete e.eh[event];
    return e;
}
export function emit(e, event, ...args) {
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
export async function emitAsync(stack, args, me) {
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
