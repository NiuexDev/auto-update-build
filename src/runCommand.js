
import { execSync } from "node:child_process"
import { existsSync, renameSync, rmdirSync } from "node:fs"
import { getRepository } from "./config.js"
import { join } from "node:path"
import log from "./log.js"

export default (name) => {
    const startTime = Date.now()

    const repositoryList = getRepository()
    const { branch, path, repository, command: commands, output } = repositoryList[name]

    log( `-------${`正在更新：${name}`.padEnd(54, "-")}` )
    log()


    try {
        

    // 进入网站目录
        // process.chdir(path)
        // log(`切换工作目录为：${process.cwd()}`)

    /**
     * Build
     */

        // 判断目录是否存在，存在则删除
        if ( existsSync(join(path, "build/")) ) {
            log(`清除build目录`)
            // execSync("rm -rf ./build/", {stdio: 'inherit'})
            rmdirSync(join(path, "build/"), { recursive: true })
        }

        // git clone
        log("git clone...")
        log()
        execSync(`git clone ${repository} build`, {stdio: 'inherit', cwd: path})
        log()
        log("\ngit clone 完成")
        
        // 进入build目录
        // process.chdir("./build/")
        // log(`进入build目录：${process.cwd()}`)


        // 运行命令
        commands.forEach(command => {
            log(`运行 ${command}`)
            log()
            execSync(command, {stdio: 'inherit', cwd: join(path, "build/")})
            log()
            log("完成")
        })

    /**
     * 部署
     */

        // 重命名原online文件夹
        if ( existsSync(join(path, "online/")) ) {
            log("重命名online")
            renameSync(join(path, "online/"), join(path, "old_online/"))
        }
        // 输出到online
        log(`移动输出到online`)
        renameSync(join(path, "build/", output), join(path, "online/"))
        
        // 删除old_online
        log("删除old_online")
        // execSync("rm -rf ../old_online/")
        rmdirSync(join(path, "old_online/"), { recursive: true })

        
    } catch(e) {
        log()
        log( `-------${"更新失败".padEnd(54, "-")}` )
        console.error(e)
    } finally {
        const endTime = Date.now()
        const spentTime = endTime - startTime
        const seconds = Math.round(spentTime / 1000) // 花费的总秒数，使用round处理浮点数取整
        log()
        log( `-------更新结束，用时${seconds}秒`.padEnd(54, "-") )
    }

    return
}