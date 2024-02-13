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
        const name = payload.repository.name
        if ( list.includes(name) ) {
            runCommand(name)
        }
    }

    setResponseStatus(event, 200)
    return { message: "已接收" }
})


function runCommand(name) {
    const meta = config[name]
    const { path, repository, command, output } = meta

    if ( !path.startsWith("/www/wwwroot/") ) {
        log("路径错误")
        return
    }

    log( `-------${`正在更新：${name}`.padEnd(54, "-")}` )

    // 进入网站目录
    process.chdir(path)
    log(`切换工作目录为：${process.cwd()}`)

    if ( !process.cwd().startsWith("/www/wwwroot/") ) {
        log("目录错误")
        return
    }

/**
 * Build
 */

    // 判断目录是否存在，存在则删除
    if ( existsSync("./build/") ) {
        log(`清除build目录`)
        execSync("rm -rf ./build/")
    }
    // mkdirSync("./build/")

    // git clone
    log("git clone...")
    execSync(`git clone https://oauth2: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@github.com/NiuexDev/${repository}.git build`)
    log("git clone 完成")
    
    // 进入build目录
    process.chdir("./build/")
    log(`进入build目录：${process.cwd()}`)

    /**
     * npm build
     */
    // 安装依赖
    log("安装依赖")
    execSync("npm i")
    log("安装依赖完成")

    // 构建
    log("开始构建")
    execSync(command, {stdio: 'inherit'})
    log("构建结束")

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


    log( `-------${"更新完成".padEnd(54, "-")}` )
}