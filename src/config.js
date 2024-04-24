import { copyFile, readFile } from "node:fs/promises"
import jsYaml from "js-yaml"
import { existsSync } from "node:fs"

function yaml2json(yaml) {
    return jsYaml.load(yaml)
}

let config = {}
let repository = {}

const getConfig = () => {
    return config
}
const loadConfig = async () => {
    if ( !existsSync("./config.yml") ) {
        await copyFile("./src/config/config.yml", "./config.yml")
    }
    config = yaml2json(await readFile("./config.yml", "utf-8"))
}

const getRepository = () => {
    return repository
}
const loadRepository = async () => {
    if ( !existsSync("./repository.yml") ) {
        await copyFile("./src/config/repository.yml", "./repository.yml")
    }
    repository = yaml2json(await readFile("./repository.yml", "utf-8")).repository
}

// const key = Object.keys(config)

export {
    loadConfig,
    getConfig,
    loadRepository,
    getRepository
}
