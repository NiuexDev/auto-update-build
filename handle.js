import { defineEventHandler, getHeader, readBody, setResponseStatus } from "h3"
import { execSync } from "node:child_process"
import { readFileSync, renameSync, unlinkSync } from "node:fs"


const config = JSON.parse(readFileSync("./config.json", "utf-8"))
const list = Object.keys(config)


export default defineEventHandler( async (event) => {

    const type = getHeader(event, "x-github-event")
    const payload = await readBody(event)
    const name = payload.repository.name

    if ( type == "push" && list.includes(name) ) {
        runCommand(name)
    }

    setResponseStatus(event, 200)
    return { message: "已接收" }
})


function runCommand(name) {
    const meta = config[name]

    console.log(meta)

    process.chdir(meta.path)
    execSync("git pull")
    execSync(meta.command)

    const online = meta.path + meta.online
    const output = meta.parse + meta.output
    renameSync(online, online+"_")
    renameSync(output, online)
    unlinkSync(online+"_")
}