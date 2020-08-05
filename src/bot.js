require('dotenv').config()
const Discord = require('discord.js')
const { tokenize } = require('./utils')

const client = new Discord.Client()
const COMMAND_REGEX = /^!tlmc\b/
const COMMANDS = {
  help: require('./commands/help'),
  join: require('./commands/join'),
  leave: require('./commands/leave'),
  play: require('./commands/play')
}

client._data = {
  voiceConnections: {}
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', (message) => {
  if (!message.author.bot && COMMAND_REGEX.test(message.content)) {
    const [, command, ...args] = tokenize(message.content)
    if (!command) {
      return message.reply('No command specified. Try `!tlmc help`.')
    }

    const handler = COMMANDS[command]
    if (!handler) {
      return message.reply(`Unknown command \`${command}\`.`)
    }

    handler(client, message, ...args)
  }
})

client.login(process.env.DISCORD_TOKEN)
