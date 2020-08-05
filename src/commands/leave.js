async function leave (client, message) {
  if (!message.guild) {
    return message.reply('You must be in a Discord server.')
  }
  if (!client._data.voiceConnections[message.guild.id]) {
    return message.reply('Not currently in any voice channel.')
  }

  const voiceConnections = client._data.voiceConnections
  voiceConnections[message.guild.id].disconnect()
  delete voiceConnections[message.guild.id]
  message.reply('Left the voice channel.')
}

module.exports = leave
