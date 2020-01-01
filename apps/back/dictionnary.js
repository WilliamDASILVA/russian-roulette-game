const fs = require('fs')
const path = require('path')

const wordsFile = fs.readFileSync(path.resolve(__dirname, './dictionnaries/fr/words.txt'), 'utf-8')
const words = wordsFile
  .split('\n')
  .filter(word => word.length >= 2)
  .map(word => word.toLowerCase())
  .map(word => word.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))

const lettersFile = fs.readFileSync(path.resolve(__dirname, './dictionnaries/fr/letters-2.txt'), 'utf-8')
const letters = lettersFile
  .split('\n')

module.exports = {
  words,
  letters
}
