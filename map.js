"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sort = exports.filter = exports.map = exports.firstKey = exports.first = void 0;
function first(map, fn) {
    for (let [key, val] of map)
        if (!fn || fn(val, key))
            return val;
    return void 0;
}
exports.first = first;
function firstKey(map, fn) {
    for (let [key, val] of map)
        if (!fn || fn(val, key))
            return key;
    return void 0;
}
exports.firstKey = firstKey;
function map(map, fn) {
    let r = [];
    for (let [key, val] of map)
        r.push(fn(val, key));
    return r;
}
exports.map = map;
function filter(map, fn) {
    let r = [];
    for (let [key, val] of map)
        fn(val, key) && r.push(val);
    return r;
}
exports.filter = filter;
function sort(map, fn) {
    return new Map([...map].sort(fn));
}
exports.sort = sort;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLFNBQWdCLEtBQUssQ0FBTyxHQUFjLEVBQUUsRUFBa0M7SUFDNUUsS0FBSyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUc7UUFDeEIsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUNyQixPQUFPLEdBQUcsQ0FBQztJQUNmLE9BQU8sS0FBSyxDQUFDLENBQUM7QUFDaEIsQ0FBQztBQUxELHNCQUtDO0FBQ0QsU0FBZ0IsUUFBUSxDQUFPLEdBQWMsRUFBRSxFQUFrQztJQUMvRSxLQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksR0FBRztRQUN4QixJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQ3JCLE9BQU8sR0FBRyxDQUFDO0lBQ2YsT0FBTyxLQUFLLENBQUMsQ0FBQztBQUNoQixDQUFDO0FBTEQsNEJBS0M7QUFDRCxTQUFnQixHQUFHLENBQVUsR0FBYyxFQUFFLEVBQTRCO0lBQ3ZFLElBQUksQ0FBQyxHQUFRLEVBQUUsQ0FBQztJQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksR0FBRztRQUN4QixDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN2QixPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFMRCxrQkFLQztBQUNELFNBQWdCLE1BQU0sQ0FBd0IsR0FBYyxFQUFFLEVBQWtDO0lBQzlGLElBQUksQ0FBQyxHQUFRLEVBQUUsQ0FBQztJQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksR0FBRztRQUN4QixFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBUSxDQUFDLENBQUM7SUFFbkMsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBTkQsd0JBTUM7QUFDRCxTQUFnQixJQUFJLENBQU8sR0FBYyxFQUFFLEVBQXFDO0lBQzlFLE9BQU8sSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFGRCxvQkFFQyJ9