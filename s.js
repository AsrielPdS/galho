const
  isSelection = (value) => value && 'e' in value,
  g = (e, props, child) => {
    let result = isS(e) ? document.createElement(e) : e;
    if (props)
      if (isS(props))
        result.setAttribute("class", props);
      else
        result.classList.add(...props);
    if (child != null)
      add(result, child);
    return result;
  },
  isS = (value) => typeof value === 'string',
  isF = (value) => typeof value === 'function',
  put = (e, position, child) => {
    switch (typeof child) {
      case 'object':
        if (isSelection(child) ? child = child.e : child instanceof Element)
          e.insertAdjacentElement(position, child);
        else if (!child)
          break;
        else if (isF(child.render))
          put(e, position, child.render());
        else if (isF(child.then))
          child.then(c => put(e, position, c));
        else if (position[0] == 'a')
          for (let i = child.length - 1; i >= 0; i--)
            put(e, position, child[i]);
        else
          for (let i = 0, l = child.length; i < l; i++)
            put(e, position, child[i]);
        break;
      case 'string':
      case 'number':
      case 'bigint':
        e.insertAdjacentText(position, child);
        break;
      case 'function':
        put(e, position, child());
        break;
    }
  },
  add = (e, child) => {
    switch (typeof child) {
      case 'object':
        if (isSelection(child) ? child = child.e : child instanceof Element)
          e.append(child);
        else if (!child)
          break;
          else if (isF(child.render))
          add(e, child.render());
        else if (isF(child.then))
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
  },
  on = (e, event, listener, options) => {
    if (isS(event)) {
      if (listener)
        e.addEventListener(event, listener, options);
    }
    else if (Array.isArray(event)) {
      if (listener)
        for (let ev of event)
          e.addEventListener(ev, listener, options);
    }
    else
      for (let ev in event) {
        let t = event[ev];
        if (t)
          e.addEventListener(ev, t, listener);
      }
    return e;
  };

exports.isSelection = isSelection;
exports.g = g;
exports.isS = isS;
exports.isF = isF;
exports.put = put;
exports.add = add;
exports.on = on;

exports.css = (e, csss, value) => {
  let s = e.style;
  if (isS(csss))
    if (value === undefined)
      return s[csss];
    else
      s[csss] = value;
  else
    for (let css in csss)
      s[css] = csss[css];
  return e;
}
exports.div = (props, childs) => {
  return g("div", props, childs);
}
exports.delay = (e, event, delay, handler) => {
  handler = handler.bind(e);
  on(_(e), event, function (e) {
    var t = `_${event}_timer`;
    clearTimeout(this[t]);
    this[t] = setTimeout(handler, delay, e);
  });
  return e;
}
exports.one = (e, event, listener) => {
  if (isS(event))
    on(e, event, listener, { once: true });
  else
    on(e, event, { once: true });
  return e;
}
exports.frag = (e, child) => {
  let doc = new DocumentFragment();
  add(doc, child);
  e.append(doc);
  return e;
}
exports.bind = (e, prop, src, value) => {
  throw "not implemented";
  return e;
}
exports.focusin = (e, handler) => {
  let t = _(e);
  handler && on(t, 'focusin', e => t.contains(e.relatedTarget) || handler.call(t, e));
  return e;
}
exports.focusout = (e, handler) => {
  let t = _(e);
  handler && on(t, 'focusout', e => t.contains(e.relatedTarget) || handler.call(t, e));
  return e;
}
exports.index = (e) => {
  var p = e.parentElement;
  if (p)
    return Array.prototype.indexOf.call(p.children, e);
  return -1;
}
exports.indexInDocument = (e) => {
  let c = 0;
  while (e && e.parentElement) {
    c += Array.prototype.indexOf.call(e.children, e);
    e = e.parentElement;
  }
  return c;
}
exports.childByCls = (e, cls) => {
  if (cls)
    for (let i = 0; i < e.children.length; i++) {
      let child = e.children.item(i);
      if (child.classList.contains(cls))
        return child;
    }
  return null;
}
exports.count = (e) => {
  return e.childElementCount;
}
exports.fullHtml = (e) => { return _(e).outerHTML; }
exports.isEmpty = (e) => {
  return !_(e).hasChildNodes();
}
const _ = (e) => isSelection(e) ? e.e : e;
exports.rect = (e) => {
  return _(e).getBoundingClientRect();
}
exports.focused = (e) => {
  return document.activeElement == _(e);
}
exports.prevE = (e) => {
  return e.previousElementSibling;
}
exports.prev = (e) => {
  return e.previousSibling;
}
exports.parent = (e) => {
  return e.parentElement;
}
exports.text = (e) => {
  return e.textContent;
}
exports.last = (e) => {
  return e.lastChild;
}
exports.contains = (e, child) => {
  return _(e).contains(isSelection(child) ? child.e : child);
}
exports.inDOM = (e) => {
  return !!e.parentNode;
}
exports.tag = (e) => {
  return e.localName;
}
exports.isInput = (e) => {
  return _(e).matches('input,textarea,select');
}
exports.vScroll = (e, value, type) => {
  if ((e = _(e)).scroll)
    e.scroll({
      top: value,
      behavior: type
    });
  else
    e.scrollTop = value;
}
exports.width = (e) => {
  return _(e).offsetWidth;
}
exports.height = (e) => {
  return _(e).offsetHeight;
}
exports.is = (e, filter) => {
  e = _(e);
  return isS(filter) ? e.matches(filter) : _(filter) == e;
}
exports.isCls = (e, cls) => {
  return e.classList.contains(cls);
}
exports.when = (e, selector, action) => {
  if (e && is(e, selector))
    action(e);
  return e;
}
exports.putIn = (e, position, parent) => {
  (isSelection(parent) ? parent.e : parent)
    .insertAdjacentElement(position, e);
  return e;
}