import { emit, off, on } from "./event.js";
import { isA, isN, isO, isF, def, isS, isU, l, } from "./util.js";
export function g(e, arg0, arg1) {
    if (!e)
        return null;
    let r = isS(e) ?
        new S(document.createElement(e)) :
        isD(e) ?
            new S(e) :
            'render' in e ?
                e.render() :
                e;
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
let _id = 0;
export const id = () => 'i' + (_id++);
export const div = (props, child) => g("div", props, child);
export const span = (props, child) => g("span", props, child);
export const empty = '&#8203;';
export const active = () => g(document.activeElement);
export const isE = (v) => v.e && v.e?.nodeType === 1;
export const asE = (v) => v.e ? v.e : v;
const isD = (v) => v.nodeType === 1;
export function html(tag, props, child) {
    return g(document.createElementNS('http://www.w3.org/1999/xhtml', tag), props, child);
}
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
export function get(selectors, ctx) {
    let t = (ctx ? asE(ctx) : document).querySelector(selectors);
    return t && g(t);
}
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
export function clearEvent(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
}
const cssPropRgx = /[A-Z]/g;
export function css(props, s) {
    let subs = [">", " ", ":", "~", "+"], r = "", subSel = "", split;
    function sub(parent, child) {
        return child.split(',')
            .map(s => parent.map(p => {
            if (subs.indexOf(s[0]) != -1)
                return p + s;
            if (s.includes("&"))
                return s.replaceAll("&", p);
            return p + ">" + s;
        }).join(',')).join(',');
    }
    if (!s || s[0] == '@') {
        for (let k in props)
            r += css(props[k], k);
        return r ? s ? s + "{" + r + "}" : r : '';
    }
    for (let key in props) {
        let val = props[key];
        if (val || val === 0) {
            if (isO(val)) {
                subSel += css(val, sub(split || (split = s.split(',')), key));
            }
            else
                r += key.replace(cssPropRgx, m => "-" + m) + ":" + val + ";";
        }
    }
    return (r ? s + "{" + r + "}" : "") + subSel;
}
export const rgba = (r, g, b, a) => `rgba(${r},${g},${b},${a})`;
export const rgb = (r, g, b) => `rgb(${r},${g},${b})`;
export class S {
    e;
    constructor(e) {
        this.e = e;
    }
    static empty;
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
    get first() {
        let e = this.e.firstElementChild;
        return e && new S(e);
    }
    get last() {
        let e = this.e.lastElementChild;
        return e && new S(e);
    }
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
    after(child) {
        return this.put('afterend', child);
    }
    putAfter(child) {
        return this.put('afterend', child);
    }
    before(child) {
        return this.put('beforebegin', child);
    }
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
    badd(child) { return this.put('afterbegin', child); }
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
        this.e.classList[set === false ? 'remove' : 'add'].apply(this.e.classList, (isS(names) ? names.trim().split(' ') : names).filter(n => n));
        return this;
    }
    cls(names, set) {
        this.e.classList[set === false ? 'remove' : 'add'].apply(this.e.classList, (isS(names) ? names.trim().split(' ') : names).filter(n => n));
        return this;
    }
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
export function cl(...cls) {
    let c = new CL;
    if (cls.length)
        c.push(...cls);
    return c;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsaG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnYWxoby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFHM0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsTUFBTSxXQUFXLENBQUM7QUFZbEUsTUFBTSxVQUFVLENBQUMsQ0FBQyxDQUFJLEVBQUUsSUFBSSxFQUFFLElBQUk7SUFDaEMsSUFBSSxDQUFDLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUNwQixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNWLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztnQkFDWixDQUFNLENBQUM7SUFDYixJQUFJLElBQUk7UUFDTixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNULEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNOLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNiLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNULENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztn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