export default (t) => {
    const date = new Date()
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds().padStart(2, "0")}`
    time.padEnd(10)
    console.log(`| ${time} |  ${t}`)
}