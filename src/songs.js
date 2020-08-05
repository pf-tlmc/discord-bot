const fs = require('fs')
const path = require('path')
const { deserialize } = require('ls-serialize')
const { parseCue, getNodeType, getFileName } = require('./utils')

const LS_CACHE_PATH = path.resolve(__dirname, '../.cache/ls')
const CUE_CACHE_PATH = path.resolve(__dirname, '../.cache/cue')

const ls = deserialize(fs.readFileSync(LS_CACHE_PATH).toString())

const cue = fs.readFileSync(CUE_CACHE_PATH).toString()
  .split('===\n')
  .reduce((acc, curr) => {
    const lines = curr.split('\n')
    const head = lines.shift()
    try {
      acc[head] = parseCue(lines)
    } catch (err) {
      console.log(err)
      console.log(lines.join('\n'))
    }
    return acc
  }, {})

const songs = []

// Attach metadata
;(function attach (node = ls) {
  for (const file of node) {
    if (file.isDirectory) {
      attach(file)
    } else if (getNodeType(file) === 'ALBUM') {
      const cueSheet = cue[file.path]
      const parent = file.parent
      if (!cueSheet) {
        console.error(`Missing cue sheet for ${file.path}`)
      } else {
        file.meta = cueSheet
        for (const track of cueSheet._child.TRACK) {
          const audioFile = parent.get(getFileName(track))
          if (!audioFile) {
            console.error(`Audio file not found at ${file.path}:`, track)
          } else if (audioFile.meta) {
            console.error(`Duplicate file found at ${file.path}:`, track)
          } else {
            audioFile.meta = track
            songs.push(audioFile)
          }
        }
      }
    }
  }
})()

module.exports = songs
