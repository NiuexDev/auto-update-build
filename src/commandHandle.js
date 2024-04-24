import { loadRepository, getRepository } from "./config.js"
import runCommand from "./runCommand.js"

export default (line) => {
    const command = line.split(" ")[0]
    const arg = line.split(" ").slice(1)
    switch (command) {
        case "build":
            build(arg)
            break
        case "reload":
            reload(arg)
            break
        case "list":
            list(arg)
            break
        case "help":
            help()
            break
        default: console.warn("未知的命令")
    }
}

const build = (arg) => {
    const repository = getRepository()
    const name = arg[0]
    if ( !name ) {
        console.log("未输入仓库名称。")
        return
    }
    if ( !Object.keys(repository).includes(name) ) {
        console.log("无该仓库。")
        return
    }
    runCommand(name)
}

const reload = async () => {
    await loadRepository()
    console.log("重载完成，当前仓库：")
    list()
}

const list = () => {
    console.log(Object.keys(getRepository()).join("  "))
}

const help = () => {
    console.log("list <name>:\n  列出仓库，未指定name则为列出全部仓库。")
    console.log("reload:\n  重新载入repository.yml配置文件")
    console.log("build [name]:\n  更新构建仓库")
}