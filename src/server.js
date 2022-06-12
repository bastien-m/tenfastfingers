const express = require("express");
const { readFileSync } = require("fs");
const cors = require('cors')
const { join } = require("path");

const app = express()
app.use(cors())

let words = []

app.get("/words", (req, res) => {
    const expectedListLength = req.query.expectedListLength || 500
    let availableWords = [...words]
    const pickedWords = []
    while (pickedWords.length < expectedListLength && availableWords.length > 0) {
        const randomIndex = Math.round(Math.random() * availableWords.length)
        pickedWords.push(availableWords[randomIndex])
        availableWords.splice(randomIndex, 1)
    }

    res.json(pickedWords)
})

const port = process.env.PORT || 3001
app.listen(port, () => {
    words = readFileSync(join(__dirname, "french-dic.txt"), { encoding: "utf-8"}).split("\n")
    console.log(`express app listening on PORT ${port}`)
})