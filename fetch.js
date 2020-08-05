require('dotenv').config()

const getLs = require('./scripts/get-ls')
const getCue = require('./scripts/get-cue')

;(async () => {
  try {
    await getLs()
    await getCue()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
