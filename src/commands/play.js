const { MessageEmbed } = require('discord.js')
const songs = require('../songs')
const { urlEncode } = require('../utils')

async function play (client, message, songId) {
  if (!message.guild) {
    return message.reply('You must be in a Discord server.')
  }
  if (!client._data.voiceConnections[message.guild.id]) {
    return message.reply('Not currently in any voice channel. Type `!tlmc join` first.')
  }

  songId = +songId
  if (!songId || !(songId >= 1 && songId <= songs.length)) {
    return message.reply(`Invalid songId \`${songId}\``)
  }

  const voiceConnection = client._data.voiceConnections[message.guild.id]
  const song = songs[songId]
  voiceConnection.play(`${process.env.TLMC_SERVE}/api/tlmc${urlEncode(song.path)}`, { volume: 0.4 })
  message.channel.send(
    new MessageEmbed()
      .setTitle(song.meta.TITLE)
      .setURL(`${process.env.TLMC_SERVE}/tlmc${urlEncode(song.path, true)}`)
      .setThumbnail(`${process.env.TLMC_SERVE}/api/thumbnail?cue=${urlEncode(song.path, true)}`)
      .setFooter(song.path)
  )
}

module.exports = play
