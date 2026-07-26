const { Events, MessageFlags, Collection } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(message) {
		if (!message.isChatInputCommand()) return;

		const command = message.client.commands.get(message.commandName);

		if (!command) {
			console.error(`No command matching ${message.commandName} was found.`);
			return;
		}

		const { cooldowns }  = message.client;

		if(!cooldowns.has(command.data.name)){
			cooldowns.set(command.data.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const defaultCooldownDuration = 3;
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;
		
		if(timestamps.has(message.user.id)){
			const expirationTime = timestamps.get(message.user.id) + cooldownAmount;

			if(now < expirationTime) {
				const expiredTimestamp = Math.round(expirationTime / 1_000);
				return message.reply({
					content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
					flags: MessageFlags.Ephemeral, 
				
				});
			}
		}
		timestamps.set(message.user.id, now);
		setTimeout(() => timestamps.delete(message.user.id), cooldownAmount);

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