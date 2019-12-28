const LETTERS_TO_USE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V']

module.exports = class Player {
  constructor (socketId, name) {
    this.id = socketId
    this.name = name
    this.heart = 3
    this.lettersToUse = LETTERS_TO_USE
    this.hasUsedAllLetters = false
  }
  
  reset () {
    this.heart = 3
    this.lettersToUse = LETTERS_TO_USE
    this.hasUsedAllLetters = false
  }
}
