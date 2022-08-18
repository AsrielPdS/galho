"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.sub = exports.css = void 0;
const galho_js_1 = require("./galho.js");
function css(selector, tag) {
    let r = "";
    for (let k in selector)
        r += parse(k, selector[k]);
    return tag ? tag.add(r) : (0, galho_js_1.g)("style").text(r).addTo(document.head);
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
            if (typeof val === "object") {
                subSel += parse(sub(split || (split = selector.split(',')), key), val);
            }
            else
                r += key.replace(regex, m => "-" + m) + ":" + val + ";";
        }
    }
    return (r ? selector + "{" + r + "}" : "") + subSel;
}
exports.parse = parse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3NzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHlDQUFrQztBQUlsQyxTQUFnQixHQUFHLENBQUMsUUFBb0IsRUFBRSxHQUFPO0lBQy9DLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNYLEtBQUssSUFBSSxDQUFDLElBQUksUUFBUTtRQUNwQixDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QixPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBQSxZQUFDLEVBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUF3QixDQUFDO0FBQzNGLENBQUM7QUFMRCxrQkFLQztBQXlCRCxNQUNFLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFDaEMsTUFBTSxHQUFHLEdBQUcsRUFDWixLQUFLLEdBQUcsUUFBUSxDQUFDO0FBQ25CLFNBQWdCLEdBQUcsQ0FBQyxNQUFnQixFQUFFLEtBQWE7SUFDakQsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDYixPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDcEIsSUFBSSxDQUFDLElBQUksR0FBRztnQkFDVixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNuQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM1QixPQUFPLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDOztnQkFFdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNmLENBQUM7QUFaRCxrQkFZQztBQUNELFNBQWdCLEtBQUssQ0FBQyxRQUFnQixFQUFFLEtBQVk7SUFDbEQsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLE1BQU0sR0FBRyxFQUFFLEVBQUUsS0FBYyxDQUFDO0lBQ3hDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRTtRQUN0QixLQUFLLElBQUksQ0FBQyxJQUFJLEtBQUs7WUFDakIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0tBQzFDO0lBQ0QsS0FBSyxJQUFJLEdBQUcsSUFBSSxLQUFLLEVBQUU7UUFDckIsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLElBQUksR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUU7WUFDcEIsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7Z0JBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDeEU7O2dCQUVDLENBQUMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztTQUMzRDtLQUNGO0lBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDdEQsQ0FBQztBQWxCRCxzQkFrQkMifQ==