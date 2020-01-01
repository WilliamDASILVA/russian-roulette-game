/**
 * Code used to generate the dictionnaries.
 */

const fs = require('fs')
const path = require('path')

const file = fs.readFileSync(path.resolve(__dirname, './dictionnaries/en/words.txt'), 'utf-8')
const words = file
  .split('\n')
  .filter(word => word.length >= 2)
  .map(word => word.toLowerCase())
  .map(word => word.replace('-', '').replace('\'', ''))
  .map(word => word.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))

let combinaisons = []
let matchWords = {}

const LETTERS_COUNT = 2

words.forEach(word => {
  const counts = Math.ceil(word.length / LETTERS_COUNT)
  for (let i = 0; i < counts; i++) {
    let letters = word.slice(i * LETTERS_COUNT, (i * LETTERS_COUNT) + LETTERS_COUNT)

    // Go back from 1 char if the word is impair
    if (letters.length < LETTERS_COUNT) {
      letters = word.slice((i * LETTERS_COUNT) - 1, (i * LETTERS_COUNT) + LETTERS_COUNT)
    }

    combinaisons.push(letters)
  }

  // Shift by 1 char
  for (let i = 0; i < counts; i++) {
    let letters = word.slice((i * 2) + 1, (i * 2) + 3)

    // Go back from 1 char if the word is impair
    if (letters.length < 2) {
      letters = word.slice((i * 2), (i * 2) + 2)
    }

    combinaisons.push(letters)
  }
})

combinaisons = new Set(combinaisons.filter(word => word.length === LETTERS_COUNT))

combinaisons.forEach(letter => {
  const count = words.filter(word => word.includes(letter)).length
  matchWords[letter] = count
})

const sortedLetters = Object.entries(matchWords)
  .sort((a, b) => b[1] - a[1])
  .splice(0, 100)

fs.writeFileSync(path.resolve(__dirname, './dictionnaries/en/letters-2.txt'), sortedLetters.map(word => word[0]).join('\n'), {
  encoding: 'utf-8'
})
console.log('words', sortedLetters.map(word => word[0]).join('\n'))

module.exports = {
  words
}
