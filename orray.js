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
    if (!isA(array)) {
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