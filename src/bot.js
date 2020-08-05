require('dotenv').config()
const Discord = require('discord.js')
const songs = require('./songs')
const { urlEncode } = require('./utils')

const client = new Discord.Client()
let connection

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async (message) => {
  if (message.content === 'tlmc join') {
    if (message.member.voice.channel) {
      try {
        connection = await message.member.voice.channel.join()
        message.reply('Joined voice channel.')
      } catch (error) {
        message.reply('Could not join channel: ' + error.message)
      }
    } else {
      message.reply('You need to join a voice channel.')
    }
  } else if (message.content.startsWith('tlmc play ')) {
    if (!connection) {
      message.reply('Bot is not in a voice channel. Type `tlmc join` first.')
    } else {
      const songIndex = Number(message.content.split(' ')[2])
      if (!songIndex || !(songIndex >= 1 && songIndex <= songs.length)) {
        message.reply('Invalid index.')
      } else {
        const song = songs[songIndex]
        const dispatcher = connection.play(process.env.TLMC_SERVE + '/tlmc' + urlEncode(song.path))
        message.reply('Playing ' + song.path)
      }
    }
  }
})

client.login(process.env.DISCORD_TOKEN)
