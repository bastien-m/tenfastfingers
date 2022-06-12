const inputField = document.getElementById("word")
const correctWordSpan = document.getElementById("correctWords")
const correctCharSpan = document.getElementById("correctChars")
const incorrectWordSpan = document.getElementById("incorrectWords")
const incorrectCharSpan = document.getElementById("incorrectCharacters")
const wordsContainer = document.getElementById("words-container")

let wordList = []
let previousWordPosition = null;
let currentWordPosition = 0;

let result = {
    validWord: 0,
    validChar: 0,
    invalidWord: 0,
    invalidChar: 0
}

/**
 * @param {string} inputValue
 * @param {string} expectedWord
 * @return {boolean}
 */
const isCorrect = (inputValue, expectedWord) => {
    return inputValue.trim() === expectedWord
}

/**
 * @param {Object} result
 * @param {number} result.validWord
 * @param {number} result.validChar
 * @param {number} result.invalidWord
 * @param {number} result.invalidChar
 */
const updateScoreBoard = (result) => {
    correctWordSpan.innerText = result.validWord.toString()
    correctCharSpan.innerText = result.validChar.toString()
    incorrectWordSpan.innerText = result.invalidWord.toString()
    incorrectCharSpan.innerText = result.invalidChar.toString()
}

/**
 * @param {string[]} wordList
 */
const printWords = (wordList) => {
    wordList.map(word => {
        const span = document.createElement("span")
        span.classList.add("word", "inline-block", "bg-lime-100", "m-1")
        span.innerText = word
        return span
    }).forEach(span => wordsContainer.appendChild(span))
    
}


const removeCurrentWordFromHtml = () => {
    wordsContainer.removeChild(wordsContainer.firstChild)
}

const removeCurrentLineFromHtml = () => {
    const {y: firstLineY} = wordsContainer.children[0].getBoundingClientRect()
    const elementsToDelete = Array.from(wordsContainer.children).filter(span => {
        const { y: spanY } = span.getBoundingClientRect()
        return firstLineY === spanY
    })
    elementsToDelete.forEach(el => 
        wordsContainer.removeChild(el)
    )
}

/**
 * 
 * @returns {Promise} words
 */
const getWordsFromServer = (length = 100) => {
    return fetch(`http://localhost:3001/words?expectedListLength=${length}`, {headers: {
        'Content-Type': 'application/json',
    }})
}

/**
 * 
 * @param {Element} span 
 * @param {boolean} isValid
 */
const addCorrectWordClass = (span, isValid) => {
    console.log(`add class ${isValid} to span`)
    span.classList.remove("bg-lime-100")
    span.classList.add(isValid ? "bg-lime-600" : "bg-red-600")
}

/**
 * 
 * @param {number} position 
 */
const getCurrentSpan = (position) => {
    return Array.from(wordsContainer.getElementsByClassName("word"))[position]
}

/**
 * @param {KeyboardEvent} event 
 */
const handleKeyDown = (event) => {
    if (event.code === "Space") {
        event.preventDefault()
        const wordEntered = inputField.value
        const currentSpan = getCurrentSpan(currentWordPosition)
        console.log(currentSpan)
        if (!currentSpan) throw new Error("Span not found")
        
        
        const expectedWord = wordList.shift()
        const isCorrectAnswer = isCorrect(wordEntered, expectedWord)
        if (isCorrectAnswer) {
            result.validChar += expectedWord.length
            result.validWord++
        } else {
            result.invalidChar += expectedWord.length
            result.invalidWord++
        }
        inputField.value = ""
        updateScoreBoard(result)
        
        const { y : currentY } = currentSpan.getBoundingClientRect()
        if (previousWordPosition === null || previousWordPosition === currentY) {
            console.log("meme ligne")
            currentWordPosition++
            previousWordPosition = currentY
        } else {
            previousWordPosition = null
            console.log("ligne différente")
            currentWordPosition = 1
            removeCurrentLineFromHtml()
        }
        addCorrectWordClass(currentSpan, isCorrectAnswer)

    }
}

const main = () => {
    getWordsFromServer()
        .then(res => {
            res.json().then(words => {
                wordList = words
                printWords(wordList)
            })
        })
    inputField.onkeydown = handleKeyDown
}
