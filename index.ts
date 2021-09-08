////import * as _ from "./util";
import { Properties } from "csstype";

function g<K extends keyof HTMLElementTagNameMap>(element: K, props?: Partial<HTMLElementTagNameMap[K]> | string | string[] | 0, childs?): g.S<HTMLElementTagNameMap[K]>;
function g<T extends g.ANYElement = HTMLElement>(element: g.Create, props?: Partial<T> | string | string[] | 0, childs?): g.S<T>;
function g(element: any, attrs?: any, childs?: any): g.S {
  return g.g(element, attrs, childs);
}

module g {
  type num = number;
  type str = string;
  type bool = boolean;
  interface Dic<T = any> { [key: string]: T; }

  export function g<K extends keyof HTMLElementTagNameMap>(element: K, props?: Partial<HTMLElementTagNameMap[K]> | string | string[] | 0, childs?): g.S<HTMLElementTagNameMap[K]>;
  export function g<T extends g.ANYElement = HTMLElement>(element: g.Create, props?: Partial<T> | string | string[] | 0, childs?): g.S<T>;
  export function g(element: Create, props?: string | string[] | Dic, child?/*: Child*/): S {
    if (!element) return S.empty;

    var result =
      typeof (element) === 'string' ?
        //element.indexOf('-') ? element.f :
        new S(document.createElement(element)) :
        element instanceof Element ?
          new S(element) :
          'render' in element ?
            element.render() :
            element;

    if (props)
      if (typeof props === 'string' || props instanceof Array)
        result.cls(props);
      else result.props(<Dic>props)

    if (child != null)
      result.put(be, child);

    return <S>result;
  }

  export function clone<T extends Object>(obj: T): T {
    if (typeof obj === 'object') {
      let nObj: any;
      if (obj instanceof Array) {
        nObj = Array(obj.length);
        for (let i = 0; i < obj.length; i++)
          nObj[i] = clone(obj[i]);
      } else {
        nObj = {};
        for (let key in obj)
          nObj[key] = clone(obj[key]);
      }
      obj = nObj;
    }
    return obj;
  }
  export function deepExtend<T extends object, U extends object>(obj: T, extension: U): T & U {
    for (let key in extension) {
      let value2 = extension[<string>key];

      if (obj[<string>key] !== undefined) {
        let value1 = obj[<string>key];
        if (value2 && value2.__proto__ == Object.prototype && value1 && value1.__proto__ == Object.prototype) {
          deepExtend(value1, value2);
        }
      } else if (value2 && value2.__proto__ == Object.prototype)
        obj[<string>key] = clone(value2);
      else obj[<string>key] = value2;

    }
    return <any>obj;
  }
  export const isS = (value: unknown): value is string => typeof value === 'string';
  // #region core
  export interface EventListenerOptions {
    delay?: num,
    once?: bool,
    passive?: bool;
  }
  export type EventTargetCallback<T, E = any> = ((this: T, e: E) => any) & { options?: EventListenerOptions; };
  /**event target */
  export class ET<T extends Dic = Dic> {
    /**event handlers */
    readonly __eh: Dic<EventTargetCallback<this>[]> = {};

    on<K extends keyof T>(event: K, callback: EventTargetCallback<this, T[K]>, options?: EventListenerOptions): this {
      if (callback) {
        if (!(event in this.__eh)) {
          this.__eh[<any>event] = [];
        }
        if (options)
          callback.options = options;

        this.__eh[<any>event].push(callback);
      }
      return this;
    }

    off<K extends keyof T>(event: K, callback?: EventTargetCallback<this, T[K]>) {
      if (event in this.__eh) {

        if (callback) {
          var stack = this.__eh[<any>event];
          for (let i = 0, l = stack.length; i < l; i++) {
            if (stack[i] === callback) {
              stack.splice(i, 1);
              return;
            }
          }
        } else delete this.__eh[<any>event];
      }
      return this;
    }

    trigger<K extends keyof T>(event: K, data?: T[K]) {
      let stack = this.__eh[<any>event];
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
      } else return -1;
      return true;
    }
  }
  export abstract class E<M = {}, Events extends Dic = {}> extends ET<Events & { update: Partial<M>; }> implements Render {
    dt: M;
    /**@deprecated */
    get model() { return this.dt; }

    /** Content rendered, filled when render is called*/
    $: S;
    protected static default: any;
    private bonds: Array<Bind<this, M, any>> = [];
    validators: Dic<Array<(value, field) => boolean | void>>;

    constructor(dt?: M) {
      super();
      if (!dt) dt = <any>{};

      if ((<typeof E>this.constructor).default)
        deepExtend(<any>dt, (<typeof E>this.constructor).default);

      this.dt = dt;
    }
    protected abstract view(): One<ANYElement>;

    /** */
    focus() {
      this.$.focus();
      return this;
    }
    /** */
    render(): S {
      if (this.$ === void 0) {
        let view = <One<any>>this.view();
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

    /**remove all bind and element then recreate element*/
    reRender(): S {
      this.dispose();
      return this.render();
    }

    removeKey(key: string | string[]) {
      if (typeof key == 'string')
        delete this.dt[key];
      return this;
    }


    addValidators<K extends keyof M>(field: K, validator: (value: M[K], field: K) => boolean | void) {
      ((this.validators ||= {})[<str>field] ||= []).push(validator);
      return this;
    }

    /**
     * if false block update of this field
     * @param key
     * @param value
     */
    private _valid(key: string, value) {
      let temp = this.validators[key];

      if (temp)
        for (let i = 0; i < temp.length; i++)
          //se apenas um retornar falso return false;
          if (!temp[i](value, key))
            return false;

      return true;
    }
    /**rebind entiry E */
    update(): this;
    /**
     * 
     * @param key
     */
    update<K extends keyof M>(key: K[]): this;
    /**
     * 
     * @param key
     * @param value
     */
    update<K extends keyof M>(key: K, value: Pick<M, K>): this;
    update<K extends keyof M>(key: K, value: M[K]): this;
    /**
     * 
     * @param values
     */
    update(values: Partial<M>): this;
    update(key?: string | Partial<M> | string[], value?) {
      let dt = this.dt, binds = this.bonds;
      if (typeof key == "object") {
        if (Array.isArray(key)) {
          let t: Partial<M> = {};
          for (let i = 0; i < key.length; i++) {
            let t2 = key[i]
            t[t2] = dt[t2];
          }
          key = t;
        } else {
          for (let k in key) {
            let val = key[k];
            if (val === dt[k] || (this.validators && !this._valid(k, val)))
              delete key[k];
            else dt[k] = val;
          }
          if (!Object.keys(key).length) return this;
        }
        for (let i = 0; i < binds.length; i++) {
          let bind = binds[i];
          if (!bind.prop || bind.prop in key)
            bind.handler.call(this, bind.e, key);
        }

      } else if (!key) {
        // event = new EUpdate(dt);
        for (let i = 0; i < binds.length; i++) {
          let bind = binds[i];
          bind.handler.call(this, bind.e, dt);
        }
      } else {
        if (dt[key] === value || (this.validators && !this._valid(key, value)))
          return this;

        let state = { [key]: value };
        dt[key] = value;

        // event = new EUpdate(state);
        for (let i = 0; i < binds.length; i++) {
          let bind = binds[i];
          if (!bind.prop || bind.prop === key)
            bind.handler.call(this, bind.e, state);
        }
        //key = state;
      }

      // this.trigger('update', <any>event);
      return this;
    }

    toggle(key: keyof M) {
      this.update(key, <any>!this.dt[key]);
    }
    clone(): this {
      return new (<any>this.constructor)(this.dt);
    }


    /**
     * 
     * @param e
     * @param handler
     * @param prop
     */
    bind<K extends keyof M, R extends Render>(e: R, handler: BindHandler<this, M, R>, prop?: K, noInit?: boolean): S;
    /**
     * 
     * @param s
     * @param handler
     * @param prop
     */
    bind<K extends keyof M, T extends ANYElement>(s: S<T>, handler: BindHandler<this, M, S<T>>, prop?: K, noInit?: boolean): S<T>;
    bind(element: Render | S, handler: BindHandler<this, M, any>, prop?: string, noInit?: boolean) {
      if ('render' in element) {
        this.bonds.push({ e: element, handler: handler, prop: prop });
        if (!noInit)
          handler.call(this, element, this.dt);
        return element.render();
      } else {
        this.bonds.push({ e: element, handler: handler, prop: prop });
        if (!noInit)
          handler.call(this, element, this.dt);
        return element;
      }
    }
    /**
    * 
    * @param element Elemento onde sera feito o bind
    * @param src propiedade do model que sera feito o bind
    * @param target propiedade no bind onde se retirara o dado
    */
    inputBind<K extends keyof M>(element: E<any, { input: unknown }>, src: K, target?: string): S;
    /**
     * 
     * @param element Elemento onde sera feito o bind
     * @param prop propiedade do model que sera feito o bind
     * @param fieldSet propiedade no bind onde se retirara o dado 
     * @param fieldGet propiedade no bind onde sera reposto o dado
     */
    inputBind<K extends keyof M>(element: S<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, prop: K, fieldSet?: string, fieldGet?: string): S;
    inputBind(s: S | E<any, { input: unknown }>, prop: string, fieldSet: string = 'value', fieldGet = fieldSet) {
      if (s instanceof S) {
        //s.prop(fieldSet, this.model[prop] || '');
        s.on('input', (e) => {
          let v = e.target[fieldGet];
          this.update(<any>prop, v === '' || (typeof v === 'number' && isNaN(v)) ? null : v);
        });
        this.bind(s, () => {
          //if (reloading)
          //  reloading = false;
          //else {
          var t = this.dt[prop];
          s.prop(fieldSet, t == null ? '' : t);
          //}
        }, <any>prop);

        return s;
      } else {
        //let _this = this;
        //s.update(<any>fieldGet, this.model[prop]);
        s.on('input', (value) => {
          this.update(<any>prop, <any>value);
        });
        //s.on('update', (model: EUpdate) => {
        //  if (model.has(fieldSet)) {
        //    if (reloading) {
        //      reloading = false;
        //    } else {
        //      this.update(<any>prop, model.values[fieldSet]);
        //      reloading = true;
        //    }
        //  }
        //});

        var view = s.render();
        //this.on('update', (e) => {
        //  if(e.has(''))
        //});
        this.bind(view, () => {
          //if (reloading) {
          //  reloading = false;
          //} else {
          //  let t = this.model[prop];
          //  if (t !== s.model[fieldSet]) {
          //    reloading = true;
          s.update(<any>fieldSet, this.dt[prop]);
          //}
          //}

        }, <any>prop);
        return view;
      }
    }

    unbind(s: One) {
      var i = this.bonds.findIndex((b) => (<S>b.e).e == (<S>s).e || s == b.e);
      if (i != -1)
        this.bonds.splice(i, 1);
    }
    /**element by serialize to json*/
    private toJSON() { }
  }

  /**Macro document Single Selection, Manipulate only one element per time */
  export class S<T extends ANYElement = HTMLElement> {
    constructor();
    constructor(e: T);
    constructor(e: EventTarget);
    constructor(public readonly e?: T) { }
    toJSON() { }
    get valid() { return !!this.e; }
    //events
    on(actions: HTMLEventMap<T>, options?: AddEventListenerOptions): this;
    on(actions: SVGEventMap<T>, options?: AddEventListenerOptions): this;
    on<K extends keyof HTMLElementEventMap>(action: K, listener: (this: T, e: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions): this;
    on<K extends keyof SVGElementEventMap>(action: K, listener: (this: T, e: SVGElementEventMap[K]) => any, options?: AddEventListenerOptions): this;
    on<T extends Element = Element, E extends Event = Event>(action: string, fn: EventHandler<T, E>, options?: AddEventListenerOptions): this;
    on<K extends keyof HTMLElementEventMap>(action: K[], listener: (this: T, e: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions): this;
    on(event: string | string[] | HTMLEventMap<T> | SVGEventMap<T>, listener?, options?: AddEventListenerOptions) {
      let on: Dic = this.e['_on'] || (this.e['_on'] = {});
      if (isS(event)) {
        if (listener) {
          (on[event] || (on[event] = [])).push(listener);

          this.e.addEventListener(event, listener, options);
        }
      } else if (Array.isArray(event)) {
        for (let e of event) {
          (on[e] || (on[e] = [])).push(listener);
          this.e.addEventListener(e, listener, options);
          //this.on(e, listener, options);
        }

      } else for (let e in event) {
        let t = event[e];
        if (t) {
          (on[e] || (on[e] = [])).push(t);
          this.e.addEventListener(e, t, listener);
        }
      }
      //this.on(e, event[e], listener);
      return this;
    }

    /**
     * on passive -> add passive listener(event)
     * @param actions
     */
    onP(actions: HTMLEventMap<T>): this;
    onP(actions: SVGEventMap<T>): this;
    onP<K extends keyof HTMLElementEventMap>(action: K, listener: (this: HTMLElement, e: HTMLElementEventMap[K]) => any): this;
    onP<K extends keyof SVGElementEventMap>(action: K, listener: (this: SVGElement, e: SVGElementEventMap[K]) => any): this;
    onP<T extends Element = Element, E extends Event = Event>(action: string, fn: EventHandler<T, E>): this;
    onP<T extends Element = Element, E extends Event = Event>(action: string, fn: EventHandler<T, E>): this;
    onP(event, listener?) {
      return this.on(event, listener, { passive: true });
    }

    /**
     * Add One(evento que so executa no maximo uma vez) Passive Listener 
     * @param event
     * @param listener
     */
    aopl(event, listener) {
      return this.on(event, listener, {
        passive: true,
        once: true
      });
    }
    //delay(actions: Dic<(this: T, e: Event) => any>): this;
    delay<K extends keyof HTMLElementEventMap>(action: K, delay: number, listener: (this: T, e: HTMLElementEventMap[K]) => any): this;
    delay<K extends keyof SVGElementEventMap>(action: K, delay: number, listener: (this: T, e: SVGElementEventMap[K]) => any): this;
    delay<E extends Event = Event>(action: string, delay: number, fn: EventHandler<T, E>): this;
    delay(event, delay?, handler?: (a?, b?, c?) => any) {
      handler = handler.bind(this.e);
      this.on(event, function (e: E) {
        var t = `_${event}_timer`;
        clearTimeout(this[t]);
        this[t] = setTimeout(handler, delay);
      });
      return this;
    }

    trigger(name: string, event = new Event(name)) {
      this.e.dispatchEvent(event);
      return this;
    }
    click() {
      (<HTMLElement>this.e).click();
      return this;
    }
    one(actions: HTMLEventMap<T>): this;
    one(actions: SVGEventMap<T>): this;
    one<K extends keyof HTMLElementEventMap>(action: K, listener: (this: HTMLElement, e: HTMLElementEventMap[K]) => any): this;
    one<K extends keyof SVGElementEventMap>(action: K, listener: (this: SVGElement, e: SVGElementEventMap[K]) => any): this;
    one(action: string, listener: (this: Element, e: Event) => any): this;
    one(event, listener?) {
      if (typeof event == 'string')
        this.on(event, listener, { once: true });
      else this.on(event, { once: true });
      return this;
    }

    /**
     * 
     * @param event
     */
    off<K extends keyof HTMLElementEventMap>(event: K | K[]): this;

    /**
     * 
     * @param event
     * @param listener
     */
    off<K extends keyof HTMLElementEventMap>(event: K | K[], listener: EventListener): this;
    ///**
    // * 
    // * @param event
    // * @param listener
    // */
    //off(event: string | string[], listener: Function): this;
    off(event: string | string[], listener?) {
      if (typeof event === 'string') {
        if (listener)
          this.e.removeEventListener(event, listener);
        else {
          let listeners: Array<EventListener> = '_on' in this.e && this.e['_on'][event];
          if (listeners) {
            for (let l of listeners)
              this.e.removeEventListener(event, l);
            listeners.slice(0, listeners.length);
          }
        }
      } else for (let i = 0; i < event.length; i++)
        this.off(event[i] as any, listener);

      return this;
    }

    /**
     * executa a ação se o elemento for valido
     * @param action
     */
    try<T>(action: (e: this) => T) {
      if (this.valid)
        action(this);

      return this;
    }
    when<T>(selector: string, action: (e: this) => T) {
      if (this.valid && this.is(selector))
        action(this);

      return this;
    }
    do(callback: (e: this) => any) {
      callback(this);
      return this;
    }
    async(callback: (e: this) => any) {
      setTimeout(callback, 0, this);
      return this;
    }

    static empty = new S<any>();

    put(position: InsertPosition, child): this {
      switch (typeof child) {
        case 'object':
          if (child)
            if (
              child instanceof S ? (child = child.e) :
                'render' in child ? (child = child.render().e) :
                  child instanceof Element)
              this.e.insertAdjacentElement(position, <Element>child);

            else if (!child) break;
            else if (typeof child.then == "function")
              child.then(c => this.put(position, c));
            //if 'afterbegin' or 'afterend' insert from last to first to mantain order;
            else if (position[0] == 'a')
              for (let i = (<ArrayLike<any>>child).length - 1; i >= 0; i--)
                this.put(position, child[i]);
            else for (let i = 0, l = (<ArrayLike<any>>child).length; i < l; i++)
              this.put(position, child[i]);
          break;
        case 'string':
        case 'number':
        case 'bigint':
          this.e.insertAdjacentText(position, <string>child);
          break;
        case 'function':
          this.put(position, child());
          break;
      }
      return this;
    }
    insertAfter(child/*: Child*/): this {
      return this.put('afterend', child);
    }
    insertBefore(child/*: Child*/): this {
      return this.put('beforebegin', child);
    }

    insertText(pos: InsertPosition, text: string | number) {
      this.e.insertAdjacentText(pos, <any>text);
      return this;
    }
    insertHTML(pos: InsertPosition, html: string) {
      this.e.insertAdjacentHTML(pos, html);
      return this;
    }

    /**
     * Append element and return them
     * @param element
     */
    add(child/*: Child*/): this {
      return this.put(be, child);
    }
    /**
     * Append element in begin
     * @param element
     */
    prepend(child/*: Child*/): this {
      return this.put('afterbegin', child);
    }

    /**
     * 
     * @param child
     * @param index zero based index
     */
    place(index: number, child/*: Child*/): this {
      if (!index)
        return this.put('afterbegin', child);

      var temp = this.e.children[index - 1];
      if (!temp)
        throw "out of flow";

      //var t2 = bind.s.child(pos - 1);
      g(temp).put('afterend', child);
      return this;
    }
    lastChild() {
      let ch = this.e.children;
      return new S(ch[ch.length - 1]);
    }
    /**
     * this method is not aconselhavel use append when possible
     * @param html
     */
    appendHTML(html: string) {
      return this.insertHTML(be, html);
    }

    /**
     * clear element and insert the child
     * @param child
     */
    set(child?/*: Child*/): this {
      this.e.textContent = '';
      return this.put(be, child);
    }


    text(): string;
    text(text: number | string): this;
    text(value?: number | string): this | string {
      if (value === undefined) return this.e.textContent;
      this.e.textContent = <any>value;
      return this;
    }

    addTo(parent: Element | S) {
      (parent instanceof S ? parent.e : parent)
        .appendChild(this.e);

      return this;
    }
    insertIn(position: InsertPosition, parent: Element | S) {
      (parent instanceof S ? parent.e : parent)
        .insertAdjacentElement(position, this.e);

      return this;
    }
    bind<M>(prop: keyof T, src: E<M>, field: keyof M): this;
    bind<M>(prop: keyof T, src: E<M>, expression: string): this;

    bind<U extends ANYElement>(prop: keyof T, src: S<U>, field: keyof U): this;
    bind(prop: keyof T, src: S<any>, expression: string): this;


    bind<U extends Object>(prop: keyof T, src: U, field: keyof U): this;
    bind(prop: keyof T, src: Object, expression: string): this;

    bind(prop, src, value?) {
      throw "not implemented";
      return this;
    }
    html(): string;
    html(content: string): this;
    html(value?: string): this | string {
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
    /**
     * replace selected element with new elements
     * @param val
     */
    replace(child/*: Child*/) {
      this.put('beforebegin', child);
      this.remove();
      //this.e.replaceWith((child instanceof E ? child.render() : child).e);
      //this.insert('beforebegin', e);
      //this.remove();
      return this;
    }

    rect() {
      return this.e.getBoundingClientRect();
    }

    focus(options?: FocusOptions) {
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
    focusin(handler?: (e: FocusEvent) => any) {
      let t = this.e;
      handler && this.on('focusin', e => t.contains(<Node>e.relatedTarget) || handler.call(t, e));
      return this;
    }
    focusout(handler?: (e: FocusEvent) => any) {
      let t = this.e;
      handler && this.on('focusout', e => t.contains(<Node>e.relatedTarget) || handler.call(t, e));
      return this;
    }
    contains(child: S | Node) {
      return this.e.contains(child instanceof S ? child.e : child);
    }
    //Data
    ////data(key: string, value: any): E
    ////data<T>(key: string): T;
    ////data(key: string): any;
    ////removeData(key: string): E;

    //Document walk

    /** */
    index(): number {
      var p = this.e.parentElement;
      if (p)
        return Array.prototype.indexOf.call(p.children, this.e);
      return -1;
    }

    /** */
    indexInDocument(): number {
      var c = 0;
      var e = this[0];
      while (e && e.parentElement) {
        c += Array.prototype.indexOf.call(e.children, e);
        e = e.parentElement;
      }
      return c;
    }

    /**get fisrt element child */
    child<U extends ANYElement = ANYElement>(): S<U>;
    /**get child at especific index */
    child(index: number): S;
    child<K extends keyof HTMLElementTagNameMap>(filter: K): S<HTMLElementTagNameMap[K]>;
    child(filter: string): S;
    child(filter?: string | number) {
      if (typeof filter === 'string') {
        let childs = this.e.children;
        for (let i = 0; i < childs.length; i++) {
          let child = childs[i];
          if (child.matches(filter))
            return new S(child);
        }
        return S.empty;
      } else if (typeof filter === 'number') {
        let childs = this.e.children;
        return new S(childs[filter < 0 ? childs.length + filter : filter]);
      } else {
        return new S(this.e.firstElementChild);
      }
    }
    childByCls(cls: string): S {
      if (cls)
        for (let i = 0; i < this.e.children.length; i++) {
          let child = this.e.children.item(i);
          if (child.classList.contains(cls))
            return new S(child);
        }

      return S.empty;
    }
    childs(): M;
    childs<T extends ANYElement = ANYElement>(from: number, to?: number): M<T>;
    childs<K extends keyof HTMLElementTagNameMap>(filter: K): M<HTMLElementTagNameMap[K]>;
    childs<T extends ANYElement = HTMLElement>(filter: string): M<T>;
    childs<T extends ANYElement = HTMLElement>(filter: (child: S) => boolean): M<T>;
    childs(filter?: ((child: S) => boolean) | string | number, to?: number) {
      let childs = this.e.children;
      if (isS(filter)) {
        let t = [];
        for (let i = 0; i < childs.length; i++) {
          let child = childs[i];
          if (child.matches(filter))
            t.push(child);
        }
        return new M(t);
      } else if (typeof filter == "number") {
        return new M<T>(Array.prototype.slice.call(childs, filter, to));
      } else if (typeof filter == "function")
        return new M<any>(Array.from(childs).filter(c => filter(new S(<any>c))));
      else {
        return new M<any>(childs);
      }
    }

    childNodes() {
      return this.e.childNodes;
    }
    childCount() {
      return this.e.childElementCount;
    }
    query<K extends keyof HTMLElementTagNameMap>(filter: K): S<HTMLElementTagNameMap[K]>;
    query<U extends HTMLElement | SVGElement = HTMLElement>(filter: string): S<U>;
    query<U extends HTMLElement | SVGElement = HTMLElement>(filter: string) {
      return new S<U>(this.e.querySelector(filter));
    }
    queryAll<K extends keyof HTMLElementTagNameMap>(filter: K): M<HTMLElementTagNameMap[K]>;
    queryAll<U extends HTMLElement | SVGElement = HTMLElement>(filter: string): M<U>
    queryAll<U extends HTMLElement | SVGElement = HTMLElement>(filter: string) {
      return new M<U>(<ArrayLike<U>>this.e.querySelectorAll(filter));
    }

    parent() {
      return new S(this.e.parentElement);
    }
    inDOM() {
      return !!this.e.parentNode;
    }

    closest(cls: string): S;
    closest(parent: S): S;
    closest(cls: string | S) {
      if (typeof cls === 'string') {
        cls = '.' + cls;
        return new S(this.e.closest(cls));
      } else {
        let e = this.e as HTMLElement;
        do {
          if (cls.is(e)) {
            return new S(e);
          }
        } while (e = e.parentElement);
      }
    }

    parents(filter: string) {
      var l = [],
        p = this.e;
      while (p = <any>p.parentElement)
        if (!filter || p.matches(filter))
          l.push(p);
      return new M(l);
    }

    /**
     * get the controller of element of this item or the first ancester that is controlled if bubble is true
     * @param filter
     * @param bubble
     */
    E<T = unknown>(bubble: boolean = true, filter?: { new(...args: any[]): T }): T {
      var e = this.e;

      if (bubble)
        do {
          let c = e['$'];
          if (c && (!filter || c instanceof filter))
            return c;
        } while (e = <any>e.parentElement);

      return e['$'] || null;
    }

    clone(): S;
    clone(deep: boolean): S;
    clone(deep?: boolean) {
      return new S(<Element>this.e.cloneNode(deep));
    }

    next() {
      return new S(this.e.nextElementSibling);
    }

    prev() {
      return new S(this.e.previousElementSibling);
    }

    //properties manipulation
    prop<K extends keyof T>(key: K): T[K];
    prop<T = any>(key: string): T;
    prop<K extends keyof T>(key: K, value: T[K]): this;
    prop(key: string, value): this;
    prop(props: string, value?: unknown) {
      if (typeof props === 'string')
        if (arguments.length == 1) {
          return this.e[props];
        } else this.e[props] = value;

      return this;
    }
    //properties manipulation
    props(props: Partial<T>): this;
    props(props: Dic): this;
    props(props: Partial<T>) {
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
    vScroll(value: number, type?: ScrollBehavior) {
      if (this.e.scroll)
        this.e.scroll({
          top: value,
          behavior: type
        });
      else this.e.scrollTop = value;
    }

    call<K extends keyof T>(key: K, ...params: any[]) {
      return (<Function>this.e[<any>key]).call(this.e, ...params);
    }

    /**
     * 
     * @param property
     * @param value
     * @param important
     */
    css<T extends keyof Properties>(property: T, value: Properties[T]): this;
    /**
     * 
     * @param styles
     */
    css(styles: Properties): this;

    css(csss: Properties | string, value?): this {
      if (isS(csss))
        this.e.style[csss] = value as string;

      else for (let css in csss)
        this.e.style[css] = <string>csss[css];

      return this;
    }
    getCss(property: string) {
      return this.e.style.getPropertyValue(property);
    }
    width(): number;
    width(value: number): this;
    width(value?: number) {
      if (value == null)
        return (<HTMLElement>this.e).offsetWidth;

      this.e.style.width = `${value}px`;
      return this;
    }

    height(): number;
    height(value: number): this;
    height(value?: number) {
      if (value == null)
        return (<HTMLElement>this.e).offsetHeight;

      this.e.style.height = `${value}px`;
      return this;
    }
    /**
     * remove inline style
     * @param properties
     */
    removeCss(properties: Array<string>) {
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
      //var cls = this.e.classList;
      //while (cls.length)
      //  cls.remove(cls.item(0));
      return this;
    }
    /**
     * 
     * @param names
     */
    cls(names: string | string[]): this;
    /**
     * 
     * @param names
     * @param set
     */
    cls(names: string | string[], set: boolean): this;
    cls(names: string | string[], set?: boolean) {
      this.e.classList[set === false ? 'remove' : 'add'].apply(this.e.classList, typeof names === 'string' ? names.trim().split(' ').filter(n => n) : names);
      return this;
    }

    toggleClass(names: string) {
      for (var n of names.split(' '))
        if (n !== '')
          this.e.classList.toggle(n.replace(' ', ''));
      return this;
    }
    hasClass(name: string) {
      return this.e.classList.contains(name);
    }
    attr(attr: string, value: string | boolean | number): this;
    attr(attr: string): string;
    attr(attr: string, value?: string | boolean | number): this | string {
      if (value === undefined) {
        return this.e.getAttribute(attr);
      } else if (value === false)
        this.e.removeAttribute(attr);
      else this.e.setAttribute(attr, value === true ? '' : <string>value);

      return this;
    }
    attrs(attrs: Dic<string | boolean | number>): this {
      for (let key in attrs) {
        let value = attrs[key];
        if (value === false)
          this.e.removeAttribute(key);
        else this.e.setAttribute(key, value === true ? '' : <string>value);
      }

      return this;
    }
    ////Selection manipulation
    //link(other: Selection) {
    //   var list = [];
    //   if (!(other instanceof MultSel))
    //      other = new MultSel(other);

    //   this.forEach((e) => list.push(e));
    //   for (let e of (<any>other))
    //      list.push(e);

    //   return new MultSel(list);
    //}

    //match(filter: Filter): MultSel;
    //match(filter) {
    //   let result = [];
    //   var type = typeof filter === 'function' ? 0 : typeof filter === 'string' ? 1 : filter instanceof Element ? 2 : 3;
    //   for (var j = 0, e = this.a; j < this.length; e = this[++j])
    //      if ((type === 0 && filter(e)) || (type === 1 && e.matches(filter)) || filter === e || (<MultSel>filter).any(e))
    //         result.push(e);
    //   return new MultSel(result);
    //}
    //not(filter: string | Element[] | MultSel | NodeListOf<Element> | HTMLCollection) {
    //   let t = [];

    //   if (typeof filter === 'string')
    //      this.forEach(e => {
    //         if (!e.matches(filter))
    //            t.push(e);
    //      });
    //   else this.forEach(e => {
    //      var f;
    //      for (var i = 0; i < filter.length; i++)
    //         if (f = (filter[i] === e))
    //            break;
    //      if (!f) t.push(e);
    //   });
    //   //for (var j = 0, e = this.a; j < this.length; e = this[++j])


    //   return new MultSel(t);
    //}

    is(filter: string): boolean;
    is(filter: Node): boolean;
    is(filter: S): boolean;
    is(filter: string | Node | S) {
      if (filter instanceof Node || (filter instanceof S && (filter = filter.e)))
        return this.e == filter;
      else return this.e.matches(<string>filter);
    }
    isCls(cls: string) {
      return this.e.classList.contains(cls);
    }
    /**bind data to element */
    data(data: any): this;
    /**get data binded in the first element in the selection */
    data(): any;
    data(data?: any) {
      if (!arguments.length)
        return this.e['_d'];

      this.e['_d'] = data;
      return this;
    }

    remove() {
      this.e.remove();
      return this;
    }
    removeChild(index: number) {
      this.e.children[index].remove();
    }
  }

  export class M<T extends ANYElement = ANYElement> extends Array<T> {
    constructor();
    constructor(query: string, context?);
    constructor(items: ArrayLike<T>, context?);
    constructor(items: ArrayLike<S<T>>, context?);
    constructor(length: number, context?);
    constructor(input?: number | string | ArrayLike<T | S<T>>, context?) {
      if (input == null)
        super();
      else if (typeof input == "number")
        super(input);
      else {
        let r;
        if (isS(input))
          r = document.querySelectorAll(input);
        else if ('length' in input) {
          r = [];
          for (let i = 0; i < input.length; i++) {
            let t = input[i];
            if (t)
              r.push(t instanceof S ? t.e : t)
          }
        }
        else throw "invalid input";

        super(...r);
      }
    }

    on<K extends keyof HTMLElementEventMap>(action: K, listener: (this: T, e: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions): this;
    on<K extends keyof SVGElementEventMap>(action: K, listener: (this: T, e: SVGElementEventMap[K]) => any, options?: AddEventListenerOptions): this;
    on(event, listener?, options?: AddEventListenerOptions) {
      for (let i = 0; i < this.length; i++)
        this[i].addEventListener(event, listener, options);
      return this;
    }
    css(properties: Dic<number | string>, important?: boolean): this {
      important = <any>(important ? 'important' : '');
      for (let key in properties) {
        let value = <string>properties[key];
        for (let i = 0; i < this.length; i++)
          (<any>this[i]).style.setProperty(key, value, <any>important);
      }
      return this;
    }
    setClass(names: string[], set?: boolean): this {
      for (let i = 0; i < this.length; i++)
        this[i].classList[set === false ? 'remove' : 'add'].apply(this[i].classList, names);

      return this;
    }
    prop<K extends keyof T>(prop: K, value: T[K]): this;
    prop(prop: string, value: any): this;
    prop(prop: string, value: any): this {
      for (let i = 0; i < this.length; i++)
        this[i][prop] = value;

      return this;
    }
    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn  A function that accepts up to two arguments. forEach calls the callbackfn function one time for each element in the array.
     */
    query<K extends keyof HTMLElementTagNameMap>(filter: K): S<HTMLElementTagNameMap[K]>;
    query<U extends HTMLElement | SVGElement = HTMLElement>(filter: string): S<U>;
    query<U extends HTMLElement | SVGElement = HTMLElement>(filter: string) {
      for (let i = 0, l = this.length; i < l; i++) {
        let t = this[i];;
        if (!t.matches(filter))
          t = t.querySelector(filter)
        if (t)
          return new S(t);
      }
      return S.empty;
    }

    each(callbackfn: (value: S<T>, index: number) => void) {
      this.forEach((value, index) => callbackfn(new S(value), index));
      return this;
    }
    not(filter: string) {
      return <M<T>>this.filter((e) => !e.matches(filter));
    }
    remove() {
      for (let i = 0; i < this.length; i++)
        this[i].remove();

      return this;
    }
    child(): M;
    child(filter?: string): M;
    child(index?: number): M;
    child(filter?: string | number) {
      let result: Element[];
      if (isS(filter)) {
        result = [];
        for (let i = 0; i < this.length; i++) {
          let childs = this[i].children;
          for (let j = 0; j < childs.length; j++) {
            let child = childs[j];
            if (child.matches(filter))
              result.push(child);
          }
        }
      } else if (typeof filter == "number") {
        result = Array(filter);
        for (let i = 0; i < this.length; i++)
          result[i] = this[i].children[filter];
      } else {
        result = [];
        for (let i = 0; i < this.length; i++)
          result.push.apply(result, this[i].children);
      }

      return new M(<ANYElement[]>result);
    }
    push(...items: (T | S<any>)[]): number {
      for (let i = 0; i < items.length; i++) {
        let t = items[i];
        if (t instanceof S)
          items[i] = t.e;
      }
      return super.push(...<T[]>items);
    }
    toArray() {
      return this.map(t => new S(t));
    }
    find<S extends T>(predicate: (this: void, value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
    find(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): T | undefined;
    find(filter: string): T;
    find(filter: string | ((value: T, index: number, obj: T[]) => boolean), thisArgs?) {
      if (typeof filter === 'string') {
        for (var i = 0, e = this[0]; i < this.length; e = this[++i])
          if (e.matches(filter))
            return e;
      } else return super.find(filter, thisArgs);
    }

    static fromS<T extends ANYElement>(s: S<T>[]) {
      return new M<T>(s.filter(s => s).map(s => s.e));
    }
    static empty<T extends ANYElement = HTMLElement>(length: number = 0) {
      return new M<T>(new Array(length));
    }
  }
  // #endregion

  // #region utility
  export function html<T extends keyof HTMLElementTagNameMap>(tag: T, props?: string | Partial<SVGElement>, child?/*: Child*/): S {
    return g(<any>document.createElementNS('http://www.w3.org/1999/xhtml', tag), props, child);
  }
  export function xml<T extends keyof HTMLElementTagNameMap>(tag: T, props?: string | Partial<SVGElement>, child?/*: Child*/): S {
    return g(<any>document.createElementNS('http://www.w3.org/1999/xhtml', tag), props, child);
  }
  export function svg<T extends keyof SVGElementTagNameMap>(tag: T, attrs?: string | SVGCreateProps<SVGElementTagNameMap[T]>, child?/*: Child*/) {
    var result = new S<SVGElementTagNameMap[T]>(document.createElementNS('http://www.w3.org/2000/svg', tag));
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
  export function toSVG<T extends SVGElement = SVGElement>(text: string) {
    let parser = new DOMParser(),
      doc = parser.parseFromString(text, "image/svg+xml");
    return new S(<T>doc.firstChild);
  }
  export function wrap<T extends HTMLElement = HTMLElement>(child/*: Child*/, props?: string | string[] | Partial<T>, tag?: keyof HTMLElementTagNameMap): S<T> {
    if (typeof child === 'function')
      child = child();

    if (child instanceof E)
      child = child.render();

    else if (child instanceof Element)
      child = new S(child);

    else if (!(child instanceof S))
      child = g(tag || 'div', null, [child]);

    if (props)
      g(<S>child, props);

    return <any>child;
  }
  export function get(): S;
  export function get<T extends HTMLElement | SVGElement = HTMLElement>(query: T | S | E<any, any>): S<T>;
  export function get<T extends HTMLElement | SVGElement = HTMLElement>(query: string, context?: S | Element): S<T>;
  export function get(input?: string | Element | S | E, context?: S | Element) {
    if (input) {
      if (typeof input === 'string') {
        if (context instanceof S)
          context = context.e;
        return new S((context || document).querySelector(input));
      }
      if ((input instanceof E && (input = input.render())) || input instanceof S)
        return input;

    } else {
      return S.empty;
    }
  }

  export function getAll(input: ArrayLike<ANYElement>): M;
  export function getAll(input: string, context?: S | Element | M): M;
  export function getAll(input?: string | ArrayLike<ANYElement>, context?: S | Element | M) {
    return new M(<string>input, context);
  }

  class Cls extends Array<string> {
    push(...cls: Array<string | string[]>) {
      for (let t of cls) {
        if (t)
          for (let t2 of isS(t) ? t.split(' ') : t)
            if (t2)
              super.push(t2);
      }
      return this.length;
    }
    tryAdd(cls: string) {
      if (!this.includes(cls))
        this.push(cls);
      return this;
    }
  }
  export function cls(...cls: Array<string | string[]>) {
    let c = new Cls;
    if (cls.length)
      c.push(...cls);
    return c;
  }
  // #endregion


  // #region types

  // #endregion
  export type css = Properties;


  export interface Render {
    render(): S<any>;
  }

  export type EventHandler<T, E> = (this: T, e: E) => any;

  export type ANYElement = HTMLElement | SVGElement;
  export type One<T extends ANYElement = HTMLElement> = S<T> | Render;
  /**ElementNotation */
  export type Create = keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | Element | S | Render;

  const be = 'beforeend';

  export interface SVGCreateProps<T> {
    class?: string | string[],
    on?: { [K in keyof (HTMLElementEventMap & SVGElementEventMap)]?: (this: T, e: (HTMLElementEventMap & SVGElementEventMap)[K]) => any },
    css?: { [key: string]: string | number; };
    props?: Partial<T>;
    [key: string]: any;
  }

  export type BindHandler<T, M, B> = (this: E<M>, s: B, model: M) => void;
  export interface Bind<T, M, K extends keyof M> {
    e: S | Render,
    prop: K,
    handler: BindHandler<T, M, E<any> | S>;
  }

  export type EventMap<T> = HTMLEventMap<T> | SVGEventMap<T> | { [key: string]: (this: Element, e: Event) => any; };
  export type HTMLEventMap<T> = { [K in keyof HTMLElementEventMap]?: (this: T, e: HTMLElementEventMap[K]) => any };
  export type SVGEventMap<T> = { [K in keyof SVGElementEventMap]?: (this: T, e: SVGElementEventMap[K]) => any };

}
export = g;