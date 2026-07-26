const { Events, MessageFlags } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(message) {
		if (!message.isChatInputCommand()) return;

		const command = message.client.commands.get(message.commandName);

		if (!command) {
			console.error(`No command matching ${message.commandName} was found.`);
			return;
		}

		try {
			await command.execute(message);
		} catch (error) {
			console.error(error);
			if (message.replied || message.deferred) {
				await message.followUp({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await message.reply({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	},
};