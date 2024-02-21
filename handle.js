import { defineEventHandler, getHeader, readBody, setResponseStatus } from "h3"
import { execSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync } from "node:fs"
import log from "./log.js"


const config = JSON.parse(readFileSync("./config.json", "utf-8"))
const list = Object.keys(config)


export default defineEventHandler( async (event) => {

    const type = getHeader(event, "x-github-event")
    
    if ( type == "push" ) {
        const payload = await readBody(event)
        const name = payload.repository.full_name
        if ( list.includes(name) ) {
            if ( payload.ref.split("/")[2] == config[name].branch ) {
                runCommand(config[name])
            }
        }
    }

    setResponseStatus(event, 200)
    return { message: "已接收" }
})


async function runCommand(meta) {
    
    const { branch, path, repository, command: commands, output } = meta

    log( `-------${`正在更新：${name}`.padEnd(54, "-")}` )
    log()


    try {
        

    // 进入网站目录
        process.chdir(path)
        log(`切换工作目录为：${process.cwd()}`)

    /**
     * Build
     */

        // 判断目录是否存在，存在则删除
        if ( existsSync("./build/") ) {
            log(`清除build目录`)
            execSync("rm -rf ./build/", {stdio: 'inherit'})
        }

        // git clone
        log("git clone...")
        log()
        execSync(`git clone ${repository} build`, {stdio: 'inherit'})
        log()
        log("\ngit clone 完成")
        
        // 进入build目录
        process.chdir("./build/")
        log(`进入build目录：${process.cwd()}`)


        // 运行命令
        commands.forEach(command => {
            log(`运行 ${command}`)
            log()
            execSync(command, {stdio: 'inherit'})
            log()
            log("完成")
        })

    /**
     * 部署
     */

        // 重命名原online文件夹
        if ( existsSync("../online/") ) {
            log("重命名online")
            renameSync("../online/", "../old_online/")
        }
        // 输出到online
        log(`移动输出到online`)
        renameSync(`./${output}`, "../online/")
        
        // 删除old_online
        log("删除old_online")
        execSync("rm -rf ../old_online/")

        
    } catch {
        log()
        log( `-------${"更新失败".padEnd(54, "-")}` )
    } finally {
        log()
        log( `-------${"更新完成".padEnd(54, "-")}` )
    }

}