const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder().setName('server').setDescription('Provides information about the server.'),
	async execute(message) {
		
		await message.reply(
			`This server is ${message.guild.name} and has ${message.guild.memberCount} members.`,
		);
	},
};