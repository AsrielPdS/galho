const { css } = require("./galho");

const equal = (exp, value, msg) => exp === value ?
  console.log("TEST:%s sucefull", msg) :
  console.error(exp === value, `TEST:%s -> expected:%o; get:%o`, msg, value, exp);

equal(css.sub([".p"], ".c1,#c2"), ".p>.c1,.p>#c2", "1 parent M child");
equal(css.sub([".p1", "[ola]"], "#c2"), ".p1>#c2,[ola]>#c2", "M parent 1 child");
equal(css.sub([".a.b", "[o]"], ".c,.d"), ".a.b>.c,[o]>.c,.a.b>.d,[o]>.d", "M parent M child");
