import { emit, off, on } from "./event.js";
import { is } from "./util.js";
import { isA, isN, isO, isF, def, isS, isU, l, } from "./util.js";
export function g(e, arg0, arg1) {
    if (!e)
        return null;
    let r = isS(e) ?
        new S(document.createElement(e)) :
        'render' in e ?
            e.render() :
            is(e, S) ? e : new S(e);
    if (arg0)
        isS(arg0) ?
            isS(e) ?
                r.attr("class", arg0) :
                r.c(arg0) :
            isA(arg0) ?
                r.c(arg0) :
                r.p(arg0);
    arg1 != null && r.add(arg1);
    return r;
}
export default g;
export const m = (...elements) => new M(...elements);
// #endregion
// #region --------- utility -----------------------
let _id = 0;
export const id = () => 'i' + (_id++);
/** create div element
* @param props if is string or string array will the class if not will be set as props of created element
* @param childs elements, string, number or anything that can be append to an element */
export function div(props, childs) {
    let r = new S(document.createElement("div"));
    if (props)
        isS(props) ?
            r.attr("class", props) :
            isA(props) ?
                r.c(props) :
                r.p(props);
    childs != null && r.add(childs);
    return r;
}
/**html empty char */
export const empty = '&#8203;';
/**get dom active element */
export const active = () => g(document.activeElement);
export const isE = (v) => v.e && v.e?.nodeType === 1;
/** convert @type {S<any>} to dom element */
export const asE = (v) => v.e ? v.e : v;
/** check if dom element */
const isD = (v) => v.nodeType === 1;
/**create an html element */
export function html(tag, props, child) {
    return g(document.createElementNS('http://www.w3.org/1999/xhtml', tag), props, child);
}
/**create an svg element */
export function svg(tag, attrs, child) {
    var s = new S(document.createElementNS('http://www.w3.org/2000/svg', tag));
    if (attrs)
        if (isS(attrs) || isA(attrs))
            s.c(attrs);
        else
            s.attrs(attrs);
    if (child || child === 0)
        s.add(child);
    return s;
}
/**convert html string to svg element */
export function toSVG(text) {
    let parser = new DOMParser(), doc = parser.parseFromString(text, "image/svg+xml");
    return new S(doc.firstChild);
}
export function onfocusout(e, handler) {
    handler && e.on('focusout', ev => e.contains(ev.relatedTarget) || handler.call(e, ev));
    return e;
}
export function wrap(child, props, tag) {
    if (isF(child))
        child = child();
    if (isF(child?.render))
        child = child.render();
    if (child instanceof Element)
        child = new S(child);
    else if (!(child instanceof S))
        child = g(tag || "div", 0, child);
    props && g(child, props);
    return child;
}
/** select first element that match query same as `document.querySelect` */
export function get(selectors, ctx) {
    let t = (ctx ? asE(ctx) : document).querySelector(selectors);
    return t && g(t);
}
/** select all element that match query same as `document.querySelectAll` */
export function getAll(selectors, context) {
    return new M(...Array.from((context ? asE(context) : document).querySelectorAll(selectors)));
}
export function delay(e, event, time, handler) {
    handler = handler.bind(e.e);
    return e.on(event, function (e) {
        var t = `_${event}_timer`;
        clearTimeout(this[t]);
        this[t] = setTimeout(handler, time, e);
    });
}
/** stopImmediatePropagation and preventDefault from Event */
export function clearEvent(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
}
const cssPropRgx = /[A-Z]/g;
export function css(props, s, defSub = " ") {
    let subs = [">", " ", ":", "~", "+"], r = "", subSel = "", split;
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
export const rgba = (r, g, b, a) => `rgba(${r},${g},${b},${a})`;
export const rgb = (r, g, b) => `rgb(${r},${g},${b})`;
// #endregion
// #region ----------main structures ----------------------
export class S {
    e;
    constructor(e) { this.e = e; }
    static empty;
    get active() {
        return this.e.ownerDocument.activeElement == this.e;
    }
    get parent() {
        let e = this.e.parentElement;
        return e && new S(e);
    }
    get prev() {
        let e = this.e.previousElementSibling;
        return e && new S(e);
    }
    get next() {
        let e = this.e.nextElementSibling;
        return e && new S(e);
    }
    /**first child */
    get first() {
        let e = this.e.firstElementChild;
        return e && new S(e);
    }
    /**last child */
    get last() {
        let e = this.e.lastElementChild;
        return e && new S(e);
    }
    /**get bounding client rect */
    get rect() { return this.e.getBoundingClientRect(); }
    toJSON() { }
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
    off(event, listener) {
        for (let e of isS(event) ? [event] : event)
            this.e.removeEventListener(e, listener);
        return this;
    }
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
    /**@deprecated */
    putAfter(child) {
        return this.put('afterend', child);
    }
    /**insert adjacent before begin */
    before(child) {
        return this.put('beforebegin', child);
    }
    /**@deprecated */
    putBefore(child) {
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
    /**@deprecated */
    prepend(child) { return this.badd(child); }
    place(index, child) {
        if (!index)
            return this.badd(child);
        var c = this.e.children, temp = c[index < 0 ? c.length + index : index - 1];
        if (!temp)
            throw "out of flow";
        new S(temp).put('afterend', child);
        return this;
    }
    unplace(index) {
        this.e.children[index].remove();
    }
    addHTML(html) {
        return this.putHTML("beforeend", html);
    }
    set(child) {
        this.e.textContent = '';
        this.add(child);
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
        this.put('beforebegin', child);
        this.remove();
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
                    return new S(child);
            }
            return null;
        }
        else if (isN(filter))
            return (child = childs[filter < 0 ? l(childs) + filter : filter]) ? new S(child) : null;
    }
    childs(filter, to) {
        let childs = Array.from(this.e.children);
        return new M(...(isS(filter) ? childs.filter(c => c.matches(filter)) :
            isN(filter) ? childs.slice(filter, to) :
                isF(filter) ? childs.filter(c => filter(new S(c))) :
                    childs));
    }
    query(filter) {
        let e = this.e.querySelector(filter);
        return e && new S(e);
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
        return new S(this.e.cloneNode(deep));
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
                isU(v) || (this.e[key] = v);
            }
        return this;
    }
    prop(props, value) {
        if (arguments.length == 1) {
            return this.e[props];
        }
        else
            this.e[props] = value;
        return this;
    }
    props(props) {
        for (let key in props) {
            let v = props[key];
            isU(v) || (this.e[key] = v);
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
                s.setProperty(_.replace(cssPropRgx, m => "-" + m), k[_], i ? "important" : "");
        return this;
    }
    uncss(properties) {
        if (properties)
            for (let i = 0; i < properties.length; i++)
                this.e.style[properties[i]] = "";
        else
            this.e.removeAttribute('style');
        return this;
    }
    c(names, set) {
        if (names)
            this.e.classList[set === false ? 'remove' : 'add'].apply(this.e.classList, (isS(names) ? names.trim().split(' ') : names).filter(n => n));
        return this;
    }
    cls(names, set) {
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
    hasClass(name) {
        return this.e.classList.contains(name);
    }
    attr(attr, value) {
        if (isU(value)) {
            return this.e.getAttribute(attr);
        }
        else if (value === false)
            this.e.removeAttribute(attr);
        else
            this.e.setAttribute(attr, value === true ? '' : value);
        return this;
    }
    attrs(attrs) {
        for (let key in attrs) {
            let value = attrs[key];
            if (value === false)
                this.e.removeAttribute(key);
            else
                this.e.setAttribute(key, value === true ? '' : value);
        }
        return this;
    }
    d(data) {
        let e = this.e;
        if (isU(data))
            return def(e._d, (e = e.parentElement) && new S(e).d());
        e._d = data;
        return this;
    }
    remove() {
        this.e.remove();
        return this;
    }
}
export class M extends Array {
    constructor(...elements) {
        if (isN(elements[0]))
            super(elements[0]);
        else
            super(...elements.map(i => "e" in i ? i.e : i));
    }
    e(i) { return new S(this[i]); }
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
            for (let css in props)
                t.setProperty(css, props[css], important ? "important" : "");
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
                    result.push.apply(result, item.children);
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
            cb(new S(this[i]), i);
        return this;
    }
    eachS(callbackfn) {
        this.forEach((value, index) => callbackfn(new S(value), index));
        return this;
    }
}
export class E {
    /**interface */
    i;
    $;
    bonds;
    validators;
    constructor(i) {
        this.bonds = [];
        this.eh = {};
        this.i = i || {};
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
        this.bonds.length = 0;
    }
    reRender() {
        this.dispose();
        return this.render();
    }
    removeKey(key) {
        if (isS(key))
            delete this.i[key];
        return this;
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
        let dt = this.i;
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
        for (let i = 0, b = this.bonds; i < b.length; i++) {
            let bond = b[i];
            if (!bond.prop || bond.prop in key)
                bond.handler.call(this, bond.e, key);
        }
        this.emit('set', key);
        return this;
    }
    toggle(key) {
        return this.set(key, !this.i[key]);
    }
    clone() {
        return new this.constructor(this.i);
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
            this.bonds.push({ e: element, handler: handler, prop: prop });
            if (!noInit)
                handler.call(this, element, this.i);
            return element.render();
        }
        else {
            this.bonds.push({ e: element, handler: handler, prop: prop });
            if (!noInit)
                handler.call(this, element, this.i);
            return element;
        }
    }
    unbind(s) {
        var i = this.bonds.findIndex(b => b.e.e == s.e || s == b.e);
        if (i != -1)
            this.bonds.splice(i, 1);
    }
    toJSON() { }
}
// #endregion
/**@deprecated */
class CL extends Array {
    push(...cls) {
        for (let t of cls) {
            if (t)
                for (let t2 of isS(t) ? t.split(' ') : t)
                    if (t2)
                        super.push(t2);
        }
        return this.length;
    }
}
/**@deprecated */
export function cl(...cls) {
    let c = new CL;
    if (cls.length)
        c.push(...cls);
    return c;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsaG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnYWxoby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFM0MsT0FBTyxFQUFxRCxFQUFFLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDbEYsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsTUFBTSxXQUFXLENBQUM7QUFZbEUsTUFBTSxVQUFVLENBQUMsQ0FBQyxDQUFJLEVBQUUsSUFBUyxFQUFFLElBQVM7SUFDMUMsSUFBSSxDQUFDLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUNwQixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQ1osRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixJQUFJLElBQUk7UUFDTixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNULEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNOLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNiLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxD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O0lBR0QsS0FBSyxDQUFDLFVBQVc7UUFDZixJQUFJLFVBQVU7WUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7Z0JBQ3hDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7WUFFbkMsSUFBSSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBS0QsQ0FBQyxDQUFDLEtBQWUsRUFBRSxHQUFVO1FBQzNCLElBQUksS0FBSztZQUNQLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVJLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUlELEdBQUcsQ0FBQyxLQUFlLEVBQUUsR0FBSTtRQUN2QixJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxSSxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxrQkFBa0I7SUFDbEIsSUFBSSxDQUFDLEtBQWE7UUFDaEIsS0FBSyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztZQUM1QixJQUFJLENBQUM7Z0JBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELFFBQVEsQ0FBQyxJQUFZO1FBQ25CLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFHRCxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQU07UUFDZixJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNkLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEM7YUFDSSxJQUFJLEtBQUssS0FBSyxLQUFLO1lBQ3RCLElBQUksQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDOztZQUU3QixJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6RCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxLQUFLLENBQUMsS0FBcUM7UUFDekMsS0FBSyxJQUFJLEdBQUcsSUFBSSxLQUFLLEVBQUU7WUFDckIsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksS0FBSyxLQUFLLEtBQUs7Z0JBQ2pCLElBQUksQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztnQkFFNUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBZSxDQUFDLENBQUM7U0FDbkU7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFHRCxDQUFDLENBQUMsSUFBVTtRQUNWLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUF5QixDQUFDO1FBQ3ZDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQztZQUNYLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDWixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxNQUFNO1FBQ0osSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRjtBQUNELE1BQU0sT0FBTyxDQUFtQyxTQUFRLEtBQVE7SUFHOUQsWUFBWSxHQUFHLFFBQXNCO1FBQ25DLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQixLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O1lBQ2hCLEtBQUssQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFDRCxDQUFDLENBQUMsQ0FBUyxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBR3ZDLEVBQUUsQ0FBQyxLQUFhLEVBQUUsUUFBNEMsRUFBRSxPQUEwQztRQUN4RyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7WUFDbEMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsSUFBSSxDQUFDLEtBQVk7UUFDZixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUN6QyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELEdBQUcsQ0FBQyxLQUFpQixFQUFFLFNBQWdCO1FBQ3JDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3BDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDdEIsS0FBSyxJQUFJLEdBQUcsSUFBSSxLQUFLO2dCQUNuQixDQUFDLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2hFO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBS0QsS0FBSyxDQUFDLENBQVM7UUFDYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxDQUFDO2dCQUFFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtvQkFDdEMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O2dCQUMxQixDQUFDLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2pDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBT0QsQ0FBQyxDQUFDLEtBQWtCLEVBQUUsR0FBYTtRQUNqQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3BDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO1NBQy9EO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBR0QsQ0FBQyxDQUFDLElBQVksRUFBRSxLQUFVO1FBQ3hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtZQUNsQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELE1BQU07UUFDSixLQUFLLElBQUksQ0FBQyxJQUFJLElBQUk7WUFDaEIsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2IsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBSUQsS0FBSyxDQUFDLE1BQXdCO1FBQzVCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDckIsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJO1lBQ25CLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQztnQkFDYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzdDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzdCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7d0JBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBa0IsQ0FBQyxDQUFDO2lCQUNuQzs7Z0JBRUQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ1gsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQWMsQ0FBQyxDQUFDLENBQUM7b0JBQzlFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0MsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUk7UUFDRixPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxrQkFBK0IsQ0FBQyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUNELElBQUk7UUFDRixPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxzQkFBbUMsQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUNELEVBQUUsQ0FBQyxFQUFtQztRQUNwQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7WUFDbEMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELEtBQUssQ0FBQyxVQUFnRDtRQUNwRCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDaEUsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUFZRCxNQUFNLE9BQWdCLENBQUM7SUFDckIsZUFBZTtJQUNmLENBQUMsQ0FBSTtJQUNMLENBQUMsQ0FBSTtJQUNHLEtBQUssQ0FBb0U7SUFDakYsVUFBVSxDQUF5RDtJQUNuRSxZQUFZLENBQUs7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQU8sQ0FBQztJQUN4QixDQUFDO0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxNQUFNO1FBQ0osSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQ3JCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2QsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDO29CQUNoQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN4QixJQUFJLENBQU0sQ0FBQztTQUNkO1FBQ0QsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2hCLENBQUM7SUFDRCxPQUFPO1FBQ0wsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFO1lBQ1YsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNoQixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDZjtRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBQ0QsUUFBUTtRQUNOLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNmLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxTQUFTLENBQUMsR0FBc0I7UUFDOUIsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDO1lBQ1YsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELGFBQWEsQ0FBb0IsS0FBUSxFQUFFLFNBQW9EO1FBQzdGLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQztRQUNYLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEtBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pHLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNPLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSztRQUN2QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLElBQUksSUFBSTtZQUNOLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDO29CQUN0QixPQUFPLEtBQUssQ0FBQztRQUNuQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFNRCxHQUFHLENBQUMsR0FBb0IsRUFBRSxLQUFNO1FBQzlCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDaEIsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDWixJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDWixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ1gsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ25DLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztpQkFDaEI7Z0JBQ0QsR0FBRyxHQUFHLENBQUMsQ0FBQzthQUNUO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDWCxLQUFLLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRTtvQkFDakIsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqQixJQUFJLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQzVELEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO2lCQUN0QjtnQkFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTTtvQkFDOUIsT0FBTyxJQUFJLENBQUM7YUFDZjtTQUNGO2FBQU0sSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNmLEdBQUcsR0FBRyxFQUFFLENBQUM7U0FDVjthQUFNO1lBQ0wsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNwRSxPQUFPLElBQUksQ0FBQztZQUNkLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDaEIsR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQztTQUN4QjtRQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2pELElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUc7Z0JBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ3hDO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBUSxDQUFDLENBQUM7UUFDM0IsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsTUFBTSxDQUFDLEdBQVk7UUFDakIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFRLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBQ0QsS0FBSztRQUNILE9BQU8sSUFBSyxJQUFJLENBQUMsV0FBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUNRLEVBQUUsQ0FFVDtJQUdGLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQVE7UUFDMUIsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDZCxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ2pCLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDZjtRQUNELE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDRCxHQUFHLENBQXlCLEtBQVEsRUFBRSxRQUErQztRQUNuRixPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFHRCxJQUFJLENBQUMsS0FBVSxFQUFFLEdBQUcsSUFBVztRQUM3QixPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBZSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUNELEtBQUssQ0FBb0IsS0FBYyxFQUFFLFFBQWlELEVBQUUsVUFBbUIsRUFBRTtRQUMvRyxPQUFPLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzFCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxLQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWhFLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFHRCxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTTtRQUNqQyxJQUFJLFFBQVEsSUFBSSxPQUFPLEVBQUU7WUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLE1BQU07Z0JBQ1QsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUN6QjthQUFNO1lBQ0wsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLE1BQU07Z0JBQ1QsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxPQUFPLE9BQU8sQ0FBQztTQUNoQjtJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsQ0FBTTtRQUNYLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBQyxDQUFDLENBQU8sQ0FBQyxDQUFDLElBQUssQ0FBTyxDQUFDLENBQUMsSUFBSyxDQUFZLElBQUksQ0FBQyxDQUFDLENBQVcsQ0FBQyxDQUFDO1FBQ2hHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNULElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQ08sTUFBTSxLQUFLLENBQUM7Q0FDckI7QUFDRCxhQUFhO0FBRWIsaUJBQWlCO0FBQ2pCLE1BQU0sRUFBRyxTQUFRLEtBQWE7SUFDNUIsSUFBSSxDQUFDLEdBQUcsR0FBNkI7UUFDbkMsS0FBSyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUU7WUFDakIsSUFBSSxDQUFDO2dCQUNILEtBQUssSUFBSSxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QyxJQUFJLEVBQUU7d0JBQ0osS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUN0QjtRQUNELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0NBQ0Y7QUFDRCxpQkFBaUI7QUFDakIsTUFBTSxVQUFVLEVBQUUsQ0FBQyxHQUFHLEdBQTZCO0lBQ2pELElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDO0lBQ2YsSUFBSSxHQUFHLENBQUMsTUFBTTtRQUNaLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNqQixPQUFPLENBQUMsQ0FBQztBQUNYLENBQUMifQ==