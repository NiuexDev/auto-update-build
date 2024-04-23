import { readFileSync } from "node:fs"
const config = JSON.parse(readFileSync("./config.json", "utf-8"))
const key = Object.keys(config)
export default {
    list: config,
    name: key
}