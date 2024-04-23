import config from "./config.js"
import runCommand from "./runCommand.js"

export default (line) => {
    const command = line.split(" ")[0]
    switch (command) {
        case "update":
            update(line.split(" ").slice(1))
            break
        default: console.warn("未知的命令")
    }
}

const update = (arg) => {
    const name = arg[0]
    if ( !name ) {
        console.log("未输入仓库名称。")
        return
    }
    if ( !config.name.includes(name) ) {
        console.log("无该仓库。")
        return
    }
    runCommand(name)
}