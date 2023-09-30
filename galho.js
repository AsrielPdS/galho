import { emit, off, on } from "./event.js";
import { def, is, isA, isF, isN, isO, isS, isU, l } from "./util.js";
export function g(e, arg0, arg1) {
    if (!e)
        return null;
    let r = isS(e) ?
        new G(document.createElement(e)) :
        'render' in e ?
            e.render() :
            is(e, G) ? e : new G(e);
    if (arg0)
        isS(arg0) ?
            isS(e) ?
                r.attr("class", arg0) :
                r.c(arg0) :
            isA(arg0) || isF(arg0) ?
                r.add(arg0) :
                r.p(arg0);
    arg1 != null && r.add(arg1);
    return r;
}
export default g;
export const m = (...elements) => new M(...elements);
export function div(arg0, arg1) {
    let r = new G(document.createElement("div"));
    if (arg0)
        isS(arg0) ?
            r.attr("class", arg0) :
            isA(arg0) || isF(arg0) ?
                r.add(arg0) :
                r.p(arg0);
    arg1 != null && r.add(arg1);
    return r;
}
const cssPropRgx = /[A-Z]/g;
/**html empty char */
export const empty = '&#8203;';
/**get `document.activeElement` */
export const active = () => g(document.activeElement);
/** @ignore */
export const isE = (v) => v.e && v.e?.nodeType === 1;
/** convert to DOM Element @ignore */
export const asE = (v) => v.e ? v.e : v;
/** check if dom element */
const isD = (v) => v.nodeType === 1;
/**create an element using ns:`http://www.w3.org/1999/xhtml` */
export function html(tag, props, child) {
    return g(document.createElementNS('http://www.w3.org/1999/xhtml', tag), props, child);
}
/**
 * create an svg element
 * @param tag
 * @param attrs
 * @param child
 * @returns
 */
export function svg(tag, attrs, child) {
    var s = new G(document.createElementNS('http://www.w3.org/2000/svg', tag));
    if (attrs)
        if (isS(attrs) || isA(attrs))
            s.c(attrs);
        else
            s.attr(attrs);
    if (child || child === 0)
        s.add(child);
    return s;
}
/**convert html string to svg element */
export function toSVG(text) {
    let parser = new DOMParser(), doc = parser.parseFromString(text, "image/svg+xml");
    return new M(...Array.from(doc.children));
}
export function onfocusout(e, handler) {
    handler && e.on('focusout', ev => e.contains(ev.relatedTarget) || handler.call(e, ev));
    return e;
}
export function wrap(c, p, tag) {
    if (isF(c))
        c = c();
    if (isF((c)?.render))
        c = c.render();
    if (c instanceof Element)
        c = new G(c);
    else if (!(c instanceof G))
        c = g(tag || "div", 0, c);
    p && g(c, p);
    return c;
}
/** select first element that match query same as `document.querySelect` */
export const get = (selectors) => g(document.querySelector(selectors));
/** select all element that match query same as `document.querySelectAll` */
export const getAll = (selectors) => new M(...Array.from(document.querySelectorAll(selectors)));
export function delay(e, event, time, handler) {
    handler = handler.bind(e.e);
    return e.on(event, function (e) {
        var t = `__${event}`;
        clearTimeout(this[t]);
        this[t] = setTimeout(handler, time, e);
    });
}
/** wrap for stopImmediatePropagation and preventDefault on Event */
export function clearEvent(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
}
export function css(props, s, defSub = " ") {
    let subs = [">", " ", ":", "~", "+"];
    let r = "", subSel = "", split;
    function sub(parent, child) {
        return child.split(',')
            .map(s => parent.map(p => {
            if (subs.indexOf(s[0]) != -1)
                return p + s;
            if (s.includes("&"))
                return s.replaceAll("&", p);
            return p + defSub + s;
        }).join(',')).join(',');
    }
    if (!s || s[0] == '@') {
        for (let k in props)
            r += css(props[k], k, defSub);
        return r ? s ? s + "{" + r + "}" : r : '';
    }
    for (let key in props) {
        let val = props[key];
        if (val || val === 0) {
            if (isO(val)) {
                subSel += css(val, sub(split || (split = s.split(',')), key), defSub);
            }
            else
                r += key.replace(cssPropRgx, m => "-" + m.toLowerCase()) + ":" + val + ";";
        }
    }
    return (r ? s + "{" + r + "}" : "") + subSel;
}
// #endregion
// #region ----------main structures ----------------------
/**
 * A Wrapper for an HTML OR SVG Element
 */
export class G {
    e;
    constructor(e) { this.e = e; }
    static empty;
    get active() {
        return this.e.ownerDocument.activeElement == this.e;
    }
    get parent() {
        let e = this.e.parentElement;
        return e && new G(e);
    }
    /**get previus element sibling */
    get prev() {
        let e = this.e.previousElementSibling;
        return e && new G(e);
    }
    /**get next element sibling */
    get next() {
        let e = this.e.nextElementSibling;
        return e && new G(e);
    }
    /**first children element */
    get first() {
        let e = this.e.firstElementChild;
        return e && new G(e);
    }
    /**last children element */
    get last() {
        let e = this.e.lastElementChild;
        return e && new G(e);
    }
    /**get bounding client rect */
    get rect() { return this.e.getBoundingClientRect(); }
    /** @ignore */
    toJSON() { }
    /** check if `this` contains `child` */
    contains(child) {
        return child ? this.e.contains(asE(child)) : false;
    }
    v(v) {
        let e = this.e;
        return isU(v) ? e.value : (e.value = v, this);
    }
    on(e, l, o) {
        if (isS(e)) {
            if (l)
                this.e.addEventListener(e, l, o);
        }
        else if (isA(e)) {
            if (l)
                for (let _ of e)
                    this.e.addEventListener(_, l, o);
        }
        else
            for (let _ in e) {
                let t = e[_];
                if (t)
                    this.e.addEventListener(_, t, l);
            }
        return this;
    }
    one(event, listener) {
        return this.on(event, listener, { once: true });
    }
    emit(event, init) {
        this.e.dispatchEvent(isS(event) ? new Event(event, init) : event);
        return this;
    }
    /**remove event listener */
    off(event, listener) {
        for (let e of isS(event) ? [event] : event)
            this.e.removeEventListener(e, listener);
        return this;
    }
    /** insert adjacent content to `this`
     * @param child can be any valid content
    */
    put(position, child) {
        switch (typeof child) {
            case 'object':
                if (!child)
                    break;
                if (isE(child) ? child = child.e : isD(child))
                    this.e.insertAdjacentElement(position, child);
                else if (isF(child.render))
                    this.put(position, child.render());
                else if (isF(child.then))
                    child.then(c => this.put(position, c));
                else if (position[0] == 'a')
                    for (let i = child.length - 1; i >= 0; i--)
                        this.put(position, child[i]);
                else
                    for (let i = 0, l = child.length; i < l; i++)
                        this.put(position, child[i]);
                break;
            case 'string':
            case 'number':
            case 'bigint':
                this.e.insertAdjacentText(position, child);
                break;
            case 'function':
                this.put(position, child());
                break;
        }
        return this;
    }
    /**insert adjacent after end */
    after(child) {
        return this.put('afterend', child);
    }
    /**insert adjacent before begin */
    before(child) {
        return this.put('beforebegin', child);
    }
    putText(pos, text) {
        this.e.insertAdjacentText(pos, text);
        return this;
    }
    putHTML(pos, html) {
        this.e.insertAdjacentHTML(pos, html);
        return this;
    }
    /**append child */
    add(child) {
        switch (typeof child) {
            case 'object':
                if (!child)
                    break;
                if (isE(child) ? child = child.e : isD(child))
                    this.e.append(child);
                else if (isF(child.render))
                    this.add(child.render());
                else if (isF(child.then))
                    child.then(c => this.add(c));
                else
                    for (let i = 0, l = child.length; i < l; i++)
                        this.add(child[i]);
                break;
            case 'string':
            case 'number':
            case 'bigint':
                this.e.append(child);
                break;
            case 'function':
                this.add(child());
                break;
        }
        return this;
    }
    /**(begin add) add child at begin of element */
    badd(child) { return this.put('afterbegin', child); }
    /**
     * insert content at an specified index
     * @throws `invalid index` if index is outside [0, `children.length`[
     * @param index
     * @param content
     * @returns `this`
     */
    place(index, content) {
        if (!index)
            return this.badd(content);
        var c = this.e.children, temp = c[index < 0 ? c.length + index : index - 1];
        if (!temp)
            throw "invalid index";
        new G(temp).put('afterend', content);
        return this;
    }
    /**remove child at an specified index @returns `this` */
    unplace(index) {
        this.e.children[index].remove();
        return this;
    }
    addHTML(html) {
        return this.putHTML("beforeend", html);
    }
    /**clear content and append new content */
    set(content) {
        this.e.textContent = '';
        this.add(content);
        return this;
    }
    is(filter) {
        return isS(filter) ? this.e.matches(filter) : this.e == asE(filter);
    }
    id(v) {
        if (v)
            this.e.id = v;
        else
            return this.e.id;
        return this;
    }
    text(v) {
        if (isU(v))
            return this.e.textContent;
        this.e.textContent = v;
        return this;
    }
    /** add `this` to another element
     * @param parent element to insert into
     */
    addTo(parent) {
        asE(parent).appendChild(this.e);
        return this;
    }
    ;
    html(value) {
        if (arguments.length) {
            this.e.innerHTML = value;
            return this;
        }
        return this.e.innerHTML;
    }
    replace(child) {
        // if (this.parent) {
        this.put('beforebegin', child);
        this.remove();
        // }
        return this;
    }
    focus(options) {
        this.e.focus(options);
        return this;
    }
    blur() {
        this.e.blur();
        return this;
    }
    child(filter) {
        let childs = this.e.children, child;
        if (isS(filter)) {
            for (let i = 0; i < childs.length; i++) {
                if ((child = childs[i]).matches(filter))
                    return new G(child);
            }
            return null;
        }
        else if (isN(filter))
            return (child = childs[filter < 0 ? l(childs) + filter : filter]) ? new G(child) : null;
    }
    childs(filter, to) {
        let childs = Array.from(this.e.children);
        return new M(...(isS(filter) ? childs.filter(c => c.matches(filter)) :
            isN(filter) ? childs.slice(filter, to) :
                isF(filter) ? childs.filter(c => filter(new G(c))) :
                    childs));
    }
    query(filter) {
        let e = this.e.querySelector(filter);
        return e && new G(e);
    }
    queryAll(filter) {
        return new M(...Array.from(this.e.querySelectorAll(filter)));
    }
    closest(filter) {
        return g(this.e.closest(filter));
    }
    parents(filter) {
        let l = new M(), p = this.e;
        while (p = p.parentElement)
            if (!filter || p.matches(filter))
                l.push(p);
        return l;
    }
    clone(deep) {
        return new G(this.e.cloneNode(deep));
    }
    p(a0, a1) {
        if (isS(a0))
            if (isU(a1))
                return this.e[a0];
            else
                this.e[a0] = a1;
        else
            for (let key in a0) {
                let v = a0[key];
                if (!(a1 || isU(v)))
                    this.e[key] = v;
            }
        return this;
    }
    call(key, ...args) {
        this.e[key](...args);
        return this;
    }
    css(k, v, i) {
        let s = this.e.style;
        if (isS(k))
            if (isU(v))
                return s[k];
            else
                s.setProperty(k.replace(cssPropRgx, m => "-" + m), v, i ? "important" : "");
        else
            for (let _ in k)
                s.setProperty(_.replace(cssPropRgx, m => "-" + m), k[_], v ? "important" : "");
        return this;
    }
    uncss(...p) {
        if (p.length)
            for (let i = 0; i < p.length; i++)
                this.e.style[p[i]] = "";
        else
            this.e.removeAttribute('style');
        return this;
    }
    c(names, set) {
        if (names)
            this.e.classList[set === false ? 'remove' : 'add'].apply(this.e.classList, (isS(names) ? names.trim().split(' ') : names).filter(n => n));
        return this;
    }
    /**toggle class */
    tcls(names) {
        for (let n of names.split(' '))
            if (n)
                this.e.classList.toggle(n);
        return this;
    }
    attr(attr, value) {
        let fn = (k, v) => v === false ?
            this.e.removeAttribute(k) :
            this.e.setAttribute(k, v === true ? '' : v);
        if (isS(attr)) {
            if (isU(value)) {
                return this.e.getAttribute(attr);
            }
            else
                fn(attr, value);
        }
        else
            for (let key in attr)
                fn(key, attr[key]);
        return this;
    }
    d(data) {
        let e = this.e;
        if (isU(data))
            return def(e._d, (e = e.parentElement) && new G(e).d());
        e._d = data;
        return this;
    }
    remove() {
        this.e.remove();
        return this;
    }
}
/**
 * Represent Multiples {@link Element} have part of the functions of  {@link G} but applied to multple element at once
 */
export class M extends Array {
    constructor(...elements) {
        if (isN(elements[0]))
            super(elements[0]);
        else
            super(...elements.map(i => "e" in i ? i.e : i));
    }
    e(i) { return new G(this[i]); }
    on(event, listener, options) {
        for (let i = 0; i < this.length; i++)
            this[i].addEventListener(event, listener, options);
        return this;
    }
    emit(event) {
        for (let i = 0, l = this.length; i < l; i++)
            this[i].dispatchEvent(event);
        return this;
    }
    css(props, important) {
        for (let i = 0; i < this.length; i++) {
            let t = this[i].style;
            for (let key in props)
                t.setProperty(key.replace(cssPropRgx, m => "-" + m), props[key], important ? "important" : "");
        }
        return this;
    }
    uncss(p) {
        for (let i = 0; i < this.length; i++) {
            let t = this[i];
            if (p)
                for (let i = 0; i < p.length; i++)
                    t.style.removeProperty(p[i]);
            else
                t.removeAttribute('style');
        }
        return this;
    }
    c(names, set) {
        isS(names) && (names = names.split(' ').filter(v => v));
        for (let i = 0; i < this.length; i++) {
            this[i].classList[set === false ? 'remove' : 'add'](...names);
        }
        return this;
    }
    p(prop, value) {
        for (let i = 0; i < this.length; i++)
            this[i][prop] = value;
        return this;
    }
    remove() {
        for (let e of this)
            e.remove();
        return this;
    }
    child(filter) {
        let result = new M();
        for (let item of this)
            if (isS(filter))
                for (let i = 0; i < item.children.length; i++) {
                    let child = item.children[i];
                    if (child.matches(filter))
                        result.push(child);
                }
            else
                isN(filter) ?
                    (filter in item.children) && result.push(item.children[filter]) :
                    result.push(...Array.from(item.children));
        return result;
    }
    next() {
        return new M(...this.map(e => e.nextElementSibling));
    }
    prev() {
        return new M(...this.map(e => e.previousElementSibling));
    }
    do(cb) {
        for (let i = 0; i < this.length; i++)
            cb(new G(this[i]), i);
        return this;
    }
    eachS(callbackfn) {
        this.forEach((value, index) => callbackfn(new G(value), index));
        return this;
    }
    push(...items) {
        return super.push(...items.map(i => g(i).e));
    }
}
export class Component {
    /**properties */
    p;
    $;
    // #bonds: { prop, handler(s: One, p: P): void, e: G | Render }[];
    validators;
    constructor(i) {
        // this.#bonds = [];
        this.eh = {};
        this.p = i || {};
    }
    focus() {
        this.$.focus();
        return this;
    }
    render() {
        if (this.$ === void 0) {
            let view = this.view();
            this.$ = (view ?
                'render' in view ?
                    view.render() : isE(view) ?
                    view : new G(view) :
                null);
        }
        return this.$;
    }
    dispose() {
        if (this.$) {
            this.$.remove();
            delete this.$;
        }
        // this.#bonds.length = 0;
    }
    addValidators(field, validator) {
        var _a, _b;
        ((_a = (this.validators || (this.validators = {})))[_b = field] || (_a[_b] = [])).push(validator);
        return this;
    }
    _valid(key, value) {
        let temp = this.validators[key];
        if (temp)
            for (let i = 0; i < temp.length; i++)
                if (!temp[i](value, key))
                    return false;
        return true;
    }
    set(key, value) {
        let dt = this.p;
        if (isO(key)) {
            if (isA(key)) {
                let t = {};
                for (let i = 0; i < key.length; i++) {
                    let t2 = key[i];
                    t[t2] = dt[t2];
                }
                key = t;
            }
            else {
                let t = {};
                for (let k in key) {
                    let val = key[k];
                    if (val !== dt[k] && (!this.validators || this._valid(k, val)))
                        dt[k] = t[k] = val;
                }
                if (!Object.keys(key = t).length)
                    return this;
            }
        }
        else if (!key) {
            key = dt;
        }
        else {
            if (dt[key] === value || (this.validators && !this._valid(key, value)))
                return this;
            dt[key] = value;
            key = { [key]: value };
        }
        // for (let i = 0, b = this.#bonds; i < b.length; i++) {
        //   let bond = b[i];
        //   if (!bond.prop || bond.prop in key)
        //     bond.handler.call(this, bond.e, key);
        // }
        emit(this, 'set', key);
        return this;
    }
    toggle(key) {
        return this.set(key, !this.p[key]);
    }
    clone() {
        return new this.constructor(this.p);
    }
    eh;
    on(event, callback, options) {
        if (isF(event)) {
            callback = event;
            event = "set";
        }
        return on(this, event, callback, options);
    }
    off(event, callback) {
        return off(this, event, callback);
    }
    emit(event, ...args) {
        return emit(this, event, ...args);
    }
    onset(props, callback, options = {}) {
        options.check = isS(props) ?
            e => props in e : e => props.some(prop => prop in e);
        return on(this, "set", callback, options);
    }
    bind(e, handler, p, noInit) {
        let cb = () => handler.call(this, e, this.p);
        if (p)
            cb.check = props => p in props;
        if (!noInit)
            cb();
        this.on(cb);
        return 'render' in e ? e.render() : e;
        // if ('render' in e) {
        //   this.#bonds.push({ e: e, handler: handler, prop: prop });
        //   if (!noInit)
        //     handler.call(this, e, this.p);
        //   return e.render();
        // } else {
        //   this.#bonds.push({ e: e, handler: handler, prop: prop });
        //   if (!noInit)
        //     handler.call(this, e, this.p);
        //   return e;
        // }
    }
    // unbind(s: One) {
    //   var i = this.#bonds.findIndex(b => (b.e as G).e == (s as G).e || (s as Render) == b.e as Render);
    //   if (i != -1)
    //     this.#bonds.splice(i, 1);
    // }
    toJSON() { }
}
// #endregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsaG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnYWxoby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQTZDLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3RGLE9BQU8sRUFBdUIsR0FBRyxFQUFjLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQVksTUFBTSxXQUFXLENBQUM7QUFtRmhILE1BQU0sVUFBVSxDQUFDLENBQUMsQ0FBMEIsRUFBRSxJQUErRCxFQUFFLElBQVU7SUFDdkgsSUFBSSxDQUFDLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUNwQixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQ1osRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixJQUFJLElBQUk7UUFDTixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNULEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNOLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNiLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FB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