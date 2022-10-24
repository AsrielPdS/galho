"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rgb = exports.rgba = exports.parse = exports.sub = exports.css = exports.clearEvent = exports.id = exports.cl = exports.getAll = exports.get = exports.onfocusout = exports.wrap = exports.toSVG = exports.svg = exports.html = exports.m = exports.empty = exports.M = exports.asE = exports.isE = exports.S = exports.E = exports.active = exports.div = exports.g = exports.delay = void 0;
const event_js_1 = require("./event.js");
const util_js_1 = require("./util.js");
function delay(e, event, time, handler) {
    handler = handler.bind(e.e);
    return e.on(event, function (e) {
        var t = `_${event}_timer`;
        clearTimeout(this[t]);
        this[t] = setTimeout(handler, time, e);
    });
}
exports.delay = delay;
function create(e, arg0, arg1) {
    if (!e)
        return null;
    let r = (0, util_js_1.isS)(e) ?
        new S(document.createElement(e)) :
        isD(e) ?
            new S(e) :
            'render' in e ?
                e.render() :
                e;
    if (arg0)
        (0, util_js_1.isS)(arg0) ?
            (0, util_js_1.isS)(e) ?
                r.attr("class", arg0) :
                r.c(arg0) :
            (0, util_js_1.isA)(arg0) ?
                r.c(arg0) :
                r.p(arg0);
    arg1 != null && r.add(arg1);
    return r;
}
exports.default = create;
exports.g = create;
const div = (props, child) => (0, exports.g)("div", props, child);
exports.div = div;
const active = () => (0, exports.g)(document.activeElement);
exports.active = active;
class E {
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
        if ((0, util_js_1.isS)(key))
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
        if ((0, util_js_1.isO)(key)) {
            if ((0, util_js_1.isA)(key)) {
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
        if ((0, util_js_1.isF)(event)) {
            callback = event;
            event = "set";
        }
        return (0, event_js_1.on)(this, event, callback, options);
    }
    off(event, callback) {
        return (0, event_js_1.off)(this, event, callback);
    }
    emit(event, ...args) {
        return (0, event_js_1.emit)(this, event, ...args);
    }
    onset(props, callback, options = {}) {
        options.check = (0, util_js_1.isS)(props) ?
            e => props in e : e => props.some(prop => prop in e);
        return (0, event_js_1.on)(this, "set", callback, options);
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
exports.E = E;
class S {
    e;
    constructor(e) {
        this.e = e;
    }
    toJSON() { }
    get valid() { return !!this.e; }
    rect() { return this.e.getBoundingClientRect(); }
    contains(child) {
        return child ? this.e.contains((0, exports.asE)(child)) : false;
    }
    on(event, listener, options) {
        if ((0, util_js_1.isS)(event)) {
            if (listener)
                this.e.addEventListener(event, listener, options);
        }
        else if ((0, util_js_1.isA)(event)) {
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
        this.e.dispatchEvent((0, util_js_1.isS)(event) ? new Event(event, init) : event);
        return this;
    }
    off(event, listener) {
        for (let e of (0, util_js_1.isS)(event) ? [event] : event)
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
                if ((0, exports.isE)(child) ? child = child.e : isD(child))
                    this.e.insertAdjacentElement(position, child);
                else if ((0, util_js_1.isF)(child.render))
                    this.put(position, child.render());
                else if ((0, util_js_1.isF)(child.then))
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
    putAfter(child) {
        return this.put('afterend', child);
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
                if ((0, exports.isE)(child) ? child = child.e : isD(child))
                    this.e.append(child);
                else if ((0, util_js_1.isF)(child.render))
                    this.add(child.render());
                else if ((0, util_js_1.isF)(child.then))
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
        return (0, util_js_1.isS)(filter) ? this.e.matches(filter) : this.e == (0, exports.asE)(filter);
    }
    id(v) {
        if (v)
            this.e.id = v;
        else
            return this.e.id;
        return this;
    }
    text(value) {
        if ((0, util_js_1.isU)(value))
            return this.e.textContent;
        this.e.textContent = value;
        return this;
    }
    addTo(parent) {
        (0, exports.asE)(parent).appendChild(this.e);
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
        if ((0, util_js_1.isS)(filter)) {
            for (let i = 0; i < childs.length; i++) {
                if ((child = childs[i]).matches(filter))
                    return new S(child);
            }
            return null;
        }
        else if ((0, util_js_1.isN)(filter))
            return (child = childs[filter < 0 ? (0, util_js_1.l)(childs) + filter : filter]) ? new S(child) : null;
    }
    first() {
        return (0, exports.g)(this.e.firstElementChild);
    }
    last() {
        return (0, exports.g)(this.e.lastElementChild);
    }
    childs(filter, to) {
        let childs = Array.from(this.e.children);
        return new M(...((0, util_js_1.isS)(filter) ? childs.filter(c => c.matches(filter)) :
            (0, util_js_1.isN)(filter) ? childs.slice(filter, to) :
                (0, util_js_1.isF)(filter) ? childs.filter(c => filter(new S(c))) :
                    childs));
    }
    query(filter) {
        return new S(this.e.querySelector(filter));
    }
    queryAll(filter) {
        return new M(...Array.from(this.e.querySelectorAll(filter)));
    }
    parent() {
        return (0, exports.g)(this.e.parentElement);
    }
    closest(filter) {
        return (0, exports.g)(this.e.closest(filter));
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
        if ((0, util_js_1.isS)(a0))
            if ((0, util_js_1.isU)(a1))
                return this.e[a0];
            else
                this.e[a0] = a1;
        else
            for (let key in a0) {
                let v = a0[key];
                (0, util_js_1.isU)(v) || (this.e[key] = v);
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
            (0, util_js_1.isU)(v) || (this.e[key] = v);
        }
        return this;
    }
    call(key, ...args) {
        this.e[key](...args);
        return this;
    }
    css(css, value) {
        let s = this.e.style;
        if ((0, util_js_1.isS)(css))
            if ((0, util_js_1.isU)(value))
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
        this.e.classList[set === false ? 'remove' : 'add'].apply(this.e.classList, (0, util_js_1.isS)(names) ? names.trim().split(' ').filter(n => n) : names);
        return this;
    }
    cls(names, set) {
        this.e.classList[set === false ? 'remove' : 'add'].apply(this.e.classList, (0, util_js_1.isS)(names) ? names.trim().split(' ').filter(n => n) : names);
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
        if ((0, util_js_1.isU)(value)) {
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
        if ((0, util_js_1.isU)(data))
            return this.e['_d'];
        this.e['_d'] = data;
        return this;
    }
    remove() {
        this.e.remove();
        return this;
    }
}
exports.S = S;
const isE = (v) => v.e && v.e?.nodeType === 1;
exports.isE = isE;
const asE = (v) => v.e ? v.e : v;
exports.asE = asE;
const isD = (v) => v.nodeType === 1;
class M extends Array {
    constructor(...elements) {
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
        (0, util_js_1.isS)(names) && (names = names.split(' ').filter(v => v));
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
            if ((0, util_js_1.isS)(filter))
                for (let i = 0; i < item.children.length; i++) {
                    let child = item.children[i];
                    if (child.matches(filter))
                        result.push(child);
                }
            else
                (0, util_js_1.isN)(filter) ?
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
exports.M = M;
exports.empty = '&#8203;';
const m = (...elements) => new M(...elements);
exports.m = m;
function html(tag, props, child) {
    return (0, exports.g)(document.createElementNS('http://www.w3.org/1999/xhtml', tag), props, child);
}
exports.html = html;
function svg(tag, attrs, child) {
    var s = new S(document.createElementNS('http://www.w3.org/2000/svg', tag));
    if (attrs)
        if ((0, util_js_1.isS)(attrs) || (0, util_js_1.isA)(attrs))
            s.c(attrs);
        else
            s.attrs(attrs);
    if (child || child === 0)
        s.add(child);
    return s;
}
exports.svg = svg;
function toSVG(text) {
    let parser = new DOMParser(), doc = parser.parseFromString(text, "image/svg+xml");
    return new S(doc.firstChild);
}
exports.toSVG = toSVG;
function wrap(child, props, tag) {
    if ((0, util_js_1.isF)(child))
        child = child();
    if ((0, util_js_1.isF)(child?.render))
        child = child.render();
    if (child instanceof Element)
        child = new S(child);
    else if (!(child instanceof S))
        child = (0, exports.g)(tag || "div", 0, child);
    props && (0, exports.g)(child, props);
    return child;
}
exports.wrap = wrap;
function onfocusout(e, handler) {
    handler && e.on('focusout', ev => e.contains(ev.relatedTarget) || handler.call(e, ev));
    return e;
}
exports.onfocusout = onfocusout;
function get(query, ctx) {
    let t = (ctx ? (0, exports.asE)(ctx) : document).querySelector(query);
    return t && (0, exports.g)(t);
}
exports.get = get;
function getAll(input, ctx) {
    return new M(...Array.from((ctx ? (0, exports.asE)(ctx) : document).querySelectorAll(input)));
}
exports.getAll = getAll;
class CL extends Array {
    push(...cls) {
        for (let t of cls) {
            if (t)
                for (let t2 of (0, util_js_1.isS)(t) ? t.split(' ') : t)
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
function cl(...cls) {
    let c = new CL;
    if (cls.length)
        c.push(...cls);
    return c;
}
exports.cl = cl;
let _id = 0;
const id = () => 'i' + (_id++);
exports.id = id;
function clearEvent(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
}
exports.clearEvent = clearEvent;
function css(selector, tag) {
    let r = "";
    for (let k in selector)
        r += parse(k, selector[k]);
    return tag ? tag.add(r) : (0, exports.g)("style").text(r).addTo(document.head);
}
exports.css = css;
const subs = [">", " ", ":", "~", "+"], defSub = ">", regex = /[A-Z]/g;
function sub(parent, child) {
    return child.split(',').map(s => {
        let t = s[0];
        return parent.map(p => {
            if (t == "&")
                return p + s.slice(1);
            else if (subs.indexOf(t) == -1)
                return p + defSub + s;
            else
                return p + s;
        }).join(',');
    }).join(',');
}
exports.sub = sub;
function parse(selector, props) {
    let r = "", subSel = "", split;
    if (selector[0] == '@') {
        for (let k in props)
            r += parse(k, props[k]);
        return r ? selector + "{" + r + "}" : '';
    }
    for (let key in props) {
        let val = props[key];
        if (val || val === 0) {
            if ((0, util_js_1.isO)(val)) {
                subSel += parse(sub(split || (split = selector.split(',')), key), val);
            }
            else
                r += key.replace(regex, m => "-" + m) + ":" + val + ";";
        }
    }
    return (r ? selector + "{" + r + "}" : "") + subSel;
}
exports.parse = parse;
const rgba = (r, g, b, a) => `rgba(${r},${g},${b},${a})`;
exports.rgba = rgba;
const rgb = (r, g, b) => `rgb(${r},${g},${b})`;
exports.rgb = rgb;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsaG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnYWxoby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5Q0FBc0Y7QUFFdEYsdUNBQXFHO0FBaUJyRyxTQUFnQixLQUFLLENBQUMsQ0FBSSxFQUFFLEtBQWEsRUFBRSxJQUFZLEVBQUUsT0FBMEI7SUFDakYsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDO1FBQzVCLElBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxRQUFRLENBQUM7UUFDMUIsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFQRCxzQkFPQztBQUdELFNBQXdCLE1BQU0sQ0FBQyxDQUFTLEVBQUUsSUFBSSxFQUFFLElBQUk7SUFDbEQsSUFBSSxDQUFDLENBQUM7UUFDSixPQUFPLElBQUksQ0FBQztJQUNkLElBQUksQ0FBQyxHQUFHLElBQUEsYUFBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVixRQUFRLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBQ1osQ0FBTSxDQUFDO0lBQ2IsSUFBSSxJQUFJO1FBQ04sSUFBQSxhQUFHLEVBQUMsSUFB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WUFDMUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFFLEtBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFaEUsT0FBTyxJQUFBLGFBQUUsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBR0QsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU07UUFDakMsSUFBSSxRQUFRLElBQUksT0FBTyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxNQUFNO2dCQUNULE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEMsT0FBTyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDekI7YUFBTTtZQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxNQUFNO2dCQUNULE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEMsT0FBTyxPQUFPLENBQUM7U0FDaEI7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLENBQU07UUFDWCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQyxDQUFPLENB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