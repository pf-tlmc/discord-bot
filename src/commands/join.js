async function join (client, message) {
  if (!message.guild) {
    return message.reply('You must be in a Discord server.')
  }
  if (client._data.voiceConnections[message.guild.id]) {
    return message.reply('Already in a voice channel. Type `!tlmc leave` to change channels.')
  }
  if (!message.member.voice.channel) {
    return message.reply('You must be in a voice channel first.')
  }

  const voiceConnections = client._data.voiceConnections
  voiceConnections[message.guild.id] = true

  try {
    voiceConnections[message.guild.id] = await message.member.voice.channel.join()
    message.reply('Joined!')
  } catch (err) {
    delete voiceConnections[message.guild.id]
    message.reply(`Error joining voice channel: ${err.message}`)
  }
}

module.exports = join
