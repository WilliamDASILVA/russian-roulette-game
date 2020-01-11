const fs = require('fs')
const path = require('path')

const { availableLocales } = require('./config')

const words = {}
const letters = {}

/**
 * Preload all the available languagages
 */
availableLocales.forEach(language => {
  const wordsFile = fs.readFileSync(path.resolve(__dirname, `./dictionnaries/${language}/words.txt`), 'utf-8')
  const wordsContent = wordsFile
    .split('\n')
    .filter(word => word.length >= 2)
    .map(word => word.toLowerCase())
    .map(word => word.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))

  words[language] = wordsContent

  let lettersFile = fs.readFileSync(path.resolve(__dirname, `./dictionnaries/${language}/letters-2.txt`), 'utf-8')
  letters[language] = {}
  letters[language][2] = lettersFile.split('\n')

  lettersFile = fs.readFileSync(path.resolve(__dirname, `./dictionnaries/${language}/letters-3.txt`), 'utf-8')
  letters[language][3] = lettersFile.split('\n')
})

function getWords(language) {
  return words[language]
}

function getLetters(language, length) {
  return letters[language][length]
}

module.exports = {
  getWords,
  getLetters
}
