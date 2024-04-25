
import { execSync } from "node:child_process"
import { existsSync, renameSync } from "node:fs"
import { getRepository } from "./config.js"
import log from "./log.js"

export default (name) => {
    
    const repositoryList = getRepository()
    const { branch, path, repository, command: commands, output } = repositoryList[name]

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

        
    } catch(e) {
        log()
        log( `-------${"更新失败".padEnd(54, "-")}` )
        console.error(e)
    } finally {
        log()
        log( `-------${"更新结束".padEnd(54, "-")}` )
    }

    return
}