const fs = require('fs')
const path = require('path')

const file = fs.readFileSync(path.resolve(__dirname, './dictionnary.txt'), 'utf-8')
const words = file.split('\n').map(word => word.toLowerCase())

module.exports = {
  words
}
