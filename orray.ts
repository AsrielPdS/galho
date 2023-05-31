import { emit, on } from "./event.js";
import type { EventObject, EventTargetCallback, Options } from "./event.js";
import { S } from "./galho.js";
import { arr, isA, isF, l } from "./util.js";
import type { bool, Dic, int, Key, str } from "./util.js";

type CalcOptions = {
  vars: Dic;
};
type Exp = {
  calc(opts: CalcOptions): any;
};

export interface Tag<T = any> {
  /**value */
  v: T;
  /**index */
  i: number;
  replace: bool;
}
export interface ListPlaceEvent<T> {
  old: int;
  new: int;
  item: T;
}
export type UpdateEvent<T> = {
  tp: "push";
  items: T[];
  start: int;
} | {
  tp: "pop";
  items: T[];
  start: int;
} | {
  tp: "place";
} | {
  tp: "edit";
} | {
  tp: "set";
  items: T[];
  removed: T[];
} | {
  tp: "tag";
  tag: str;
  newI: number;
  oldI: number;
};
export interface EventMap<T> extends Dic<any[]> {
  update: [UpdateEvent<T>];
  push: [T[]];
  edit: [EditEvent<T>[]];
  pop: [T[]];
  place: [ListPlaceEvent<T>];
}
export interface ListEditItem<T = Dic> {
  item: Key | T;
  props: Partial<T>;
}
export interface EditEvent<T = Dic> {
  item: T;
  props: Partial<T>;
}
type Parse<T, A> = (this: L<T, A>, value: T | A, index: number) => void | T;
export type IList<T, A = T> = {
  key?: keyof T;
  child?: str;
  parse?: Parse<T, A>;
  /**@deprecated */
  converter?: Parse<T, A>;
  g?: str[];
  sorts?: Exp[];
  clear?: bool;
} | Parse<T, A>;
export class L<T = any, A = T> extends Array<T> implements EventObject<EventMap<T>> {
  put(start: number, ...values: Array<T | A>) {
    if (this.parse)
      for (let i = 0; i < values.length; i++) {
        let t = this.parse(values[i], i + start);
        if (t === undefined)
          values.splice(i--, 1);
        else
          values[i] = t as T;
      }
    if (!values.length)
      return;
    let length = values.length, oldLength = this.length;
    this.length += length;
    //impurra todos items afrente do start para frente
    for (let c = oldLength - 1; c >= start; c--)
      this[c + length] = this[c];
    for (let c = 0; c < length; c++) {
      this[start + c] = values[c] as T;
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
  removeAt(start: number, length = 1) {
    if (length + start > this.length)
      length = this.length - start;
    if (length <= 0)
      return;
    var removed: T[] = Array(length);
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
  push(...values: Array<T | A>) {
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
  unshift(...values: Array<T | A>) {
    this.put(0, ...values);
    return this.length;
  }
  /**
   * clear array and insert new elements
   * @param values
   */
  set(values?: Array<T | A>) {
    if (!this.length && !values?.length)
      return;
    this.nu = true;
    let removed = this.removeAt(0, this.length);
    if (values) {
      if (this.sorts) {
        for (let i = 0; i < this.sorts.length; i++) {
          let sort = this.sorts[i], opt: CalcOptions = { vars: {} };
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
  has(id: Key, fromIndex = 0) {
    for (; fromIndex < this.length; fromIndex++) {
      if (this[fromIndex][this.key] === id)
        return true;
    }
    return false;
  }
  includes(searchElement: Key, fromIndex?: number): boolean
  includes(searchElement: T, fromIndex?: number): boolean
  includes(searchElement: T | Key, fromIndex?: number): boolean {
    let k = this.key;
    if (k) {
      for (fromIndex = 0; fromIndex < this.length; fromIndex++) {
        let j = this[fromIndex];
        if (j === searchElement || j[k] === searchElement)
          return true;
      }
      return false;
    } else return super.includes(searchElement as T, fromIndex)
  }
  addGroup(key: str): Group<T> {
    // t.key = key;
    let t = this.g[key] = new Group();
    t.eh = {};
    t.l = this;
    return t;
  }
  /**
   * get a group from id if it not exist create new
   */
  group(key: str): Group<T> {
    return this.g[key] || this.addGroup(key);
  }

  on(callback: EventTargetCallback<L<T, A>, [UpdateEvent<T>]>): L<T, A>;
  on<K extends keyof EventMap<T>>(event: K, callback: EventTargetCallback<this, EventMap<T>[K]>, options?: Options): this;
  on(event, callback?, options?: Options) {
    if (isF(event)) {
      callback = event;
      event = "update";
    }
    return on(this, event, callback, options);
  }
  onupdate(callback: EventTargetCallback<L<T, A>, [UpdateEvent<T>]>) {
    return on(this, "update", callback) as this;
  }


  find<S extends T>(predicate: (value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
  find(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined;
  find(key: T | Key): T | undefined;
  find(arg1: ((v: T, i: number, o: T[]) => any) | T | Key, arg2?: any) {
    return super.find(isF(arg1) ? arg1 : (v => v === arg1 || v[this.key] == arg1), arg2) as any;
  }
  findIndex(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): number;
  findIndex(key: T | Key): number;
  findIndex(arg1: Key | T | ((v: T, i: number, o: T[]) => any), arg2?: any) {
    return super.findIndex(isF(arg1) ? arg1 : (v => v === arg1 || v[this.key] == arg1), arg2)
  }
  sort(compareFn?: (a: T, b: T) => number) {
    //TODO make better algorithm
    this.set(this.slice().sort(compareFn));
    return this;
  }
  remove(...items: (Key | T)[]) {
    for (let item of items) {
      let i = this.findIndex(item);
      if (i >= 0)
        this.removeAt(i);
    }
    return this;
  }
  place(item: Key | T, newIndex: number) {
    let oldIndex = this.findIndex(item);
    let t = this[oldIndex];
    this.removeAt(oldIndex);
    this.put(newIndex, t);
    emit(this, 'update');
    return this;
  }
  /**get tag */
  tag(key: str): T;
  /**set tag */
  tag(key: str, value: T | Key, replace?: bool): this
  /**remove tag */
  tag(key: str, value: null): this;
  tag(k: str, v?: T | Key, replace?: bool) {
    let i = null, t = this.tags ||= {}, o = t[k], n: Tag<T>;
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
    this.retag(k, o?.i)
    return this;
  }
  /**reload tag */
  retag(k: str, o?: int) {
    let t = this.tags[k];
    emit(this, 'tag:' + k, t?.v);
    emit(this, "update", { tp: "tag", tag: k, newI: t?.i, oldI: o });
  }
  ontag(key: str, callback: (this: L<T, A>, e: T|undefined) => any) {
    on(this, `tag:${key}`, callback);
    return this;
    //return on(l,<any>(), callback);
  }
  unbind(s: S) {
    let b = this.binds;
    if (b) {
      let i = b.findIndex(b => b[0] == s);
      if (i != -1)
        b.splice(i, 1);
    }
    return this;
  }

  bind<TS extends S = S>(s: TS, opts?: LBond<T, A, TS>): TS;
  bind<TS extends S = S>(s: TS, opts?: LBondInsert<T, A, TS>): TS
  bind<TS extends S = S>(s: TS, opts: LBondInsert<T, A, TS> | LBond<T, A, TS> = {}) {
    let bond = isF(opts) ? { insert: opts } : opts;
    let empty = (value: bool) => {
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
    }, fn = (opts: UpdateEvent<T>) => {
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
  reload(item: Key | T) {
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
  eh: {
    [P in keyof EventMap<T>]?: EventTargetCallback<this, EventMap<T>[P]>[];
  };
  /**when true this List do not raise events */
  slip?: bool;
  tags?: Dic<Tag<T>>;
  sorts?: Exp[];
  /**groups */
  g: Dic<Group<T>>;
  /**no update */
  nu?: bool;
  key?: str//keyof T;
  childKey?: str;
  parse?: Parse<T, A>;
  binds?: [s: S, fn: Function][];
}
export type Alias<T = any, A = T> = Array<T | A> | L<T, A>;


export function copy<S, D, A = S>(src: L<S, A>, dest: L<D>, fill = true, parse: (value: S, index: number) => D = v => v as any) {
  if (fill) dest.set(src.map(parse));
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
export function tryPush<T, A = T>(l: L<T, A>, item: T) {
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
export function edit<T, A = T>(l: L<T, A>, item: ListEditItem<T>): L<T, A> {
  let index = l.findIndex(item.item);
  if (index !== -1) {
    item.item = Object.assign(item.item = l[index], item.props);
    emit(l, 'edit', [item]);
    emit(l, 'update', null);
  }
  return l;
}
export function editItems<T, A = T>(l: L<T, A>, ...items: T[]): L<T, A> {
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

export type LBondInsert<T, A = T, TS extends S = S> = (this: L<T, A>, value: T, index?: number, container?: TS) => any;

export interface LBond<T = any, A = T, TS extends S = S> {
  /**
   * metodo que sera chamado no clear, caso n�ot tenha removera um item de cada vez*/
  clear?: false | ((container: S) => void);
  /**inset an element in arbitrary position
   se retornar um valor inserira este elemento n�o posi��o do item adicionado*/
  insert?: LBondInsert<T, A, TS>;
  /**
   * remove an arbitrary element
   * se retornar true remove o item naquela posi��o
   * se n�o definido remove o item automaticamente
   * @param this
   * @param pos
   */
  remove?: (this: L<T, A>, item: T, index: number, container?: TS) => true | void;
  /**
   *
   * @param this
   * @param value
   * @param props
   * @param container
   */
  edit?: (this: L<T, A>, item: T, index: number, props: Partial<T>, container: S) => S | void;
  /**chamado quando tenta se reposicionar um elemento */
  place?: (this: L<T, A>, oldPlace: number, newPlace: number, container: TS) => bool | void;
  /**
   *
   * @param this
   * @param empty
   * @param container
   */
  empty?: (this: L<T, A>, empty: bool, container?: TS) => any;
  /**
   * */
  groups?: Dic<GroupBind<T, TS>> | GroupBind<T, TS>;
  /** */
  tag?: (this: L<T, A>, active: bool, index: number, parent: TS, tag: str, value: T) => void;
}
export function extend<T = any, A = T>(l?: Alias<T, A>, opts?: IList<T, A>) {
  if (!l || !(l as L).eh)
    l = orray(l, opts);
  else if (opts) {
    if (isF(opts))
      opts = { parse: opts };
    if (opts.g)
      for (let g of opts.g)
        if (!(g in (l as L).g))
          (l as L).addGroup(g);
    if (opts.sorts)
      throw "not implemented";
    if (opts.key) {
      if ((l as L).key && (l as L).key != opts.key)
        throw "inconpatible lists";
      (l as L).key = opts.key as str;
    }
  }
  return l as L<T, A>;
}

export function orray<T = any, A = T>(options: IList<T, A>): L<T, A>;
export function orray<T = any, A = T>(array?: L<T, A>, options?: Parse<T, A>): L<T, A>;
export function orray<T = any, A = T>(array?: Array<T | A>, options?: IList<T, A>): L<T, A>;
export function orray<T = any, A = T>(array?: Alias<T, A>, options?: IList<T, A>): L<T, A>;
export function orray<T = any, A = T>(array?: Array<T | A> | IList<T, A> | L<T, A>, opts?: IList<T, A> | Parse<T, A>) {
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
    l.key = opts.key as str;
    l.childKey = opts.child;
    l.sorts = opts.sorts;
    l.parse = opts.parse || opts.converter;
    if (opts.g)
      for (let g of opts.g)
        l.addGroup(g);
  }
  if (array)
    l.put(0, ...(array as any[]));
  return l;
}
export default orray;

//#region groups 

interface GroupEvents<T = any> extends Dic<any[]> {
  push: [T[]];
  remove: [T[]];
  set: GroupSetEvent<T>;
};
export type GroupSetEvent<T> = [add?: T[], addId?: int[], remove?: T[], removeId?: int[]];
function gpush<T>(g: Group<T>, items: (T | Key)[]) {
  let indices: int[] = [], start = g.length;
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
export class Group<T> extends Array<T> implements EventObject<GroupEvents<T>> {
  eh: { [P in keyof GroupEvents<T>]?: EventTargetCallback<this, GroupEvents<T>[P]>[] } = {};
  slip?: boolean;
  /**no update */
  nu?: boolean;
  l: L<T, any>;
  push(...items: (T | Key)[]) {
    gpush(this, items);
    return this.length;
  }
  toggle(item: T) {
    this.includes(item) ? this.remove(item) : gpush(this, [item]);
  }
  pushRange(start: int, end: int) {
    return gpush(this, this.l.slice(start, end));
  }
  pushAll() {
    return gpush(this, this.l.slice());
  }
  remove(...items: T[]): int[] {
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
  removeAt(index: number, count: number = 0) {
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
  removeRange(from: number, to?: number) {
    return this.remove(...this.l.slice(from, to));
  }

  set(add: (T | Key)[]) {
    if (!l(add) && !l(this))
      return;
    this.nu = true;
    let r = this.slice(), remvId = this.clear(), addId = gpush(this, add);
    this.nu = false;
    emit(this, 'set', add, addId, r, remvId);
    return this;
  }
  invert() {
    this.set(this.l.filter(i => !this.includes(i)))
    return this;
  }
  setRange(start: number, end: number) {
    this.set(this.l.slice(start, end));
  }

  indexes() {
    for (var r: number[] = Array(this.length), i = 0; i < this.length; i++)
      r[i] = this.l.indexOf(this[i]);

    return r;
  }
  keyField() {
    for (var key = this.l.key, r: Key[] = [], i = 0; i < this.length; i++)
      r.push(this[i][key]);
    return r;
  }
  /**on update */
  on(callback: EventTargetCallback<Group<T>, GroupSetEvent<T>>) {
    return on(this, "set", callback)
  }
  reload(v: T, i = this.l.indexOf(v)) {
    return emit(this, "set", [v], null, [i]);
  }
  static get [Symbol.species]() { return Array; }
}
export type GroupBind<T, TS extends S> = (this: L<T>, state: boolean, index: number, parent: TS, groupKey: string, item: T) => void;
export function bind<T, TS extends S = S, A = T>(l: L<T, A>, s: TS, groupKey: string, bond: GroupBind<T, TS>): TS {
  let g = l.g[groupKey];
  if (g) {
    let call = (items: T[], indexes: int[], state: bool) => {
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

export namespace range {
  export const enum Tp {
    set = 0,
    add = 1,
    range = 2,
    addRange = add | range
  }
  const clamp = (value: int, min: int, max: int) => value < min ? min : value >= max ? max - 1 : value;
  const tg = (l: L, k: str) => (l.tags ||= {})[k];
  export function pivot<T, A = T>(l: L<T, A>, tag: str) {
    let t = tg(l, tag);
    return t ? t.i : 0;
  }
  export function add<T, A = T>(l: L<T, A>, key: str, value: T | int | str, tp: Tp) {
    let g = l.g[key];
    let
      tag = tg(l, key),
      o = tag ? tag.i : -1,
      n = l.findIndex(value);

    if (o != n) {
      //l.tag(group, value);
      l.tag(key, value);
      if (g)
        switch (tp) {
          case Tp.set:
            g.set([l[n]]);
            break;
          case Tp.add:
            g.push(l[n]);
            break;
          case Tp.range:
            if (o > n) {
              let t = o;
              o = n;
              n = t
            }
            g.setRange(o, n);
          case Tp.addRange:
            if (o > n) {
              let t = o;
              o = n;
              n = t
            }
            g.pushRange(o, n);
            break;
        }
    }
    return l;
  }
  /**select all elements */
  export function addAll<T, A = T>(l: L<T, A>, tag: str) {
    if (l.length) {
      if (!l.tag(tag))
        l.tag(tag, l[0]);

      l.g[tag] && l.g[tag].pushAll();
    }
    return l;
  }
  /** remove focus */
  export function clear<T, A = T>(l: L<T, A>, tag: str) {
    l.tag(tag, null);
    l.g[tag] && l.g[tag].clear();
    return l;
  }
  export function onchange<T, A = T>(l: L<T, A>, tag: str, listener?: (this: L<T, A>, active: T, selected?: Group<T>) => void) {
    let g = l.g[tag];
    g ? g.on(() => {
      let t = tg(l, tag);
      listener.call(l, t && t.v, g)
    }) : l.ontag(tag, listener);
    return l;
  }
  /**select type */
  export const tp = (control: boolean, shift: boolean) =>
    control ?
      shift ?
        Tp.addRange :
        Tp.add :
      shift ?
        Tp.range :
        Tp.set;

  export function move(l: L, tag: str, distance: number, tp: Tp) {
    return add(l, tag, l[clamp(pivot(l, tag) + distance, 0, l.length)], tp);
  }
  export function movePivot(l: L, tag: str, distance: number, revert?: boolean) {
    let ll = l.length;
    if (ll) {
      let i = pivot(l, tag) + distance;
      l.tag(tag, l[revert ?
        i < 0 ? ll - 1 : i >= ll ? 0 : i :
        clamp(i, 0, l.length)]);
    }
    return l;
  }
  export function list<T, A = T>(l: L<T, A>, key: str) {
    let tag: Tag<T>, g = l.g[key];
    return g ? g.slice() : ((tag = tg(l, key)) ? [tag.v] : []);
  }
}