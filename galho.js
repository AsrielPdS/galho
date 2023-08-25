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
            for (let key in a0)
                this.e[key] = a0[key];
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
    #bonds;
    validators;
    constructor(i) {
        this.#bonds = [];
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
                    view.render() : view :
                null);
        }
        return this.$;
    }
    dispose() {
        if (this.$) {
            this.$.remove();
            delete this.$;
        }
        this.#bonds.length = 0;
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
        for (let i = 0, b = this.#bonds; i < b.length; i++) {
            let bond = b[i];
            if (!bond.prop || bond.prop in key)
                bond.handler.call(this, bond.e, key);
        }
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
    bind(element, handler, prop, noInit) {
        if ('render' in element) {
            this.#bonds.push({ e: element, handler: handler, prop: prop });
            if (!noInit)
                handler.call(this, element, this.p);
            return element.render();
        }
        else {
            this.#bonds.push({ e: element, handler: handler, prop: prop });
            if (!noInit)
                handler.call(this, element, this.p);
            return element;
        }
    }
    unbind(s) {
        var i = this.#bonds.findIndex(b => b.e.e == s.e || s == b.e);
        if (i != -1)
            this.#bonds.splice(i, 1);
    }
    toJSON() { }
}
// #endregion
