"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearEvent = exports.id = exports.cl = exports.getAll = exports.get = exports.onfocusout = exports.wrap = exports.toSVG = exports.svg = exports.xml = exports.html = exports.m = exports.M = exports.asE = exports.isE = exports.S = exports.E = exports.active = exports.div = exports.g = exports.delay = void 0;
const handler_1 = require("handler");
const isS = (value) => typeof value === 'string';
const isF = (value) => typeof value === 'function';
function delay(e, event, delay, handler) {
    handler = handler.bind(e);
    e.on(event, function (e) {
        var t = `_${event}_timer`;
        clearTimeout(this[t]);
        this[t] = setTimeout(handler, delay, e);
    });
    return e;
}
exports.delay = delay;
function create(e, props, child) {
    if (!e)
        return new S();
    let result = (isS(e) ?
        new S(document.createElement(e)) :
        isD(e) ?
            new S(e) :
            'render' in e ?
                e.render() :
                e);
    if (props)
        if (isS(props) || Array.isArray(props))
            result.cls(props);
        else
            result.props(props);
    if (child != null)
        result.add(child);
    return result;
}
exports.default = create;
exports.g = create;
const div = (props, child) => (0, exports.g)("div", props, child);
exports.div = div;
const active = () => (0, exports.g)(document.activeElement);
exports.active = active;
class E {
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
        if (typeof key == "object") {
            if (Array.isArray(key)) {
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
    on(event, callback, options) {
        if (isF(event)) {
            callback = event;
            event = "set";
        }
        return (0, handler_1.on)(this, event, callback, options);
    }
    off(event, callback) {
        (0, handler_1.off)(this, event, callback);
        return this;
    }
    emit(event, data) {
        (0, handler_1.emit)(this, event, data);
        return this;
    }
    onset(props, callback, options = {}) {
        options.check = isS(props) ?
            e => props in e : e => props.some(prop => prop in e);
        return (0, handler_1.on)(this, "set", callback, options);
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
        if (isS(event)) {
            if (listener)
                this.e.addEventListener(event, listener, options);
        }
        else if (Array.isArray(event)) {
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
    click() {
        this.e.click();
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
    put(position, child) {
        switch (typeof child) {
            case 'object':
                if (!child)
                    break;
                if ((0, exports.isE)(child) ? child = child.e : isD(child))
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
    prepend(child) {
        return this.put('afterbegin', child);
    }
    place(index, child) {
        if (!index)
            return this.put('afterbegin', child);
        var temp = this.e.children[index - 1];
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
        return isS(filter) ? this.e.matches(filter) : this.e == (0, exports.asE)(filter);
    }
    id(v) {
        if (v)
            this.e.id = v;
        else
            return this.e.id;
        return this;
    }
    text(value) {
        if (value === undefined)
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
        let childs = this.e.children;
        if (isS(filter)) {
            for (let i = 0; i < childs.length; i++) {
                let child = childs[i];
                if (child.matches(filter))
                    return new S(child);
            }
            return new S();
        }
        else if (typeof filter === 'number')
            return new S(childs[filter < 0 ? childs.length + filter : filter]);
    }
    first() {
        return new S(this.e.firstElementChild);
    }
    last() {
        return new S(this.e.lastElementChild);
    }
    childs(filter, to) {
        let childs = Array.from(this.e.children);
        return new M(...(isS(filter) ? childs.filter(c => c.matches(filter)) :
            typeof filter == "number" ? childs.slice(filter, to) :
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
        return new S(this.e.parentElement);
    }
    closest(filter) {
        return new S(this.e.closest(filter));
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
    prop(props, value) {
        if (isS(props))
            if (arguments.length == 1) {
                return this.e[props];
            }
            else
                this.e[props] = value;
        return this;
    }
    props(props) {
        for (var key in props) {
            var value = props[key];
            if (value !== undefined)
                this.e[key] = props[key];
        }
        return this;
    }
    call(key, ...params) {
        return this.e[key].call(this.e, ...params);
    }
    css(csss, value) {
        let s = this.e.style;
        if (isS(csss))
            if (value === undefined)
                return s[csss];
            else
                s[csss] = value;
        else
            for (let css in csss)
                s[css] = csss[css];
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
    uncls() {
        this.e.removeAttribute('class');
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
        if (value === undefined) {
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
        if (data === undefined)
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
    css(props) {
        for (let css in props)
            for (let i = 0; i < this.length; i++)
                this[i].style[css] = props[css];
        return this;
    }
    cls(names, set) {
        isS(names) && (names = names.split(' ').filter(v => v));
        for (let i = 0; i < this.length; i++) {
            this[i].classList[set === false ? 'remove' : 'add'](...names);
        }
        return this;
    }
    prop(prop, value) {
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
                typeof filter === "number" ?
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
const m = (...elements) => new M(...elements);
exports.m = m;
function html(tag, props, child) {
    return (0, exports.g)(document.createElementNS('http://www.w3.org/1999/xhtml', tag), props, child);
}
exports.html = html;
function xml(tag, props, child) {
    return (0, exports.g)(document.createElementNS('http://www.w3.org/1999/xhtml', tag), props, child);
}
exports.xml = xml;
function svg(tag, attrs, child) {
    var s = new S(document.createElementNS('http://www.w3.org/2000/svg', tag));
    if (attrs)
        if (isS(attrs) || Array.isArray(attrs))
            s.cls(attrs);
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
    if (isF(child))
        child = child();
    if (isF(child?.render))
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
    return new S((ctx ? (0, exports.asE)(ctx) : document).querySelector(query));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsaG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnYWxoby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBc0U7QUFLdEUsTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFjLEVBQW1CLEVBQUUsQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUM7QUFDM0UsTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFjLEVBQXFCLEVBQUUsQ0FBQyxPQUFPLEtBQUssS0FBSyxVQUFVLENBQUM7QUFjL0UsU0FBZ0IsS0FBSyxDQUFDLENBQUksRUFBRSxLQUFhLEVBQUUsS0FBYSxFQUFFLE9BQTBCO0lBQ2xGLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQztRQUNyQixJQUFJLENBQUMsR0FBRyxJQUFJLEtBQUssUUFBUSxDQUFDO1FBQzFCLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFSRCxzQkFRQztBQUdELFNBQXdCLE1BQU0sQ0FBQyxDQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUs7SUFDcEQsSUFBSSxDQUFDLENBQUM7UUFDSixPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDakIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNOLElBQUksQ0FB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