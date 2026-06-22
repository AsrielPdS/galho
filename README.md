# Galho 🍃

A lightweight, high-performance JavaScript/TypeScript library for creating and manipulating DOM elements directly. No build steps, no complex configurations, and no Virtual DOM overhead.

[![npm version](https://img.shields.io/npm/v/galho.svg)](https://www.npmjs.com/package/galho)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Why Galho?

While modern frameworks like React, Svelte, or Vue are powerful, they often introduce unnecessary overhead (bundlers, compilation steps, Virtual DOM reconciliation) for small to medium-sized projects. 

**Galho** offers a simpler, closer-to-the-metal approach:
* **No Build Setup:** Use it directly in the browser via CDN or install via npm. No CLI, no Webpack/Vite config required.
* **Direct DOM Wrappers:** Works with real DOM elements, making integration with existing codebases seamless.
* **Declarative and Chainable:** Fluent, jQuery-like chaining API for DOM manipulation.
* **Built-in Reactivity & Data Binding:** Lightweight reactive components and observable arrays (`orray`) that automatically sync data changes directly to the DOM.
* **SVG & CSS Helpers:** Easy creation of SVG graphics and programmatic generation of stylesheets with nested selectors.

---

## Installation

### Via npm
```bash
npm install galho
```

### Via yarn
```bash
yarn add galho
```

### Via CDN (ES Modules)
```javascript
import { g, get } from "https://cdn.jsdelivr.net/npm/galho/galho.min.js";
```

### Via CDN (IIFE - Browser Globals)
This version exposes the global variables `$` (equivalent to `get`) and `g` (element builder/wrapper).
```html
<script src="https://cdn.jsdelivr.net/npm/galho/galho-iife.min.js"></script>
```

---

## Core API Reference

### 1. Element Wrappers (`G` and `M`)
Galho uses two main classes to wrap real DOM elements:
* **`G`**: Wraps a single DOM element and provides a chainable API.
* **`M`**: Wraps multiple DOM elements (inherits from `Array`), letting you apply operations to all of them at once.

#### The `g()` Helper
Creates a new element or wraps an existing one:
```javascript
import { g } from "galho";

// Create a new element with classes and content
const button = g("button", "btn btn-primary", "Click Me");

// Create an element with custom properties
const input = g("input", { type: "text", placeholder: "Type here..." });

// Wrap an existing DOM element
const body = g(document.body);
```

#### DOM Queries: `get()` & `getAll()`
Wrappers around `document.querySelector` and `document.querySelectorAll`:
```javascript
import { get, getAll } from "galho";

// Select one element (returns G wrapper)
const header = get("#header");

// Select multiple elements (returns M wrapper)
const listItems = getAll(".list-item");
```

---

## Examples & Walkthroughs

### Creating & Appending Elements
Create an element, attach event listeners, and append it to the DOM:
```javascript
import { g, get } from "galho";

// Create a button, add classes, text, and click handler
const button = g("button", "btn-primary", "Show Alert").on("click", () => {
    alert("Hello World!");
});

// Query body and append the button
get("body").add(button);
```

### DOM Manipulation & Method Chaining
Galho makes it simple to read, update, and style DOM elements in a single expression:
```javascript
import { get } from "galho";

get("#my-list")
    .css({ background: "#f8f9fa", padding: "10px" }) // Apply inline CSS
    .c("active-list")                                // Add a class
    .c("old-class", false)                           // Remove a class
    .childs()                                        // Get all children (returns M wrapper)
    .on("click", () => alert("Clicked a child!"))    // Bind event to all children
    .do((child, index) => {                          // Iterate over children
        child.attr("title", `Item #${index + 1}`);   // Set custom attributes
    });
```

### Programmatic Styling (CSS-in-JS)
Write CSS directly in JavaScript with support for nested selectors and pseudo-classes:
```javascript
import { g, get, css } from "galho";

// Create the CSS stylesheet content
const styles = css({
    h1: {
        fontSize: "24px",
        color: "#333"
    },
    ".btn-action": {
        background: "#007bff",
        border: "none",
        color: "#fff",
        padding: "8px 16px",
        borderRadius: "4px",
        ":hover": { background: "#0056b3" },
        ":active": { background: "#004085" }
    }
});

// Query the <head> element and append a new <style> element
get("head").add(g("style", null, styles));
```

### Creating SVGs
Galho includes a specialized `svg` helper to construct vector graphics easily without namespace issues:
```javascript
import { svg, get } from "galho";

const canvas = svg('svg', { viewBox: "0 0 100 100", width: "200px" }, [
    svg('rect', { fill: "#3498db", width: "100", height: "100" }),
    svg('circle', { fill: "#e74c3c", cx: "50", cy: "50", r: "25" })
]);

get("body").add(canvas);
```

### Reactive Components
For more complex UI state management, extend the `Component` class. You can define properties (`this.p`), listen to changes, and bind properties directly to DOM elements:
```javascript
import { Component, g, get } from "galho";

class Counter extends Component {
    view() {
        const p = this.p;
        
        // When clicked, we trigger set() to modify property 'count'
        const btnIncrement = g("button", "btn", "+").on("click", () => {
            this.set("count", p.count + 1);
        });
        
        const btnDecrement = g("button", "btn", "-").on("click", () => {
            this.set("count", p.count - 1);
        });

        // We wrap everything in a div and bind the label span to the 'count' property
        return g("div", "counter-container", [
            btnDecrement,
            this.bind(g("span", "label"), span => {
                span.text(`Count: ${p.count}`);
            }, "count"),
            btnIncrement
        ]);
    }
}

// Instantiate component with initial properties
const counter = new Counter({ count: 0 });
get("body").add(counter);
```

### Lists & Data Binding (`orray`)
`orray` (Observable Array) is a subclass of `Array` equipped with events and reactive binding. When items are added, removed, or updated in an `orray`, the bound DOM container automatically reflects those changes.

Here is a simple Todo List implementation:
```javascript
import { g, get } from "galho";
import orray from "galho/orray.js";

// Initialize an empty observable list
const todoList = orray();
const input = g("input", { type: "text", placeholder: "New task..." });

get("body").add([
    g("h3", null, "Tasks"),
    
    // Bind the observable list to a UL container.
    // The second parameter is a factory function that defines how each item in the list is rendered.
    todoList.bind(
        g("ul"), 
        (item) => g("li", null, [
            g("span", null, item),
            g("button", null, "✖").on("click", () => todoList.remove(item))
        ])
    ),
    
    g("form").on("submit", (event) => {
        event.preventDefault();
        const value = input.v().trim();
        if (value) {
            todoList.push(value);
            input.v(""); // Clear the input
        }
    }, { passive: false }).add([
        input,
        g("button", { type: "submit" }, "Add Task")
    ])
]);
```

---

## API Summary Table

| Helper / Class | Description |
| :--- | :--- |
| `g(tagName \| element, props, content)` | Primary constructor/wrapper for DOM elements. Returns a `G` instance. |
| `get(selector)` | Queries the first matching element. Returns a `G` instance. |
| `getAll(selector)` | Queries all matching elements. Returns an `M` instance. |
| `svg(tag, attrs, children)` | Creates elements inside the SVG namespace. |
| `css(rules)` | Translates JavaScript objects into a CSS string stylesheet (with nesting support). |
| `orray(items)` | Creates an Observable Array (`L` instance) to bind lists directly to elements. |
| `Component` | Reactive class component supporting automatic property-based DOM bindings. |

---

## License

This project is licensed under the MIT License. See [LICENSE](file:///c:/Users/bebet/source/repos/apds/src/pkg/galho/LICENSE) for details.
