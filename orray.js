"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.range = exports.bind = exports.Group = exports.orray = exports.extend = exports.editItems = exports.edit = exports.tryPush = exports.copy = exports.L = void 0;
const event_js_1 = require("./event.js");
const util_js_1 = require("./util.js");
class L extends Array {
    put(start, ...values) {
        if (this.parse)
            for (let i = 0; i < values.length; i++) {
                let t = this.parse(values[i], i + start);
                if (t === undefined)
                    values.splice(i--, 1);
                else
                    values[i] = t;
            }
        if (!values.length)
            return;
        let length = values.length, oldLength = this.length;
        this.length += length;
        for (let c = oldLength - 1; c >= start; c--)
            this[c + length] = this[c];
        for (let c = 0; c < length; c++) {
            this[start + c] = values[c];
        }
        if (this.tags) {
            for (let key in this.tags) {
                let tag = this.tags[key];
                if (tag.i >= start)
                    tag.i += length;
            }
        }
        (0, event_js_1.emit)(this, 'push', values);
        if (!this.nu)
            (0, event_js_1.emit)(this, 'update', {
                tp: 'push',
                start: start,
                items: values
            });
        return this;
    }
    removeAt(start, length = 1) {
        if (length + start > this.length)
            length = this.length - start;
        if (length <= 0)
            return;
        var removed = Array(length);
        for (let c = 0; c < length; c++)
            removed[c] = this[start + c];
        for (let c = start + length; c < this.length; c++)
            this[c - length] = this[c];
        this.length -= length;
        for (let key in this.g)
            this.g[key].remove(...Array.from(removed));
        if (this.tags)
            for (let key in this.tags) {
                let tag = this.tags[key];
                if (tag.i >= (start + length))
                    tag.i -= length;
                else if (tag.i >= start) {
                    this.tag(key, tag.replace ?
                        this[Math.min(tag.i, this.length - 1)] :
                        null, tag.replace);
                }
            }
        (0, event_js_1.emit)(this, 'pop', removed);
        if (!this.nu)
            (0, event_js_1.emit)(this, 'update', { tp: 'pop', start, items: removed });
        return removed;
    }
    push(...values) {
        this.put(this.length, ...values);
        return this.length;
    }
    pop() {
        if (this.length)
            return this.removeAt(this.length - 1)[0];
    }
    shift() {
        return this.removeAt(0)[0];
    }
    unshift(...values) {
        this.put(0, ...values);
        return this.length;
    }
    set(values) {
        if (!this.length && !values?.length)
            return;
        this.nu = true;
        let removed = this.removeAt(0, this.length);
        if (values) {
            if (this.sorts) {
                for (let i = 0; i < this.sorts.length; i++) {
                    let sort = this.sorts[i], opt = { vars: {} };
                    values.sort((a, b) => {
                        opt.vars[0] = a;
                        opt.vars.b = b;
                        return sort.calc(opt);
                    });
                }
            }
            this.put(0, ...values);
        }
        this.nu = false;
        (0, event_js_1.emit)(this, 'update', { tp: 'set', items: this, removed });
        return this;
    }
    has(id) {
        for (let i = 0; i < this.length; i++) {
            if (this[i][this.key] === id)
                return true;
        }
        return false;
    }
    addGroup(key) {
        let t = this.g[key] = new Group();
        t.eh = {};
        t.l = this;
        return t;
    }
    group(key) {
        return this.g[key] || this.addGroup(key);
    }
    on(event, callback, options) {
        if ((0, util_js_1.isF)(event)) {
            callback = event;
            event = "update";
        }
        return (0, event_js_1.on)(this, event, callback, options);
    }
    onupdate(callback) {
        return (0, event_js_1.on)(this, "update", callback);
    }
    find(arg1, arg2) {
        return super.find((0, util_js_1.isF)(arg1) ? arg1 : (v => v === arg1 || v[this.key] == arg1), arg2);
    }
    findIndex(arg1, arg2) {
        return super.findIndex((0, util_js_1.isF)(arg1) ? arg1 : (v => v === arg1 || v[this.key] == arg1), arg2);
    }
    sort(compareFn) {
        this.set(this.slice().sort(compareFn));
        return this;
    }
    remove(...items) {
        for (let item of items) {
            let i = this.findIndex(item);
            if (i >= 0)
                this.removeAt(i);
        }
        return this;
    }
    place(item, newIndex) {
        let oldIndex = this.findIndex(item);
        let t = this[oldIndex];
        this.removeAt(oldIndex);
        this.put(newIndex, t);
        (0, event_js_1.emit)(this, 'update');
        return this;
    }
    tag(k, v, replace) {
        let i = null, t = this.tags ||= {}, o = t[k], n;
        switch (v) {
            case undefined:
                return o?.v;
            case null:
                if (!o)
                    return this;
                delete t[k];
                break;
            default:
                i = this.findIndex(v);
                if (i == -1) {
                    console.warn({ message: "value is not in list", value: v });
                    return this;
                }
                if (o && i == o.i)
                    return this;
                v = this[i];
                n = { v, i, replace };
                t[k] = n;
        }
        this.retag(k, o?.i);
        return this;
    }
    retag(k, o) {
        let t = this.tags[k];
        (0, event_js_1.emit)(this, 'tag:' + k, t?.v);
        (0, event_js_1.emit)(this, "update", { tp: "tag", tag: k, newI: t?.i, oldI: o });
    }
    ontag(key, callback) {
        (0, event_js_1.on)(this, `tag:${key}`, callback);
        return this;
    }
    unbind(s) {
        let b = this.binds;
        if (b) {
            let i = b.findIndex(b => b[0] == s);
            if (i != -1)
                b.splice(i, 1);
        }
        return this;
    }
    bind(s, opts = {}) {
        let bond = (0, util_js_1.isF)(opts) ? { insert: opts } : opts;
        let empty = (value) => {
            if (bond.empty) {
                let v = bond.empty.call(this, value);
                if (v)
                    s.set(value);
            }
        }, insert = (items, start) => {
            for (let i = 0; i < items.length; i++) {
                let item = items[i], v = bond.insert ? bond.insert.call(this, item, start + i, s) : item;
                if (v)
                    s.place(start + i, v);
            }
        }, remove = (items, start) => {
            for (let i = 0; i < items.length; i++) {
                if (bond.remove ? bond.remove.call(this, items[i], start + i, s) : true)
                    s.unplace(start + i);
            }
        }, fn = (opts) => {
            switch (opts.tp) {
                case 'push':
                    if (this.length == opts.items.length)
                        empty(false);
                    insert(opts.items, opts.start);
                    break;
                case 'pop':
                    remove(opts.items, opts.start);
                    if (!this.length)
                        empty(true);
                    break;
                case 'tag':
                    if (bond.tag) {
                        if (opts.oldI != null)
                            bond.tag.call(this, s.child(opts.oldI), false, opts.tag, this[opts.oldI], opts.oldI, s);
                        if (opts.newI != null)
                            bond.tag.call(this, s.child(opts.newI), true, opts.tag, this[opts.newI], opts.newI, s);
                    }
                    break;
                case 'set':
                    if (bond.clear === false)
                        remove(opts.removed, 0);
                    else if (bond.clear)
                        bond.clear(s);
                    else
                        s.set();
                    if (opts.items) {
                        if (!opts.removed)
                            empty(false);
                        insert(opts.items, 0);
                    }
                    else
                        empty(true);
            }
        };
        this.onupdate(fn);
        if (bond.groups)
            if ((0, util_js_1.isF)(bond.groups))
                for (let g in this.g)
                    bind(this, s, g, bond.groups);
            else
                for (let g in bond.groups)
                    bind(this, s, g, bond.groups[g]);
        (this.binds ||= []).push([s, fn]);
        insert(this, 0);
        return s;
    }
    reload(item) {
        let index = this.findIndex(item), t = this[index];
        this.removeAt(index);
        this.put(index, t);
    }
    reloadAll() {
        this.set(this.slice());
    }
    eh;
    slip;
    tags;
    sorts;
    g;
    nu;
    key;
    childKey;
    parse;
    binds;
}
exports.L = L;
function copy(src, dest, parse) {
    return src.onupdate(e => {
        switch (e.tp) {
            case 'push':
                dest.put(e.start, ...e.items.map((v, i) => parse(v, e.start + i)));
                break;
            case 'pop':
                dest.removeAt(e.start, e.items.length);
                break;
            case 'set':
                dest.set(e.items.map(parse));
                break;
            case 'edit':
                throw "not implemented";
        }
    });
}
exports.copy = copy;
function tryPush(l, item) {
    let k = item[l.key];
    if (l.find(v => v[l.key] == k))
        edit(l, { item: k, props: item });
    else
        l.push(item);
}
exports.tryPush = tryPush;
function edit(l, item) {
    let index = l.findIndex(item.item);
    if (index !== -1) {
        item.item = Object.assign(item.item = l[index], item.props);
        (0, event_js_1.emit)(l, 'edit', [item]);
        (0, event_js_1.emit)(l, 'update', null);
    }
    return l;
}
exports.edit = edit;
function editItems(l, ...items) {
    let a;
    for (let item of items) {
        let k = item[l.key], index = l.findIndex(v => v[l.key] == k);
        if (index !== -1) {
            l[index] = item;
            a = true;
        }
    }
    if (a) {
        (0, event_js_1.emit)(l, 'edit', null);
        (0, event_js_1.emit)(l, 'update', null);
    }
    return l;
}
exports.editItems = editItems;
function extend(l, opts) {
    if (!l || !l.eh)
        l = (0, exports.orray)(l, opts);
    else if (opts) {
        if ((0, util_js_1.isF)(opts))
            opts = { parse: opts };
        if (opts.g)
            for (let g of opts.g)
                if (!(g in l.g))
                    l.addGroup(g);
        if (opts.sorts)
            throw "not implemented";
        if (opts.key) {
            if (l.key && l.key != opts.key)
                throw "inconpatible lists";
            l.key = opts.key;
        }
    }
    return l;
}
exports.extend = extend;
function _(array, opts) {
    if (array && !('length' in array)) {
        opts = array;
        array = null;
    }
    let l = new L();
    l.g = {};
    l.eh = {};
    if (opts) {
        if ((0, util_js_1.isF)(opts))
            opts = { parse: opts };
        l.key = opts.key;
        l.childKey = opts.child;
        l.sorts = opts.sorts;
        l.parse = opts.parse || opts.converter;
        if (opts.g)
            for (let g of opts.g)
                l.addGroup(g);
    }
    if (array)
        l.put(0, ...array);
    return l;
}
exports.default = _;
exports.orray = _;
;
function gpush(g, items) {
    let indices = [], start = g.length;
    for (let i = 0; i < items.length; i++) {
        let item = items[i], index = g.l.findIndex(item);
        if (index != -1 && !g.includes(item = items[i] = g.l[index])) {
            indices[i] = index;
            g[start + i] = item;
        }
        else
            items.splice(i--, 1);
    }
    if ((0, util_js_1.l)(items)) {
        (0, event_js_1.emit)(g, 'push', items);
        if (!g.nu)
            (0, event_js_1.emit)(g, "set", items, indices);
    }
    return indices;
}
class Group extends Array {
    eh = {};
    slip;
    nu;
    l;
    push(...items) {
        gpush(this, items);
        return this.length;
    }
    pushRange(start, end) {
        return gpush(this, this.l.slice(start, end));
    }
    pushAll() {
        return gpush(this, this.l.slice());
    }
    remove(...items) {
        let indexes = Array(items.length);
        for (let i = 0; i < items.length; i++) {
            let item = items[i], indexInList = this.l.indexOf(item), index = this.indexOf(item);
            if (index != -1) {
                indexes[i] = indexInList;
                for (let i = index; i < this.length - 1; i++)
                    this[i] = this[i + 1];
                delete this[this.length - 1];
            }
            else
                items.splice(i--, 1);
        }
        this.length -= items.length;
        if (items.length) {
            (0, event_js_1.emit)(this, 'remove', items);
            if (!this.nu)
                (0, event_js_1.emit)(this, 'set', null, null, items, indexes);
        }
        return indexes;
    }
    removeAt(index, count = 0) {
        let item = this[index], items = [item];
        this.splice(index, count);
        (0, event_js_1.emit)(this, 'remove', items);
        if (!this.nu)
            (0, event_js_1.emit)(this, 'set', items, [this.indexOf(item)]);
    }
    clear() {
        return this.remove(...this);
    }
    removeRange(from, to) {
        return this.remove(...this.l.slice(from, to));
    }
    set(add) {
        if (!(0, util_js_1.l)(add) && !(0, util_js_1.l)(this))
            return;
        this.nu = true;
        let r = this.slice(), remvId = this.clear(), addId = gpush(this, add);
        this.nu = false;
        (0, event_js_1.emit)(this, 'set', add, addId, r, remvId);
        return this;
    }
    invert() {
        this.set(this.l.filter(i => !this.includes(i)));
        return this;
    }
    setRange(start, end) {
        this.set(this.l.slice(start, end));
    }
    indexes() {
        for (var r = Array(this.length), i = 0; i < this.length; i++)
            r[i] = this.l.indexOf(this[i]);
        return r;
    }
    keyField() {
        for (var key = this.l.key, r = [], i = 0; i < this.length; i++)
            r.push(this[i][key]);
        return r;
    }
    on(callback) {
        return (0, event_js_1.on)(this, "set", callback);
    }
    reload(v, i = this.l.indexOf(v)) {
        return (0, event_js_1.emit)(this, "set", [v], null, [i]);
    }
    static get [Symbol.species]() { return Array; }
}
exports.Group = Group;
function bind(l, s, groupKey, bond) {
    let g = l.g[groupKey];
    if (g) {
        let call = (items, indexes, state) => {
            for (let i = 0; i < items.length; i++) {
                let id = indexes[i];
                bond.call(l, s.child(id), state, items[i], groupKey, id, s);
            }
        };
        g.on((add, addId, rmv, rmvId) => {
            rmv && call(rmv, rmvId, !1);
            add && call(add, addId, !0);
        });
    }
    else
        console.error(`group '${groupKey}' not found`);
    return s;
}
exports.bind = bind;
var range;
(function (range) {
    const clamp = (value, min, max) => value < min ? min : value >= max ? max - 1 : value;
    const tg = (l, k) => (l.tags ||= {})[k];
    function pivot(l, tag) {
        let t = tg(l, tag);
        return t ? t.i : 0;
    }
    range.pivot = pivot;
    function add(l, key, value, tp) {
        let g = l.g[key];
        let tag = tg(l, key), o = tag ? tag.i : -1, n = l.findIndex(value);
        if (o != n) {
            l.tag(key, value);
            if (g)
                switch (tp) {
                    case 0:
                        g.set([l[n]]);
                        break;
                    case 1:
                        g.push(l[n]);
                        break;
                    case 2:
                        if (o > n) {
                            let t = o;
                            o = n;
                            n = t;
                        }
                        g.setRange(o, n);
                    case 3:
                        if (o > n) {
                            let t = o;
                            o = n;
                            n = t;
                        }
                        g.pushRange(o, n);
                        break;
                }
        }
        return l;
    }
    range.add = add;
    function addAll(l, tag) {
        if (l.length) {
            if (!l.tag(tag))
                l.tag(tag, l[0]);
            l.g[tag] && l.g[tag].pushAll();
        }
        return l;
    }
    range.addAll = addAll;
    function clear(l, tag) {
        l.tag(tag);
        l.g[tag] && l.g[tag].clear();
        return l;
    }
    range.clear = clear;
    function onchange(l, tag, listener) {
        let g = l.g[tag];
        g ? g.on(() => {
            let t = tg(l, tag);
            listener.call(l, t && t.v, g);
        }) : l.ontag(tag, listener);
        return l;
    }
    range.onchange = onchange;
    range.tp = (control, shift) => control ?
        shift ?
            3 :
            1 :
        shift ?
            2 :
            0;
    function move(l, tag, distance, tp) {
        return add(l, tag, l[clamp(pivot(l, tag) + distance, 0, l.length)], tp);
    }
    range.move = move;
    function movePivot(l, tag, distance, revert) {
        let ll = l.length;
        if (ll) {
            let i = pivot(l, tag) + distance;
            l.tag(tag, l[revert ?
                i < 0 ? ll - 1 : i >= ll ? 0 : i :
                clamp(i, 0, l.length)]);
        }
        return l;
    }
    range.movePivot = movePivot;
    function list(l, key) {
        let tag, g = l.g[key];
        return g ? g.slice() : ((tag = tg(l, key)) ? [tag.v] : []);
    }
    range.list = list;
})(range = exports.range || (exports.range = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JyYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvcnJheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5Q0FBaUY7QUFFakYsdUNBQTZEO0FBb0U3RCxNQUFhLENBQWtCLFNBQVEsS0FBUTtJQUM3QyxHQUFHLENBQUMsS0FBYSxFQUFFLEdBQUcsTUFBb0I7UUFDeEMsSUFBSSxJQUFJLENBQUMsS0FBSztZQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN0QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxLQUFLLFNBQVM7b0JBQ2pCLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7O29CQUV0QixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBTSxDQUFDO2FBQ3RCO1FBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNO1lBQ2hCLE9BQU87UUFDVCxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3BELElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDO1FBRXRCLEtBQUssSUFBSSxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsRUFBRTtZQUN6QyxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9CLElBQUksQ0FBQyxLQUFLLEdB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