const { emit, off, on: h_on } = require("handler");
const { add, isF, isS, on, put, isSelection } = require("./s");
const g = (e, props, child) => {
  if (!e)
    return new S();
  let result = isS(e) ?
    new S(document.createElement(e)) :
    e instanceof Element ?
      new S(e) :
      'render' in e ?
        e.render() :
        e;
  if (props)
    if (isS(props) || Array.isArray(props))
      result.cls(props);
    else
      result.props(props);
  if (child != null)
    add(result.e, child);
  return result;
}
exports.create = exports.g = g;
exports.div = (props, child) => g("div", props, child);
exports.active = () => g(document.activeElement);
exports.clone = (obj) => {
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
    this.set(key, !this.i[key]);
  }
  clone() {
    return new this.constructor(this.i);
  }
  on(event, callback, options) {
    if (isF(event)) {
      callback = event;
      event = "set";
    }
    return h_on(this, event, callback, options);
  }
  onset(props, callback, options = {}) {
    options.check = isS(props) ?
      e => props in e : e => props.some(prop => prop in e);

    return h_on(this, "set", callback, options);
  }
  off(event, callback) {
    off(this, event, callback);
    return this;
  }
  emit(event, data) {
    emit(this, event, data);
    return this;
  }
  bind(element, handler, prop, noInit) {
    if ('render' in element) {
      this.bonds.push({ e: element, handler: handler, prop: prop });
      if (!noInit)
        handler.call(this, element, this.i);
      return element.render();
    } else {
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
exports.E = E;
class S {
  /** @param e {Element} */
  constructor(e) {
    this.e = e;
  }
  toJSON() { }
  get valid() { return !!this.e; }
  contains(child) {
    return this.e.contains(isSelection(child) ? child.e : child);
  }
  on(event, listener, options) {
    on(this.e, event, listener, options);
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
    put(this.e, position, child);
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
    add(this.e, child);
    return this;
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
    (parent instanceof S ? parent.e : parent)
      .appendChild(this.e);
    return this;
  }
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
    return new M(...this.e.querySelectorAll(filter));
  }
  parent() {
    return new S(this.e.parentElement);
  }
  closest(filter) {
    return new S(this.e.closest(filter));
  }
  parents(filter) {
    let l = [], p = this.e;
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

class M extends Array {
  constructor(...items) {
    super(...items.map(i => i instanceof S ? i.e : i));
  }
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
  child(m, filter) {
    let result;
    if (isS(filter)) {
      result = [];
      for (let i = 0; i < m.length; i++) {
        let childs = m[i].children;
        for (let j = 0; j < childs.length; j++) {
          let child = childs[j];
          if (child.matches(filter))
            result.push(child);
        }
      }
    }
    else if (typeof filter == "number") {
      result = Array(filter);
      for (let i = 0; i < m.length; i++)
        result[i] = m[i].children[filter];
    }
    else {
      result = [];
      for (let i = 0; i < m.length; i++)
        result.push.apply(result, m[i].children);
    }
    return result;
  }

}
exports.M = M;
exports.html = (tag, props, child) => {
  return g(document.createElementNS('http://www.w3.org/1999/xhtml', tag), props, child);
}
exports.xml = (tag, props, child) => {
  return g(document.createElementNS('http://www.w3.org/1999/xhtml', tag), props, child);
}
exports.svg = (tag, attrs, child) => {
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
exports.toSVG = (text) => {
  let parser = new DOMParser(), doc = parser.parseFromString(text, "image/svg+xml");
  return new S(doc.firstChild);
}
exports.wrap = (child, props, tag) => {
  if (isF(child)) child = child();
  if (child && isF(child.render)) child = child.render();
  else if (child instanceof Element)
    child = new S(child);
  else if (!(child instanceof S))
    child = g(tag || 'div', null, child);
  if (props)
    g(child, props);
  return child;
}
exports.get = (input, context) => {
  if (input) {
    if (isS(input)) {
      if (context instanceof S)
        context = context.e;
      return new S((context || document).querySelector(input));
    }
    if ((input instanceof E && (input = input.render())) || input instanceof S)
      return input;
  }
  else return new S
}
exports.getAll = (input, context) => {
  return new M(...(context || document).querySelectorAll(input));
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
exports.cl = (...cls) => {
  let c = new CL;
  if (cls.length)
    c.push(...cls);
  return c;
}
let _id = 0;
exports.id = () => 'i' + (_id++);
exports.clearEvent = (e) => {
  e.stopImmediatePropagation();
  e.preventDefault();
}