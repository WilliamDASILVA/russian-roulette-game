const fs = require('fs')
const path = require('path')

const words = {}
const letters = {}

/**
 * Preload all the available languagages
 */
const availableLanguages = ['en', 'fr']
availableLanguages.forEach(language => {
  const wordsFile = fs.readFileSync(path.resolve(__dirname, `./dictionnaries/${language}/words.txt`), 'utf-8')
  const wordsContent = wordsFile
    .split('\n')
    .filter(word => word.length >= 2)
    .map(word => word.toLowerCase())
    .map(word => word.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))

  words[language] = wordsContent

  const lettersFile = fs.readFileSync(path.resolve(__dirname, `./dictionnaries/${language}/letters-2.txt`), 'utf-8')
  letters[language] = lettersFile
    .split('\n')
})

function getWords(language) {
  return words[language]
}

function getLetters(language) {
  return letters[language]
}

module.exports = {
  getWords,
  getLetters
}
