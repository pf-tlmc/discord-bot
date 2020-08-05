const HELP_TEXT = `
\`\`\`
help             Display this text

join             Join a voice channel
leave            Leave the current voice channel

play [songId]    Play a song; Use '!tlmc join' first
\`\`\`
`.trim()

function help (message) {
  message.channel.send(HELP_TEXT)
}

module.exports = help
