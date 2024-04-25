import { createServer } from "node:http"
import { createApp, createRouter, toNodeListener } from "h3"
import { loadConfig, getConfig, loadRepository } from "./config.js"
import postHandle from "./postHandle.js"
import commandHandle from "./commandHandle.js"
import readline from "node:readline/promises"
import { stdin as input, stdout as output } from "node:process"

await loadConfig()
await loadRepository()

const { port } = getConfig()

const app = createApp()
const router = createRouter()

router.post("/", postHandle)

app.use(router)
createServer(toNodeListener(app)).listen(port)

const rl = readline.createInterface({
    input,
    output,
    terminal: false,
    prompt: "> "
})

rl.addListener("line", (line) => {
    commandHandle(line)
    rl.prompt()
})

rl.prompt()