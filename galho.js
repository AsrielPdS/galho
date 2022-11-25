import { emit, off, on } from "./event.js";
import { isA, isF, isN, isO, isS, isU, l } from "./util.js";
export function delay(e, event, time, handler) {
    handler = handler.bind(e.e);
    return e.on(event, function (e) {
        var t = `_${event}_timer`;
        clearTimeout(this[t]);
        this[t] = setTimeout(handler, time, e);
    });
}
export default function create(e, arg0, arg1) {
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
export const g = create;
export const div = (props, child) => g("div", props, child), span = (props, child) => g("span", props, child);
export const active = () => g(document.activeElement);
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
export class S {
    e;
    constructor(e) {
        this.e = e;
    }
    toJSON() { }
    get valid() { return !!this.e; }
    rect() { return this.e.getBoundingClientRect(); }
    contains(child) {
        return child ? this.e.contains(asE(child)) : false;
    }
    on(event, listener, options) {
        if (isS(event)) {
            if (listener)
                this.e.addEventListener(event, listener, options);
        }
        else if (isA(event)) {
            if (listener)
                for (let ev of event)
                    this.e.addEventListener(ev, listener, options);
        }
        else
            for (let ev in event) {
                let t = event[ev];
                if (t)
                    this.e.addEventListener(ev, t, listener);
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
    try(action) {
        if (this.valid)
            action(this);
        return this;
    }
    static empty;
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
    text(value) {
        if (isU(value))
            return this.e.textContent;
        this.e.textContent = value;
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
    first() {
        return g(this.e.firstElementChild);
    }
    last() {
        return g(this.e.lastElementChild);
    }
    childs(filter, to) {
        let childs = Array.from(this.e.children);
        return new M(...(isS(filter) ? childs.filter(c => c.matches(filter)) :
            isN(filter) ? childs.slice(filter, to) :
                isF(filter) ? childs.filter(c => filter(new S(c))) :
                    childs));
    }
    query(filter) {
        return new S(this.e.querySelector(filter));
    }
    queryAll(filter) {
        return new M(...Array.from(this.e.querySelectorAll(filter)));
    }
    parent() {
        return g(this.e.parentElement);
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
    prev() {
        return new S(this.e.previousElementSibling);
    }
    next() {
        return new S(this.e.nextElementSibling);
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
    css(css, value) {
        let s = this.e.style;
        if (isS(css))
            if (isU(value))
                return s[css];
            else
                s[css] = value;
        else
            for (let key in css)
                s[key] = css[key];
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
        this.e.classList[set === false ? 'remove' : 'add'].apply(this.e.classList, isS(names) ? names.trim().split(' ').filter(n => n) : names);
        return this;
    }
    cls(names, set) {
        this.e.classList[set === false ? 'remove' : 'add'].apply(this.e.classList, isS(names) ? names.trim().split(' ').filter(n => n) : names);
        return this;
    }
    tcls(names) {
        for (let n of names.split(' '))
            if (n)
                this.e.classList.toggle(n.replace(' ', ''));
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
        if (isU(data))
            return this.e['_d'];
        this.e['_d'] = data;
        return this;
    }
    remove() {
        this.e.remove();
        return this;
    }
}
export const isE = (v) => v.e && v.e?.nodeType === 1;
export const asE = (v) => v.e ? v.e : v;
const isD = (v) => v.nodeType === 1;
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
                t.setProperty(css, props[css], important && "important");
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
export const empty = '&#8203;';
export const m = (...elements) => new M(...elements);
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
export function onfocusout(e, handler) {
    handler && e.on('focusout', ev => e.contains(ev.relatedTarget) || handler.call(e, ev));
    return e;
}
export function get(query, ctx) {
    let t = (ctx ? asE(ctx) : document).querySelector(query);
    return t && g(t);
}
export function getAll(input, ctx) {
    return new M(...Array.from((ctx ? asE(ctx) : document).querySelectorAll(input)));
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
    tryAdd(cls) {
        if (!this.includes(cls))
            this.push(cls);
        return this;
    }
}
export function cl(...cls) {
    let c = new CL;
    if (cls.length)
        c.push(...cls);
    return c;
}
let _id = 0;
export const id = () => 'i' + (_id++);
export function clearEvent(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
}
const subs = [">", " ", ":", "~", "+"], defSub = ">", regex = /[A-Z]/g, sub = (parent, child) => child.split(',')
    .map(s => parent.map(p => {
    if (s[0] == "&")
        return p + s.slice(1);
    else if (subs.indexOf(s[0]) == -1)
        return p + defSub + s;
    else
        return p + s;
}).join(',')).join(',');
export function css(props, s) {
    let r = "", subSel = "", split;
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
                r += key.replace(regex, m => "-" + m) + ":" + val + ";";
        }
    }
    return (r ? s + "{" + r + "}" : "") + subSel;
}
export const rgba = (r, g, b, a) => `rgba(${r},${g},${b},${a})`;
export const rgb = (r, g, b) => `rgb(${r},${g},${b})`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsaG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnYWxoby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQXdCLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUF1QixNQUFNLFlBQVksQ0FBQztBQUV0RixPQUFPLEVBQVksR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFzQyxNQUFNLFdBQVcsQ0FBQztBQWlCMUcsTUFBTSxVQUFVLEtBQUssQ0FBQyxDQUFJLEVBQUUsS0FBYSxFQUFFLElBQVksRUFBRSxPQUEwQjtJQUNqRixPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUM7UUFDNUIsSUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLFFBQVEsQ0FBQztRQUMxQixZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3pDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUdELE1BQU0sQ0FBQyxPQUFPLFVBQVUsTUFBTSxDQUFDLENBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSTtJQUNsRCxJQUFJLENBQUMsQ0FBQztRQUNKLE9BQU8sSUFBSSxDQUFDO0lBQ2QsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxDQUFDLENB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