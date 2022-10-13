"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitAsync = exports.emit = exports.off = exports.on = void 0;
const util_js_1 = require("./util.js");
function on(e, event, callback, options) {
    var _a;
    callback && ((_a = e.eh)[event] || (_a[event] = [])).push(options ? (0, util_js_1.assign)(callback, options) : callback);
    return e;
}
exports.on = on;
function off(e, event, callback) {
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
exports.off = off;
function emit(e, event, ...args) {
    if (!e.slip) {
        let stack = e.eh[event];
        if (stack)
            for (let i = 0, l = stack.length; i < l; i++) {
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
exports.emit = emit;
async function emitAsync(stack, args, me) {
    if (stack)
        for (let i = 0, l = stack.length; i < l; i++) {
            let h = stack[i];
            if (h.once)
                stack.splice(i--, 1);
            if (h.delay)
                await new Promise(r => setTimeout(r, h.delay));
            if ((await h.apply(me, args)) === false)
                break;
        }
}
exports.emitAsync = emitAsync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJldmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBK0Q7QUFxQi9ELFNBQWdCLEVBQUUsQ0FBd0IsQ0FBSSxFQUFFLEtBQVUsRUFBRSxRQUFnQyxFQUFFLE9BQWlCOztJQUM3RyxRQUFRLElBQUksT0FBQyxDQUFDLENBQUMsRUFBRSxFQUFDLEtBQUssU0FBTCxLQUFLLElBQU0sRUFBRSxFQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBQSxnQkFBTSxFQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdEYsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBSEQsZ0JBR0M7QUFDRCxTQUFnQixHQUFHLENBQXdCLENBQUksRUFBRSxLQUFVLEVBQUUsUUFBaUM7SUFDNUYsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLEVBQUU7UUFDZixJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDNUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFO29CQUN6QixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDbkIsT0FBTztpQkFDUjthQUNGO1NBQ0Y7O1lBQU0sT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVCLE9BQU8sQ0FBQyxDQUFBO0FBQ1YsQ0FBQztBQVpELGtCQVlDO0FBRUQsU0FBZ0IsSUFBSSxDQUFpRCxDQUFJLEVBQUUsS0FBUSxFQUFFLEdBQUcsSUFBVztJQUNqRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtRQUNYLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsSUFBSSxLQUFLO1lBQ1AsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDNUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUU7b0JBQ3RDLElBQUksQ0FBQyxDQUFDLElBQUk7d0JBQ1IsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDdkIsSUFBSSxDQUFDLENBQUMsS0FBSzt3QkFDVCxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO3lCQUN6QyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEtBQUs7d0JBQ2pDLE1BQU07aUJBQ1Q7YUFDRjtLQUNKO0lBQ0QsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBakJELG9CQWlCQztBQUNNLEtBQUssVUFBVSxTQUFTLENBQUMsS0FBaUMsRUFBRSxJQUFXLEVBQUUsRUFBUTtJQUN0RixJQUFJLEtBQUs7UUFDUCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzVDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFJLENBQUMsQ0FBQyxJQUFJO2dCQUNSLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkIsSUFBSSxDQUFDLENBQUMsS0FBSztnQkFDVCxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUs7Z0JBQ3JDLE1BQU07U0FDVDtBQUNMLENBQUM7QUFYRCw4QkFXQyJ9