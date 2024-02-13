import { createServer } from "node:http"
import { createApp, createRouter, toNodeListener } from "h3"
import handle from "./handle.js"

const app = createApp()
const router = createRouter()

router.post("/", handle)

app.use(router)
createServer(toNodeListener(app)).listen(20001);