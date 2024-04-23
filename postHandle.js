import { defineEventHandler, getHeader, readBody, setResponseStatus } from "h3"
import config from "./config.js"
import log from "./log.js"
import runCommand from "./runCommand.js"

export default defineEventHandler( async (event) => {

    const type = getHeader(event, "x-github-event")
    
    if ( type !== "push" ) return { state: "no", message: "事件类型不对应，已忽略。" }
    
    const payload = await readBody(event)
    const name = payload.repository.full_name
    if ( !config.name.includes(name) ) return { state: "no", message: "仓库不对应，已忽略。" }
    

    if ( payload.ref.split("/")[2] !== config.list[name].branch ) return { state: "no", message: "分支不对应，已忽略。" }

    runCommand(name)
    return { state: "ok", message: "已接收。" }
})