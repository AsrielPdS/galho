"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emit = exports.off = exports.on = void 0;
function on(e, event, callback, options) {
    if (callback) {
        options && Object.assign(callback, options);
        if (!(event in e.eh))
            e.eh[event] = [];
        e.eh[event].push(callback);
    }
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
function emit(e, event, data) {
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
exports.emit = emit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJldmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFtQkEsU0FBZ0IsRUFBRSxDQUF3QixDQUFJLEVBQUUsS0FBYSxFQUFFLFFBQWdDLEVBQUUsT0FBaUI7SUFDaEgsSUFBSSxRQUFRLEVBQUU7UUFDWixPQUFPLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDbEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFbkIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDNUI7SUFDRCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFURCxnQkFTQztBQUNELFNBQWdCLEdBQUcsQ0FBd0IsQ0FBSSxFQUFFLEtBQWEsRUFBRSxRQUFpQztJQUMvRixJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsRUFBRTtRQUNmLElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM1QyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUU7b0JBQ3pCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNuQixPQUFPO2lCQUNSO2FBQ0Y7U0FDRjs7WUFBTSxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUIsT0FBTyxDQUFDLENBQUE7QUFDVixDQUFDO0FBWkQsa0JBWUM7QUFDRCxTQUFnQixJQUFJLENBQXdCLENBQUksRUFBRSxLQUFhLEVBQUUsSUFBSztJQUNwRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtRQUNYLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsSUFBSSxLQUFLO1lBQ1AsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDNUMsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixJQUFJLE9BQU8sQ0FBQyxJQUFJO29CQUNkLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLElBQUksT0FBTyxDQUFDLEtBQUs7b0JBQ2YsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDekQsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxLQUFLO29CQUN0QyxNQUFNO2FBQ1Q7S0FDSjtBQUNILENBQUM7QUFkRCxvQkFjQyJ9