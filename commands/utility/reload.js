const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('reloads a command.')
    .addStringOption((option) => option.setName('command').setDescription('the command to reload').setRequired(true)),
    async execute(message){
        const commandName = message.options.getString('command', true).toLowerCase();
		const command = message.client.commands.get(commandName);
		if (!command) {
			return message.reply(`There is no command with name \`${commandName}\`!`);
		}

        delete require.cache[require.resolve(`./${command.data.name}.js`)];

        try {
            const newCommand = require(`./${command.data.name}.js`);
            message.client.commands.set(newCommand.data.name, newCommand);
            await message.reply(`Command \`${newCommand.data.name}\` was reloaded.`);
        } catch (error) {
            console.error(error);
            await message.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
        }
    },
}