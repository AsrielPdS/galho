import { emit, on } from "./event.js";
import { isA, isF, l } from "./util.js";
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
    /**
     * volta a chamar o bind do elemento
     * @param items
     */
    reload(item) {
        // TODO make a reload that not emit events
        let index = this.findIndex(item), t = this[index];
        this.removeAt(index);
        this.put(index, t);
    }
    reloadAll() {
        // TODO make a reload that not emit events
        this.set(this.slice());
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
    src.onupdate(e => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JyYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvcnJheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUd0QyxPQUFPLEVBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFzRTdDLE1BQU0sT0FBTyxDQUFrQixTQUFRLEtBQVE7SUFDN0MsR0FBRyxDQUFDLEtBQWEsRUFBRSxHQUFHLE1BQW9CO1FBQ3hDLElBQUksSUFBSSxDQUFDLEtBQUs7WUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLENBQUMsS0FBSyxTQUFTO29CQUNqQixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDOztvQkFFdEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQU0sQ0FBQzthQUN0QjtRQUNILElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTtZQUNoQixPQUFPO1FBQ1QsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNwRCxJQUFJLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQztRQUN0QixrREFBa0Q7UUFDbEQsS0FBSyxJQUFJLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxFQUFFO1lBQ3pDLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FB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