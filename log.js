export default (t = "") => {
    const date = new Date()
    const hour = `${date.getHours()}`.padStart(2, "0")
    const minute = `${date.getMinutes()}`.padStart(2, "0")
    const second = `${date.getSeconds()}`.padStart(2, "0")

    const time = `${hour}:${minute}:${second}`
    console.log(`| ${time} |  ${t}`)
}