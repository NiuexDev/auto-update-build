import esbuild from "esbuild"
import { writeFile } from "node:fs/promises"

await esbuild.build({
  entryPoints: ['src/index.js'],
  outfile: 'dist/server.js',
  platform: 'node',
  target: 'esnext',
  format: 'esm',
  external: ['node_modules/*'],
  bundle: true,
  minify: true,
  treeShaking: true
}).catch(() => process.exit(1))

await writeFile("dist/package.json", `{ "type": "module" }`, "utf-8")