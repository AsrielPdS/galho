"use strict";
function g(element, attrs, childs) {
    return g.g(element, attrs, childs);
}
(function (g_1) {
    function g(element, props, child) {
        if (!element)
            return S.empty;
        let result = typeof (element) === 'string' ?
            new S(document.createElement(element)) :
            element instanceof Element ?
                new S(element) :
                'render' in element ?
                    element.render() :
                    element;
        if (props)
            if (g_1.isS(props) || Array.isArray(props))
                result.cls(props);
            else
                result.props(props);
        if (child != null)
            add(result.e, child);
        return result;
    }
    g_1.g = g;
    g_1.div = (props, child) => g("div", props, child);
    function clone(obj) {
        if (typeof obj === 'object') {
            let nObj;
            if (obj instanceof Array) {
                nObj = Array(obj.length);
                for (let i = 0; i < obj.length; i++)
                    nObj[i] = clone(obj[i]);
            }
            else {
                nObj = {};
                for (let key in obj)
                    nObj[key] = clone(obj[key]);
            }
            obj = nObj;
        }
        return obj;
    }
    g_1.clone = clone;
    function deepExtend(obj, extension) {
        for (let key in extension) {
            let value2 = extension[key];
            if (obj[key] !== undefined) {
                let value1 = obj[key];
                if (value2 && value2.__proto__ == Object.prototype && value1 && value1.__proto__ == Object.prototype) {
                    deepExtend(value1, value2);
                }
            }
            else if (value2 && value2.__proto__ == Object.prototype)
                obj[key] = clone(value2);
            else
                obj[key] = value2;
        }
        return obj;
    }
    g_1.deepExtend = deepExtend;
    g_1.isS = (value) => typeof value === 'string';
    class ET {
        constructor() {
            this.__eh = {};
        }
        on(event, callback, options) {
            if (callback) {
                if (!(event in this.__eh)) {
                    this.__eh[event] = [];
                }
                if (options)
                    callback.options = options;
                this.__eh[event].push(callback);
            }
            return this;
        }
        off(event, callback) {
            if (event in this.__eh) {
                if (callback) {
                    var stack = this.__eh[event];
                    for (let i = 0, l = stack.length; i < l; i++) {
                        if (stack[i] === callback) {
                            stack.splice(i, 1);
                            return;
                        }
                    }
                }
                else
                    delete this.__eh[event];
            }
            return this;
        }
        emit(event, data) {
            let stack = this.__eh[event];
            if (stack && stack.length) {
                for (let i = 0, l = stack.length; i < l; i++) {
                    let e = stack[i];
                    if (e.options) {
                        if (e.options.once)
                            stack.splice(i--, 1);
                        if (e.options.delay) {
                            setTimeout(() => {
                                e.call(this, data);
                            }, e.options.delay);
                            continue;
                        }
                    }
                    if (e.call(this, data) === false)
                        return false;
                }
            }
            else
                return -1;
            return true;
        }
        trigger(event, data) {
            return this.emit(event, data);
        }
    }
    g_1.ET = ET;
    class E extends ET {
        constructor(dt) {
            super();
            this.bonds = [];
            if (!dt)
                dt = {};
            if (this.constructor.default)
                deepExtend(dt, this.constructor.default);
            this.i = dt;
        }
        get model() { return this.i; }
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
            let dt = this.i, binds = this.bonds;
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
                    for (let k in key) {
                        let val = key[k];
                        if (val === dt[k] || (this.validators && !this._valid(k, val)))
                            delete key[k];
                        else
                            dt[k] = val;
                    }
                    if (!Object.keys(key).length)
                        return this;
                }
                for (let i = 0; i < binds.length; i++) {
                    let bind = binds[i];
                    if (!bind.prop || bind.prop in key)
                        bind.handler.call(this, bind.e, key);
                }
            }
            else if (!key) {
                for (let i = 0; i < binds.length; i++) {
                    let bind = binds[i];
                    bind.handler.call(this, bind.e, dt);
                }
            }
            else {
                if (dt[key] === value || (this.validators && !this._valid(key, value)))
                    return this;
                let state = { [key]: value };
                dt[key] = value;
                for (let i = 0; i < binds.length; i++) {
                    let bind = binds[i];
                    if (!bind.prop || bind.prop === key)
                        bind.handler.call(this, bind.e, state);
                }
            }
            return this;
        }
        toggle(key) {
            this.set(key, !this.i[key]);
        }
        on(key, cb, opts) {
            if (typeof key == "function") {
                cb = key;
                key = "update";
            }
            return super.on(key, cb, opts);
        }
        clone() {
            return new this.constructor(this.i);
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
        inputBind(s, prop, fieldSet = 'value', fieldGet = fieldSet) {
            if (s instanceof S) {
                s.on('input', (e) => {
                    let v = e.target[fieldGet];
                    this.set(prop, v === '' || (typeof v === 'number' && isNaN(v)) ? null : v);
                });
                this.bind(s, () => {
                    var t = this.i[prop];
                    s.prop(fieldSet, t == null ? '' : t);
                }, prop);
                return s;
            }
            else {
                s.on('input', (value) => {
                    this.set(prop, value);
                });
                var view = s.render();
                this.bind(view, () => {
                    s.set(fieldSet, this.i[prop]);
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
    function add(e, child) {
        switch (typeof child) {
            case 'object':
                if (child)
                    if (child instanceof S ? (child = child.e) :
                        'render' in child ? (child = child.render().e) :
                            child instanceof Element)
                        e.append(child);
                    else if (!child)
                        break;
                    else if (typeof child.then == "function")
                        child.then(c => add(e, c));
                    else
                        for (let i = 0, l = child.length; i < l; i++)
                            add(e, child[i]);
                break;
            case 'string':
            case 'number':
            case 'bigint':
                e.append(child);
                break;
            case 'function':
                add(e, child());
                break;
        }
    }
    class S {
        constructor(e) {
            this.e = e;
        }
        toJSON() { }
        get valid() { return !!this.e; }
        on(event, listener, options) {
            if (g_1.isS(event)) {
                if (listener)
                    this.e.addEventListener(event, listener, options);
            }
            else if (Array.isArray(event)) {
                if (listener)
                    for (let e of event)
                        this.e.addEventListener(e, listener, options);
            }
            else
                for (let e in event) {
                    let t = event[e];
                    if (t)
                        this.e.addEventListener(e, t, listener);
                }
            return this;
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
        emit(event, init) {
            this.e.dispatchEvent(typeof event == "string" ? new Event(event, init) : event);
            return this;
        }
        trigger(a, b) {
            return this.emit(a, b);
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
            for (let e of g_1.isS(event) ? [event] : event)
                this.e.removeEventListener(e, listener);
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
        static is(value) { return value && 'e' in value; }
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
                        else if (typeof child.then == "function")
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
            add(this.e, child);
            return this;
        }
        frag(child) {
            let doc = new DocumentFragment();
            add(doc, child);
            this.e.append(doc);
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
            g(temp).put('afterend', child);
            return this;
        }
        lastChild() {
            let ch = this.e.children;
            return new S(ch[ch.length - 1]);
        }
        addHTML(html) {
            return this.putHTML("beforebegin", html);
        }
        set(child) {
            this.e.textContent = '';
            add(this.e, child);
            return this;
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
        putIn(position, parent) {
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
            if (g_1.isS(filter)) {
                let t = [];
                for (let i = 0; i < childs.length; i++) {
                    let child = childs[i];
                    if (child.matches(filter))
                        t.push(child);
                }
                return new M(t);
            }
            else if (typeof filter == "number") {
                return new M(Array.prototype.slice.call(childs, filter, to));
            }
            else if (typeof filter == "function")
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
            if (g_1.isS(csss))
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
        uncss(properties) {
            if (properties)
                for (let i = 0; i < properties.length; i++)
                    this.e.style.removeProperty(properties[i]);
            else
                this.e.removeAttribute('style');
            return this;
        }
        removeCss(properties) {
            return this.uncss(properties);
        }
        uncls() {
            this.e.removeAttribute('class');
            return this;
        }
        cls(names, set) {
            this.e.classList[set === false ? 'remove' : 'add'].apply(this.e.classList, typeof names === 'string' ? names.trim().split(' ').filter(n => n) : names);
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
        is(filter) {
            if (filter instanceof Node || (filter instanceof S && (filter = filter.e)))
                return this.e == filter;
            else
                return this.e.matches(filter);
        }
        isCls(cls) {
            return this.e.classList.contains(cls);
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
            else if (typeof input == "number")
                super(input);
            else {
                let r;
                if (g_1.isS(input))
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
        cls(names, set) {
            typeof names == "string" && (names = names.split(' ').filter(v => v));
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
            if (g_1.isS(filter)) {
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
            else if (typeof filter == "number") {
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
                for (var i = 0, e = this[0]; i < this.length; e = this[++i])
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
        var s = new S(document.createElementNS('http://www.w3.org/2000/svg', tag));
        if (attrs)
            if (g_1.isS(attrs) || Array.isArray(attrs))
                s.cls(attrs);
            else
                s.attrs(attrs);
        if (child || child === 0)
            s.add(child);
        return s;
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
    class CL extends Array {
        push(...cls) {
            for (let t of cls) {
                if (t)
                    for (let t2 of g_1.isS(t) ? t.split(' ') : t)
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
    g_1.cl = cl;
    function css(selector, tag) {
        let r = "";
        for (let k in selector)
            r += css.parse(k, selector[k]);
        return tag ? tag.add(r) : g("style").text(r).addTo(document.head);
    }
    g_1.css = css;
    (function (css) {
        const subs = [">", " ", ":", "~", "+"];
        css.defSub = ">";
        function sub(parent, child) {
            return child.split(',').map(s => {
                let t = s[0];
                return parent.map(p => {
                    if (t == "&")
                        return p + s.slice(1);
                    else if (subs.indexOf(t) == -1)
                        return p + css.defSub + s;
                    else
                        return p + s;
                }).join(',');
            }).join(',');
        }
        css.sub = sub;
        function parse(selector, props) {
            let r = "", subSel = "", split;
            for (let key in props) {
                let val = props[key];
                if (val || val === 0) {
                    if (typeof val == "object") {
                        subSel += parse(sub(split || (split = selector.split(',')), key), val);
                    }
                    else
                        r += key.replace(regex, m => "-" + m) + ":" + val + ";";
                }
            }
            return (r ? selector + "{" + r + "}" : "") + subSel;
        }
        css.parse = parse;
        const regex = /[A-Z]/g;
    })(css = g_1.css || (g_1.css = {}));
    let _id = 0;
    g_1.id = () => 'i' + (_id++);
})(g || (g = {}));
Event.prototype.off = function () {
    this.stopImmediatePropagation();
    this.preventDefault();
};
module.exports = g;
//# sourceMappingURL=galho.js.map