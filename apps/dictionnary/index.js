const { app } =  require('./server')
const { availableLocales } = require('./config')
const { getLetters, getWords } = require('./dictionnary')

const localeMiddleware = (req, res, next) => {
  const { locale } = req.params
  if (locale && !availableLocales.includes(locale)) {
    res.status(400).send({
      error: 'Locale not supported.'
    })
    return false
  }

  next()
}

app.get('/locales', (req, res) => {
  res.status(200).send({
    locales: availableLocales
  })
})

app.get('/locales/:locale/letters', localeMiddleware, (req, res) => {
  let lengthToUse = Math.round(Math.random()) + 2
  const { locale } = req.params
  const { length } = req.query

  if (length && parseInt(length, 10) <= 1 || parseInt(length, 10) >= 4) {
    res.status(400).send({
      error: 'Length must be between 2 or 3.'
    })
    return false
  }

  if (length) {
    lengthToUse = length
  }

  const letters = getLetters(locale, lengthToUse)
  const letterIndex = Math.floor(Math.random() * letters.length)

  res.status(200).send({
    letter: letters[letterIndex]
  })
})

app.post('/locales/:locale/words', localeMiddleware, (req, res) => {
  const { locale } = req.params
  const { word } = req.body

  const words = getWords(locale)
  const transformedWord = word
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  const isInDictionnary = words.includes(transformedWord)
  if (isInDictionnary) {
    res.status(204).send({})
  } else {
    res.status(404).send({
      error: `Word does not belong to the "${locale}" dictionnary.`
    })
  }
})
