# galho

galho is js library for create and manipulate dom elements without need compiling, configuration or VirtualDom

## Why?

React, Svelte and other modern tools are for a lot of small and medium size project an over engineering **galho** offer a much simple approach because it don’t need any setup, configuration, cli or compilation, it is simply a wrapper around Dom Elements with some other utility for SVG, List and Data Binding

## Installation

### with npm

` npm i galho `

### with yarn

` yarn install galho `

### with cdn

```js
import ... from "https://cdn.jsdelivr.net/npm/galho/galho.min.js"
```

or if you prefer this version will declare two global variable called `$` and `g` 

```html
<script src="https://cdn.jsdelivr.net/npm/galho/galho-iife.min.js"></script>
```


## Exemples

### creating and append elements to DOM

```js
import { g, get } from "galho";

//creating a button, add class 'bt-class', apend content 'Show alert' and add a handler to click event
let buttton = g("button", "bt-class", "Show alert").on("click",() => {
    alert("Hello World!")
});
//query body element and append the button
get("body").add(button);
```

### Manipulating DOM

```html
<body>
    <div id="list" class="old-class">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</body>
```

```js
import { get } from "galho";

get("#list")
    //add inline style
    .css({background:"#e333"})
    //add class
    .c("new-class")
    //remove class
    .c("old-class",false)
    //get all children elements
    .childs()
    //add event listener to all childs
    .on("click",()=>alert("Clicked!"))
    .do((e,i)=>
        //add attribute 
        e.attr("title", `This is a the element nº: ${i+1}`))
```

### Todo List

for this we are using an utility called orray(Observable aRRAY) that is an array with suport for binding, events, etc.

```js
import { g, get } from "galho";
import orray from "galho/orray.js";

let list = orray(), input=g("input");

get("body").add([
    //bind list to created element "ul" i.e. for each change(add, remove, edit) that occur in list will be reflected in the element (ul)
    list.bind(g("ul"),e=>g("li", [e, g("button",["x"]).on("click",list.remove(e))])),
    g("form", [
        input,
        g("button",{type:"submit"},"Adicionar").on("click",()=>{
            list.add(input.v());
            //clear input
            input.v("");
        })
    ])
]);
```

### jQuery style

```html
<head>
    <style>
        .menu{display:"none"}
        .dropdown.open .menu{display:"block"}
    </style>
</head>
<body>
    <div class="dropdown">
        <div class="menu" name="1">
            <div class="item">Item 1</div>
            <div class="item">Item 2</div>
            <div class="item">Item 3</div>
        </div>
    </div>
    <div class="dropdown">
        <div class="menu" name="2">
            <div class="item">Item 1</div>
            <div class="item">Item 2</div>
            <div class="item">Item 3</div>
        </div>
    </div>
    <div class="dropdown">
        <div class="menu" name="3">
            <div class="item">Item 1</div>
            <div class="item">Item 2</div>
            <div class="item">Item 3</div>
        </div>
    </div>
</body>
```

```js
import { getAll } from "galho";

getAll(".dropdown").do(dd=>dd
    //add event click to toggle class open on dropdown
    .on("click", ()=>dd.tcls("open"))
    //search all item inside it show an alert wenever it is ben clicked
    .query(".item").do(i=>i.on("click", ()=>alert(`Dropdown ${dd.attr("name")} selected ${i.text()}`)))
)
```

### SVG

```js
import { svg, get } from "galho";

get("body").add(svg('svg', { viewBox: "0 0 100 100" }, [
    svg('rect', { fill: "blue", width: "100", height:"100" }),
    svg('rect', { fill: "red", width: "50", height:"50" }),
    svg('rect', { fill: "green", width:"25", height:"25" }),
]))
```

### Simple Styling

```js
import { css, get } from "galho";

// create css
let style = css({
    h1: {
        fontSize:"20px"
    },
    ".bt": {
        background: "#28C",
        border: "solid 1px #6AE",
        ":hover":  { background:"#39D" },
        ":active": { background:"#59E" },
    },
});
//query for head element and apend an style element with css created above
get("head").add(g("style", null, style));
```

### Reactivity

when it came to reactivity **galho** do not use VirtualDom, what it does es to listen to binding.

```js
import { Component, g, get } from "galho";

///Component permit events and data binding if none of this is needed a function can be used
class Input extends Component{
    view(){
        //this.p represent the properties of this Component 
        let p = this.p;
        let input = g("input", { name: p.name, type: p.type })
        //when user input change the value property and all listeners asociated to it will be release
        .on("input",()=>this.set("value",input.v()));
        return div([
            input,
            //bind the span element to the value property
            this.bind(g("span"),s=>s.set("Value: "+p.value),"value")
        ]);   
    }
}
get("body").add(new Input({name:"input",type:"number"}))
```

