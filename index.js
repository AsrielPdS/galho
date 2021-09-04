"use strict";
const inutil_1 = require("inutil");
function g(element, attrs, childs) {
    return g.g(element, attrs, childs);
}
(function (g_1) {
    function g(element, props, child) {
        if (!element)
            return S.empty;
        var result = typeof (element) === 'string' ?
            new S(document.createElement(element)) :
            element instanceof Element ?
                new S(element) :
                'render' in element ?
                    element.render() :
                    element;
        if (props)
            if (typeof props === 'string' || props instanceof Array)
                result.cls(props);
            else
                result.props(props);
        if (child != null)
            result.put(be, child);
        return result;
    }
    g_1.g = g;
    class E extends inutil_1.ET {
        constructor(model) {
            super();
            this.bonds = [];
            if (!model)
                model = {};
            if (this.constructor.default)
                inutil_1.deepExtend(model, this.constructor.default);
            this.model = model;
        }
        focus() {
            this.$.focus();
            return this;
        }
        render() {
            if (this.$ === void 0) {
                let view = this.view();
                this.$ = view ?
                    'render' in view ?
                        view.render() : view :
                    null;
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
            if (typeof key == 'string')
                delete this.model[key];
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
        update(key, value) {
            let model = this.model, binds = this.bonds, event;
            if (typeof key === 'object') {
                if (key instanceof Array) {
                    let t = {};
                    for (let i = 0; i < key.length; i++) {
                        let t2 = key[i];
                        t[t2] = model[t2];
                    }
                    key = t;
                }
                else {
                    for (let k in key) {
                        let val = key[k];
                        if (val === model[k] || (this.validators && !this._valid(k, val)))
                            delete key[k];
                        else
                            model[k] = val;
                    }
                    if (inutil_1.isEmpty(key))
                        return this;
                }
                event = new EUpdate(key);
                for (let i = 0; i < binds.length; i++) {
                    let bind = binds[i];
                    if (!bind.prop || bind.prop in key)
                        bind.handler.call(this, bind.e, event);
                }
            }
            else if (!key) {
                event = new EUpdate(model);
                for (let i = 0; i < binds.length; i++) {
                    let bind = binds[i];
                    bind.handler.call(this, bind.e, event);
                }
            }
            else {
                if (model[key] === value || (this.validators && !this._valid(key, value)))
                    return this;
                let state = { [key]: value };
                model[key] = value;
                event = new EUpdate(state);
                for (let i = 0; i < binds.length; i++) {
                    let bind = binds[i];
                    if (!bind.prop || bind.prop === key)
                        bind.handler.call(this, bind.e, event);
                }
            }
            this.trigger('update', event);
            return this;
        }
        toggle(key) {
            this.update(key, !this.model[key]);
        }
        clone() {
            return new this.constructor(this.model);
        }
        bind(element, handler, prop, noInit) {
            var event = new EUpdate(this.model);
            if (element instanceof E) {
                this.bonds.push({ e: element, handler: handler, prop: prop });
                if (!noInit)
                    handler.call(this, element, event);
                return element.render();
            }
            else {
                this.bonds.push({ e: element, handler: handler, prop: prop });
                if (!noInit)
                    handler.call(this, element, event);
                return element;
            }
        }
        inputBind(s, prop, fieldSet = 'value', fieldGet = fieldSet) {
            if (s instanceof S) {
                s.on('input', (e) => {
                    let v = e.target[fieldGet];
                    this.update(prop, v === '' || (typeof v === 'number' && isNaN(v)) ? null : v);
                });
                this.bind(s, () => {
                    var t = this.model[prop];
                    s.prop(fieldSet, t == null ? '' : t);
                }, prop);
                return s;
            }
            else {
                s.on('input', (value) => {
                    this.update(prop, value);
                });
                var view = s.render();
                this.bind(view, () => {
                    s.update(fieldSet, this.model[prop]);
                }, prop);
                return view;
            }
        }
        unbind(s) {
            var i = this.bonds.findIndex((b) => b.e.e == s.e || s == b.e);
            if (i != -1)
                this.bonds.splice(i, 1);
        }
        toJSON() { }
    }
    g_1.E = E;
    class S {
        constructor(e) {
            this.e = e;
        }
        toJSON() { }
        get valid() { return !!this.e; }
        on(event, listener, options) {
            let on = this.e['_on'] || (this.e['_on'] = {});
            if (inutil_1.isS(event)) {
                if (listener) {
                    (on[event] || (on[event] = [])).push(listener);
                    this.e.addEventListener(event, listener, options);
                }
            }
            else if (inutil_1.isA(event)) {
                for (let e of event) {
                    (on[e] || (on[e] = [])).push(listener);
                    this.e.addEventListener(e, listener, options);
                }
            }
            else
                for (let e in event) {
                    let t = event[e];
                    if (t) {
                        (on[e] || (on[e] = [])).push(t);
                        this.e.addEventListener(e, t, listener);
                    }
                }
            return this;
        }
        onP(event, listener) {
            return this.on(event, listener, { passive: true });
        }
        aopl(event, listener) {
            return this.on(event, listener, {
                passive: true,
                once: true
            });
        }
        delay(event, delay, handler) {
            handler = handler.bind(this.e);
            this.on(event, function (e) {
                var t = `_${event}_timer`;
                clearTimeout(this[t]);
                this[t] = setTimeout(handler, delay);
            });
            return this;
        }
        trigger(name, event = new Event(name)) {
            this.e.dispatchEvent(event);
            return this;
        }
        click() {
            this.e.click();
            return this;
        }
        one(event, listener) {
            if (typeof event == 'string')
                this.on(event, listener, { once: true });
            else
                this.on(event, { once: true });
            return this;
        }
        off(event, listener) {
            if (typeof event === 'string') {
                if (listener)
                    this.e.removeEventListener(event, listener);
                else {
                    let listeners = '_on' in this.e && this.e['_on'][event];
                    if (listeners) {
                        for (let l of listeners)
                            this.e.removeEventListener(event, l);
                        listeners.slice(0, listeners.length);
                    }
                }
            }
            else
                for (let i = 0; i < event.length; i++)
                    this.off(event[i], listener);
            return this;
        }
        try(action) {
            if (this.valid)
                action(this);
            return this;
        }
        when(selector, action) {
            if (this.valid && this.is(selector))
                action(this);
            return this;
        }
        do(callback) {
            callback(this);
            return this;
        }
        async(callback) {
            setTimeout(callback, 0, this);
            return this;
        }
        put(position, child) {
            switch (typeof child) {
                case 'object':
                    if (child)
                        if (child instanceof S ? (child = child.e) :
                            'render' in child ? (child = child.render().e) :
                                child instanceof Element)
                            this.e.insertAdjacentElement(position, child);
                        else if (!child)
                            break;
                        else if (inutil_1.isP(child))
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
        insertAfter(child) {
            return this.put('afterend', child);
        }
        insertBefore(child) {
            return this.put('beforebegin', child);
        }
        insertText(pos, text) {
            this.e.insertAdjacentText(pos, text);
            return this;
        }
        insertHTML(pos, html) {
            this.e.insertAdjacentHTML(pos, html);
            return this;
        }
        add(child) {
            return this.put(be, child);
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
            g(temp).put('afterend', child);
            return this;
        }
        lastChild() {
            let ch = this.e.children;
            return new S(ch[ch.length - 1]);
        }
        appendHTML(html) {
            return this.insertHTML(be, html);
        }
        set(child) {
            this.e.textContent = '';
            return this.put(be, child);
        }
        text(value) {
            if (value === undefined)
                return this.e.textContent;
            this.e.textContent = value;
            return this;
        }
        addTo(parent) {
            (parent instanceof S ? parent.e : parent)
                .appendChild(this.e);
            return this;
        }
        insertIn(position, parent) {
            (parent instanceof S ? parent.e : parent)
                .insertAdjacentElement(position, this.e);
            return this;
        }
        bind(prop, src, value) {
            throw "not implemented";
            return this;
        }
        html(value) {
            if (arguments.length) {
                this.e.innerHTML = value;
                return this;
            }
            return this.e.innerHTML;
        }
        fullHtml() { return this.e.outerHTML; }
        isEmpty() {
            return !this.e.hasChildNodes();
        }
        replace(child) {
            this.put('beforebegin', child);
            this.remove();
            return this;
        }
        rect() {
            return this.e.getBoundingClientRect();
        }
        focus(options) {
            this.e.focus(options);
            return this;
        }
        get focused() {
            return document.activeElement == this.e;
        }
        blur() {
            this.e.blur();
            return this;
        }
        focusin(handler) {
            let t = this.e;
            handler && this.on('focusin', e => t.contains(e.relatedTarget) || handler.call(t, e));
            return this;
        }
        focusout(handler) {
            let t = this.e;
            handler && this.on('focusout', e => t.contains(e.relatedTarget) || handler.call(t, e));
            return this;
        }
        contains(child) {
            return this.e.contains(child instanceof S ? child.e : child);
        }
        index() {
            var p = this.e.parentElement;
            if (p)
                return Array.prototype.indexOf.call(p.children, this.e);
            return -1;
        }
        indexInDocument() {
            var c = 0;
            var e = this[0];
            while (e && e.parentElement) {
                c += Array.prototype.indexOf.call(e.children, e);
                e = e.parentElement;
            }
            return c;
        }
        child(filter) {
            if (typeof filter === 'string') {
                let childs = this.e.children;
                for (let i = 0; i < childs.length; i++) {
                    let child = childs[i];
                    if (child.matches(filter))
                        return new S(child);
                }
                return S.empty;
            }
            else if (typeof filter === 'number') {
                let childs = this.e.children;
                return new S(childs[filter < 0 ? childs.length + filter : filter]);
            }
            else {
                return new S(this.e.firstElementChild);
            }
        }
        childByCls(cls) {
            if (cls)
                for (let i = 0; i < this.e.children.length; i++) {
                    let child = this.e.children.item(i);
                    if (child.classList.contains(cls))
                        return new S(child);
                }
            return S.empty;
        }
        childs(filter, to) {
            let childs = this.e.children;
            if (inutil_1.isS(filter)) {
                let t = [];
                for (let i = 0; i < childs.length; i++) {
                    let child = childs[i];
                    if (child.matches(filter))
                        t.push(child);
                }
                return new M(t);
            }
            else if (inutil_1.isN(filter)) {
                return new M(Array.prototype.slice.call(childs, filter, to));
            }
            else if (inutil_1.isF(filter))
                return new M(Array.from(childs).filter(c => filter(new S(c))));
            else {
                return new M(childs);
            }
        }
        childNodes() {
            return this.e.childNodes;
        }
        childCount() {
            return this.e.childElementCount;
        }
        query(filter) {
            return new S(this.e.querySelector(filter));
        }
        queryAll(filter) {
            return new M(this.e.querySelectorAll(filter));
        }
        parent() {
            return new S(this.e.parentElement);
        }
        inDOM() {
            return !!this.e.parentNode;
        }
        closest(cls) {
            if (typeof cls === 'string') {
                cls = '.' + cls;
                return new S(this.e.closest(cls));
            }
            else {
                let e = this.e;
                do {
                    if (cls.is(e)) {
                        return new S(e);
                    }
                } while (e = e.parentElement);
            }
        }
        parents(filter) {
            var l = [], p = this.e;
            while (p = p.parentElement)
                if (!filter || p.matches(filter))
                    l.push(p);
            return new M(l);
        }
        E(bubble = true, filter) {
            var e = this.e;
            if (bubble)
                do {
                    let c = e['$'];
                    if (c && (!filter || c instanceof filter))
                        return c;
                } while (e = e.parentElement);
            return e['$'] || null;
        }
        clone(deep) {
            return new S(this.e.cloneNode(deep));
        }
        next() {
            return new S(this.e.nextElementSibling);
        }
        prev() {
            return new S(this.e.previousElementSibling);
        }
        prop(props, value) {
            if (typeof props === 'string')
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
        tag() {
            return this.e.localName;
        }
        isInput() {
            return this.e.matches('input,textarea,select');
        }
        vScroll(value, type) {
            if (this.e.scroll)
                this.e.scroll({
                    top: value,
                    behavior: type
                });
            else
                this.e.scrollTop = value;
        }
        call(key, ...params) {
            return this.e[key].call(this.e, ...params);
        }
        css(csss, value) {
            if (inutil_1.isS(csss))
                this.e.style[csss] = value;
            else
                for (let css in csss)
                    this.e.style[css] = csss[css];
            return this;
        }
        getCss(property) {
            return this.e.style.getPropertyValue(property);
        }
        width(value) {
            if (value == null)
                return this.e.offsetWidth;
            this.e.style.width = `${value}px`;
            return this;
        }
        height(value) {
            if (value == null)
                return this.e.offsetHeight;
            this.e.style.height = `${value}px`;
            return this;
        }
        removeCss(properties) {
            for (let i = 0; i < properties.length; i++)
                this.e.style.removeProperty(properties[i]);
            return this;
        }
        clearCss() {
            this.e.removeAttribute('style');
            return this;
        }
        clearCls() {
            this.e.removeAttribute('class');
            return this;
        }
        cls(names, set) {
            this.e.classList[set === false ? 'remove' : 'add'].apply(this.e.classList, typeof names === 'string' ? names.trim().split(' ').filter(n => n) : names);
            return this;
        }
        toggleClass(names) {
            for (var n of names.split(' '))
                if (n !== '')
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
        is(filter) {
            if (filter instanceof Node || (filter instanceof S && (filter = filter.e)))
                return this.e == filter;
            else
                return this.e.matches(filter);
        }
        isCls(cls) {
            return this.e.classList.contains(cls);
        }
        data(data) {
            if (!arguments.length)
                return this.e['_d'];
            this.e['_d'] = data;
            return this;
        }
        remove() {
            this.e.remove();
            return this;
        }
        removeChild(index) {
            this.e.children[index].remove();
        }
    }
    S.empty = new S();
    g_1.S = S;
    class M extends Array {
        constructor(input, context) {
            if (input == null)
                super();
            else if (inutil_1.isN(input))
                super(input);
            else {
                let r;
                if (inutil_1.isS(input))
                    r = document.querySelectorAll(input);
                else if ('length' in input) {
                    r = [];
                    for (let i = 0; i < input.length; i++) {
                        let t = input[i];
                        if (t)
                            r.push(t instanceof S ? t.e : t);
                    }
                }
                else
                    throw "invalid input";
                super(...r);
            }
        }
        on(event, listener, options) {
            for (let i = 0; i < this.length; i++)
                this[i].addEventListener(event, listener, options);
            return this;
        }
        css(properties, important) {
            important = (important ? 'important' : '');
            for (let key in properties) {
                let value = properties[key];
                for (let i = 0; i < this.length; i++)
                    this[i].style.setProperty(key, value, important);
            }
            return this;
        }
        setClass(names, set) {
            for (let i = 0; i < this.length; i++)
                this[i].classList[set === false ? 'remove' : 'add'].apply(this[i].classList, names);
            return this;
        }
        prop(prop, value) {
            for (let i = 0; i < this.length; i++)
                this[i][prop] = value;
            return this;
        }
        query(filter) {
            for (let i = 0, l = this.length; i < l; i++) {
                let t = this[i];
                ;
                if (!t.matches(filter))
                    t = t.querySelector(filter);
                if (t)
                    return new S(t);
            }
            return S.empty;
        }
        each(callbackfn) {
            this.forEach((value, index) => callbackfn(new S(value), index));
            return this;
        }
        not(filter) {
            return this.filter((e) => !e.matches(filter));
        }
        remove() {
            for (let i = 0; i < this.length; i++)
                this[i].remove();
            return this;
        }
        child(filter) {
            let result;
            if (inutil_1.isS(filter)) {
                result = [];
                for (let i = 0; i < this.length; i++) {
                    let childs = this[i].children;
                    for (let j = 0; j < childs.length; j++) {
                        let child = childs[j];
                        if (child.matches(filter))
                            result.push(child);
                    }
                }
            }
            else if (inutil_1.isN(filter)) {
                result = Array(filter);
                for (let i = 0; i < this.length; i++)
                    result[i] = this[i].children[filter];
            }
            else {
                result = [];
                for (let i = 0; i < this.length; i++)
                    result.push.apply(result, this[i].children);
            }
            return new M(result);
        }
        push(...items) {
            for (let i = 0; i < items.length; i++) {
                let t = items[i];
                if (t instanceof S)
                    items[i] = t.e;
            }
            return super.push(...items);
        }
        toArray() {
            return this.map(t => new S(t));
        }
        find(filter, thisArgs) {
            if (typeof filter === 'string') {
                for (var i = 0, e = this.a; i < this.length; e = this[++i])
                    if (e.matches(filter))
                        return e;
            }
            else
                return super.find(filter, thisArgs);
        }
        static fromS(s) {
            return new M(s.filter(s => s).map(s => s.e));
        }
        static empty(length = 0) {
            return new M(new Array(length));
        }
    }
    g_1.M = M;
    function html(tag, props, child) {
        return g(document.createElementNS('http://www.w3.org/1999/xhtml', tag), props, child);
    }
    g_1.html = html;
    function xml(tag, props, child) {
        return g(document.createElementNS('http://www.w3.org/1999/xhtml', tag), props, child);
    }
    g_1.xml = xml;
    function svg(tag, attrs, child) {
        var result = new S(document.createElementNS('http://www.w3.org/2000/svg', tag));
        if (attrs) {
            if (typeof attrs === 'string')
                result.cls(attrs);
            else {
                if (attrs.on) {
                    result.onP(attrs.on);
                    attrs.on = undefined;
                }
                if (attrs.css) {
                    result.css(attrs.css);
                    attrs.css = undefined;
                }
                if (attrs.props) {
                    result.props(attrs.props);
                    attrs.props = undefined;
                }
                if (attrs.class) {
                    result.cls(attrs.class);
                    attrs.class = undefined;
                }
                for (let attr in attrs) {
                    let val = attrs[attr];
                    if (val != undefined)
                        result.attr(attr, val);
                }
            }
        }
        if (child || child === 0)
            result.add(child);
        return result;
    }
    g_1.svg = svg;
    function toSVG(text) {
        let parser = new DOMParser(), doc = parser.parseFromString(text, "image/svg+xml");
        return new S(doc.firstChild);
    }
    g_1.toSVG = toSVG;
    function wrap(child, props, tag) {
        if (typeof child === 'function')
            child = child();
        if (child instanceof E)
            child = child.render();
        else if (child instanceof Element)
            child = new S(child);
        else if (!(child instanceof S))
            child = g(tag || 'div', null, [child]);
        if (props)
            g(child, props);
        return child;
    }
    g_1.wrap = wrap;
    function get(input, context) {
        if (input) {
            if (typeof input === 'string') {
                if (context instanceof S)
                    context = context.e;
                return new S((context || document).querySelector(input));
            }
            if ((input instanceof E && (input = input.render())) || input instanceof S)
                return input;
        }
        else {
            return S.empty;
        }
    }
    g_1.get = get;
    function getAll(input, context) {
        return new M(input, context);
    }
    g_1.getAll = getAll;
    class Cls extends Array {
        push(...cls) {
            for (let t of cls) {
                if (t)
                    for (let t2 of inutil_1.isS(t) ? t.split(' ') : t)
                        if (t2)
                            super.push(t2);
            }
            return this.l;
        }
        tryAdd(cls) {
            if (!this.includes(cls))
                this.push(cls);
            return this;
        }
    }
    function cls(...cls) {
        let c = new Cls;
        if (cls.l)
            c.push(...cls);
        return c;
    }
    g_1.cls = cls;
    class EUpdate {
        constructor(values) {
            this.values = values;
        }
        has(key) {
            return key in this.values;
        }
        hasAny(keys) {
            for (let key of keys)
                if (key in this.values)
                    return true;
            return false;
        }
    }
    g_1.EUpdate = EUpdate;
    const be = 'beforeend';
})(g || (g = {}));
module.exports = g;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsbUNBQWlGO0FBT2pGLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFNLEVBQUUsTUFBTztJQUNqQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNyQyxDQUFDO0FBRUQsV0FBTyxHQUFDO0lBSU4sU0FBZ0IsQ0FBQyxDQUFDLE9BQWUsRUFBRSxLQUErQixFQUFFLEtBQU07UUFDeEUsSUFBSSxDQUFDLE9BQU87WUFBRSxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFFN0IsSUFBSSxNQUFNLEdBQ1IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDO1lBRTdCLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLE9BQU8sWUFBWSxPQUFPLENBQUMsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDaEIsUUFBUSxJQUFJLE9BQU8sQ0FBQyxDQUFDO29CQUNuQixPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztvQkFDbEIsT0FBTyxDQUFDO1FBRWhCLElBQUksS0FBSztZQUNQLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssWUFBWSxLQUFLO2dCQUNyRCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztnQkFDZixNQUFNLENBQUMsS0FBSyxDQUFNLEtBQUssQ0FBQyxDQUFBO1FBRS9CLElBQUksS0FBSyxJQUFJLElBQUk7WUFDZixNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixPQUFVLE1BQU0sQ0FBQztJQUNuQixDQUFDO0lBdEJlLEtBQUMsSUFz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