export default (t) => {
    const date = new Date()
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    time.padEnd(10)
    console.log(`|  ${time}|  ${t}`)
}