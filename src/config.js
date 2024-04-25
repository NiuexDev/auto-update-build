import { readFile, writeFile } from "node:fs/promises"
import jsYaml from "js-yaml"
import { existsSync } from "node:fs"
import log from "./log.js"
import path from "node:path"
import process from "node:process"

const cwd = process.cwd()

function yaml2json(yaml) {
    return jsYaml.load(yaml)
}

let config = {}
let repository = {}

const getConfig = () => {
    return config
}
const loadConfig = async () => {
    if ( !existsSync(path.join(cwd, "./config.yml")) ) {
        await writeFile(path.join(cwd, "./config.yml"), config_yml, "utf-8")
        log("config.yml 不存在，已创建。")
    }
    config = yaml2json(await readFile(path.join(cwd, "./config.yml"), "utf-8"))
}

const getRepository = () => {
    return repository
}
const loadRepository = async () => {
    if ( !existsSync(path.join(cwd, "./repository.yml")) ) {
        await writeFile(path.join(cwd, "./repository.yml"), repository_yml, "utf-8")
        log("repository.yml 不存在，已创建。请修改，并reload。")
    }
    repository = yaml2json(await readFile(path.join(cwd, "./repository.yml"), "utf-8")).repository
}

export {
    loadConfig,
    getConfig,
    loadRepository,
    getRepository
}


const config_yml =
`port: 20001
`

const repository_yml =
`repository:
    <REPOSITORY PATH>: 
        branch: <BRANCH>
        path: <DIR>
        repository: <YOUR REPOSITORY URL>
        command: 
            - "<YOUR COMMAND ONE> SUCH AS <npm i>"
            - "<YOUR COMMAND TWO> SUCH AS <npm run build>"
        output: <OUTPUT DIR>
`