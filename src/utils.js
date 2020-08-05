const IMAGE_REGEX = /\.(jpe?g|png|bmp|tiff|gif)$/i
const ALBUM_REGEX = /\.cue$/i
const SONG_REGEX = /\.mp3$/i

function urlEncode (url, full) {
  return full
    ? url.split('/').map(encodeURIComponent).join('/')
    : url.replace(/#/g, '%23')
}

function tokenize (str) {
  const tokens = []
  const regex = /"([^"\\]*(?:\\.[^"\\]*)*)"|([^\s]+)/g
  let match
  while ((match = regex.exec(str))) {
    tokens.push(match[1] || match[2])
  }
  return tokens
}

function parseCue (cueStr) {
  const cue = {}
  let currIndent = 0
  let node = cue

  for (const line of Array.isArray(cueStr) ? cueStr : cueStr.split('\n')) {
    if (!line.trim()) continue

    // Parse line
    const indent = line.search(/\S/) >> 1
    const [command, ...args] = tokenize(line)

    // Go to level
    while (indent < currIndent) {
      node = node._parent
      --currIndent
    }
    if (indent > currIndent) {
      node = node.TRACK
        ? node.TRACK[node.TRACK.length - 1]
        : node._child || (node._child = { _parent: node })
      currIndent = indent
    }

    // Execute command
    switch (command) {
      case 'REM':
        (node.REM || (node.REM = {}))[args[0]] = args[1]
        break
      case 'TITLE':
      case 'PERFORMER':
      case 'FLAGS':
      case 'INDEX':
        node[command] = args[0]
        break
      case 'FILE':
        node[command] = {
          name: args[0],
          type: args[1]
        }
        break
      case 'TRACK':
        (node.TRACK || (node.TRACK = [])).push({
          number: args[0],
          type: args[1],
          _parent: node
        })
        break
      default:
        throw new Error(`Unkown command: ${command}`)
    }
  }

  return cue
}

function getNodeType (node) {
  if (node.isDirectory) {
    if (!node.isRoot && node.parent.isRoot) return 'CIRCLE'
  }
  if (node.isFile) {
    if (IMAGE_REGEX.test(node.ext)) return 'IMAGE'
    if (ALBUM_REGEX.test(node.ext)) return 'ALBUM'
    if (SONG_REGEX.test(node.ext)) return 'SONG'
  }
  return 'UNKNOWN'
}

function getFileName (track) {
  return `${track.number}. ${track.TITLE}.mp3`
    .replace(/\?/g, '')
    .replace(/[/\\:|]/g, '-')
    .replace(/[<>\t]/g, '_')
    .replace(/\*/g, 'x')
}

module.exports = {
  urlEncode,
  tokenize,
  parseCue,
  getNodeType,
  getFileName
}
