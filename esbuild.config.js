import { buildSync } from "esbuild"
import { existsSync, rmSync } from "fs"

const BUILD = "build"

if (existsSync(BUILD)) {
    rmSync(BUILD, { recursive: true, force: true })
}

buildSync({
    entryPoints: ["./ts/index.ts"],
    tsconfig: "./tsconfig.json",
    legalComments: "external",
    sourcemap: "external",
    packages: "external",
    outdir: BUILD,
    logLevel: "info",
    target: "node16",
    platform: "node",
    splitting: true,
    format: "esm",
    minify: true,
    bundle: true,
    logLimit: 0,
    drop: ["console", "debugger"],
    // loader: {
    //     ".json": "json",
    //     ".node": "file"
    // },
    // outExtension: {
    //     ".js": ".mjs"
    // }
})