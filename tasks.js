
export async function minify() {
    const galho = `
    export * from "./util.js";
    export * from "./event.js";
    export * from "./galho.js";
    export * from "./orray.js";`;
    (await (await import('rollup'))({
        input: 'galho',
        plugins: [
            (await import('@rollup/plugin-virtual'))({ galho }),
            {
                name: "ppp",
                renderChunk(src) {
                    return src
                        .replace("var $ = (function (exports) {", "window.g=window.$=(function () {")
                        .replace("})({})", "})()")
                        .replace("return exports;", "return g;")
                        .replace(/exports/g, "g");
                },
            },
            (await import('@rollup/plugin-terser'))({ module: true, compress: { passes: 2, drop_console: true } }),
        ],
    })).write({
        file: "galho-iife.min.js",
        format: "iife",
        name: "$"
    });


    (await rollup({
        input: 'galho',
        plugins: filter([
            virtual({ galho }),
            terser({ module: true, compress: { passes: 2, drop_console: true } }),
        ]),
    })).write({ file: "galho.min.js" });
}

export async function docs() {
    const td = await import("typedoc");

    const app = new td.Application();
    app.options.addReader(new td.TSConfigReader());
    app.bootstrap({
        entryPoints: ["galho.ts", "event.ts", "orray.ts", "util.ts"],
    });

    const project = app.convert();

    if (project) 
        await app.generateDocs(project,  "docs");
}