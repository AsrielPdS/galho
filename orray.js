import { emit, on } from "./event.js";
import { isA, isF, l } from "./util.js";
/**
 * An Array with suport for events, binds, subgroups and tags
 * @template T type of element this array store
 * @template A type of element this array accept
 */
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
        //impurra todos items afrente do start para frente
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
                    //o que estava antes
                    //if (tag.replace) {
                    //  this._tags[key] = null;
                    //  setTag(this,key, this[Math.min(tag.index, this.length - 1)], true);
                    //} else delete this._tags[key];
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
    /**
     * clear array and insert new elements
     * @param values
     */
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
    has(id, fromIndex = 0) {
        for (; fromIndex < this.length; fromIndex++) {
            if (this[fromIndex][this.key] === id)
                return true;
        }
        return false;
    }
    includes(searchElement, fromIndex) {
        let k = this.key;
        if (k) {
            for (fromIndex = 0; fromIndex < this.length; fromIndex++) {
                let j = this[fromIndex];
                if (j === searchElement || j[k] === searchElement)
                    return true;
            }
            return false;
        }
        else
            return super.includes(searchElement, fromIndex);
    }
    addGroup(key) {
        // t.key = key;
        let t = this.g[key] = new Group();
        t.eh = {};
        t.l = this;
        return t;
    }
    /**
     * get a group from id if it not exist create new
     */
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
    find(arg1, arg2) {
        return super.find(isF(arg1) ? arg1 : (v => v === arg1 || v[this.key] == arg1), arg2);
    }
    findIndex(arg1, arg2) {
        return super.findIndex(isF(arg1) ? arg1 : (v => v === arg1 || v[this.key] == arg1), arg2);
    }
    sort(compareFn) {
        //TODO make better algorithm
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
    /**reload tag */
    retag(k, o) {
        let t = this.tags[k];
        emit(this, 'tag:' + k, t?.v);
        emit(this, "update", { tp: "tag", tag: k, newI: t?.i, oldI: o });
    }
    ontag(key, callback) {
        on(this, `tag:${key}`, callback);
        return this;
        //return on(l,<any>(), callback);
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
                    break;
                case 'reload':
                    if (bond.reload)
                        for (let i = 0; i < opts.items.length; i++) {
                            let item = opts.items[i];
                            let v = bond.reload.call(this, item, opts.start + i, s);
                            if (v)
                                s.child(opts.start + i).replace(v);
                        }
                    else {
                        remove(opts.items, opts.start);
                        insert(opts.items, opts.start);
                    }
            }
        };
        this.on(fn);
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
        return this.reloadAt(this.findIndex(item));
    }
    reloadAt(start) {
        return emit(this, "update", { tp: "reload", start, items: [this[start]] });
    }
    reloadAll() {
        return emit(this, "update", { tp: "reload", start: 0, items: this.slice() });
    }
    /**events handlers*/
    eh;
    /**when true this List do not raise events */
    slip;
    tags;
    sorts;
    /**groups */
    g;
    /**no update */
    nu;
    key; //keyof T;
    childKey;
    parse;
    binds;
}
export function copy(src, dest, fill = true, parse = v => v) {
    if (fill)
        dest.set(src.map(parse));
    src.on(e => {
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
/**
 * edit properties of an element of collection
 * @param item
 * @param prop
 * @param value
 */
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
export function orray(array, opts) {
    if (!opts && !isA(array)) {
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
export default orray;
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
        // g.length += items.length;
        emit(g, 'push', items);
        if (!g.nu)
            emit(g, "set", items, indices);
    }
    return indices;
}
export class Group extends Array {
    eh = {};
    slip;
    /**no update */
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
        // for (let i = index; i < this.length - 1; i++)
        //   this[i] = this[i + 1];
        let item = this[index], items = [item];
        this.splice(index, count);
        // delete this[--this.length];
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
    /**on update */
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
//#endregion
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
            //l.tag(group, value);
            l.tag(key, value);
            if (g)
                switch (tp) {
                    case 0 /* Tp.set */:
                        g.set([l[n]]);
                        break;
                    case 1 /* Tp.add */:
                        g.push(l[n]);
                        break;
                    case 2 /* Tp.range */:
                        if (o > n) {
                            let t = o;
                            o = n;
                            n = t;
                        }
                        g.setRange(o, n);
                    case 3 /* Tp.addRange */:
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
    /**select all elements */
    function addAll(l, tag) {
        if (l.length) {
            if (!l.tag(tag))
                l.tag(tag, l[0]);
            l.g[tag] && l.g[tag].pushAll();
        }
        return l;
    }
    range.addAll = addAll;
    /** remove focus */
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
    /**select type */
    range.tp = (control, shift) => control ?
        shift ?
            3 /* Tp.addRange */ :
            1 /* Tp.add */ :
        shift ?
            2 /* Tp.range */ :
            0 /* Tp.set */;
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
