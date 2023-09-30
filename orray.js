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
    key;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JyYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvcnJheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFTQSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUd0QyxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsTUFBTSxXQUFXLENBQUM7QUF5RXhDOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sQ0FBMkMsU0FBUSxLQUFRO0lBQ3RFLEdBQUcsQ0FBQyxLQUFhLEVBQUUsR0FBRyxNQUFvQjtRQUN4QyxJQUFJLElBQUksQ0FBQyxLQUFLO1lBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztnQkFDekMsSUFBSSxDQUFDLEtBQUssU0FBUztvQkFDakIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs7b0JBRXRCLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFNLENBQUM7YUFDdEI7UUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU07WUFDaEIsT0FBTztRQUNULElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEQsSUFBSSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUM7UUFDdEIsa0RBQWtEO1FBQ2xELEtBQUssSUFBSSxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsRUFBRTtZQUN6QyxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLElBQUks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