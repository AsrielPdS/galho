import { emit, on } from "./event.js";
import { isF, l } from "./util.js";
export class L extends Array {
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
        emit(this, 'push', values);
        if (!this.nu)
            emit(this, 'update', {
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
        emit(this, 'pop', removed);
        if (!this.nu)
            emit(this, 'update', { tp: 'pop', start, items: removed });
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
        emit(this, 'update', { tp: 'set', items: this, removed });
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
        if (isF(event)) {
            callback = event;
            event = "update";
        }
        return on(this, event, callback, options);
    }
    onupdate(callback) {
        return on(this, "update", callback);
    }
    find(arg1, arg2) {
        return super.find(isF(arg1) ? arg1 : (v => v === arg1 || v[this.key] == arg1), arg2);
    }
    findIndex(arg1, arg2) {
        return super.findIndex(isF(arg1) ? arg1 : (v => v === arg1 || v[this.key] == arg1), arg2);
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
        emit(this, 'update');
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
        emit(this, 'tag:' + k, t?.v);
        emit(this, "update", { tp: "tag", tag: k, newI: t?.i, oldI: o });
    }
    ontag(key, callback) {
        on(this, `tag:${key}`, callback);
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
        let bond = isF(opts) ? { insert: opts } : opts;
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
                            bond.tag.call(this, false, opts.oldI, s, opts.tag, this[opts.oldI]);
                        if (opts.newI != null)
                            bond.tag.call(this, true, opts.newI, s, opts.tag, this[opts.newI]);
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
            if (isF(bond.groups))
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
export function copy(src, dest, parse) {
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
export function tryPush(l, item) {
    let k = item[l.key];
    if (l.find(v => v[l.key] == k))
        edit(l, { item: k, props: item });
    else
        l.push(item);
}
export function edit(l, item) {
    let index = l.findIndex(item.item);
    if (index !== -1) {
        item.item = Object.assign(item.item = l[index], item.props);
        emit(l, 'edit', [item]);
        emit(l, 'update', null);
    }
    return l;
}
export function editItems(l, ...items) {
    let a;
    for (let item of items) {
        let k = item[l.key], index = l.findIndex(v => v[l.key] == k);
        if (index !== -1) {
            l[index] = item;
            a = true;
        }
    }
    if (a) {
        emit(l, 'edit', null);
        emit(l, 'update', null);
    }
    return l;
}
export function extend(l, opts) {
    if (!l || !l.eh)
        l = orray(l, opts);
    else if (opts) {
        if (isF(opts))
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
export default function _(array, opts) {
    if (array && !('length' in array)) {
        opts = array;
        array = null;
    }
    let l = new L();
    l.g = {};
    l.eh = {};
    if (opts) {
        if (isF(opts))
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
export const orray = _;
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
    if (l(items)) {
        emit(g, 'push', items);
        if (!g.nu)
            emit(g, "set", items, indices);
    }
    return indices;
}
export class Group extends Array {
    eh = {};
    slip;
    nu;
    l;
    push(...items) {
        gpush(this, items);
        return this.length;
    }
    toggle(item) {
        this.includes(item) ? this.remove(item) : gpush(this, [item]);
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
            emit(this, 'remove', items);
            if (!this.nu)
                emit(this, 'set', null, null, items, indexes);
        }
        return indexes;
    }
    removeAt(index, count = 0) {
        let item = this[index], items = [item];
        this.splice(index, count);
        emit(this, 'remove', items);
        if (!this.nu)
            emit(this, 'set', items, [this.indexOf(item)]);
    }
    clear() {
        return this.remove(...this);
    }
    removeRange(from, to) {
        return this.remove(...this.l.slice(from, to));
    }
    set(add) {
        if (!l(add) && !l(this))
            return;
        this.nu = true;
        let r = this.slice(), remvId = this.clear(), addId = gpush(this, add);
        this.nu = false;
        emit(this, 'set', add, addId, r, remvId);
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
        return on(this, "set", callback);
    }
    reload(v, i = this.l.indexOf(v)) {
        return emit(this, "set", [v], null, [i]);
    }
    static get [Symbol.species]() { return Array; }
}
export function bind(l, s, groupKey, bond) {
    let g = l.g[groupKey];
    if (g) {
        let call = (items, indexes, state) => {
            for (let i = 0; i < items.length; i++) {
                let index = indexes[i];
                bond.call(l, state, index, s, groupKey, items[i]);
            }
        };
        g.on((add, addId, rmv, rmvId) => {
            rmv && call(rmv, rmvId, false);
            add && call(add, addId, true);
        });
    }
    else
        console.error(`group '${groupKey}' not found`);
    return s;
}
export var range;
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
        l.tag(tag, null);
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
})(range || (range = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JyYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvcnJheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQTZDLElBQUksRUFBRSxFQUFFLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFakYsT0FBTyxFQUFrQixHQUFHLEVBQU8sQ0FBQyxFQUFPLE1BQU0sV0FBVyxDQUFDO0FBb0U3RCxNQUFNLE9BQU8sQ0FBa0IsU0FBUSxLQUFRO0lBQzdDLEdBQUcsQ0FBQyxLQUFhLEVBQUUsR0FBRyxNQUFvQjtRQUN4QyxJQUFJLElBQUksQ0FBQyxLQUFLO1lBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztnQkFDekMsSUFBSSxDQUFDLEtBQUssU0FBUztvQkFDakIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs7b0JBRXRCLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFNLENBQUM7YUFDdEI7UUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU07WUFDaEIsT0FBTztRQUNULElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEQsSUFBSSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUM7UUFFdEIsS0FBSyxJQUFJLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxFQUFFO1lBQ3pDLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLEtBQUssSUFB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