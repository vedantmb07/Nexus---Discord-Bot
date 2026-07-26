const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder().setName('user').setDescription('Provides information about the user.'),
    async execute(message) {
        await message.reply(`This command was run by ${message.user.username}, who joined on ${message.member.joinedAt} `);
    }
}