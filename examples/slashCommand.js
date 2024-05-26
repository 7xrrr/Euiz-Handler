const { Permissions, Message, Client,Options, CommandInteraction, AutocompleteInteraction } = require("discord.js");







module.exports = {
    name: 'ping',
    description: 'Ping!',
    cooldown: "1m",
    Permissions:  new Permissions("ADMINISTRATOR"),
    botPermission: new Permissions("ADMINISTRATOR"),
    /**@type {import("discord.js").ApplicationCommandOption[]} */
    options: [
        {
            name: "username",
            description: "The username of the user",
            autocomplete: true,
            type: "STRING",
        }
    ],
    roles: [],
    dependencies: ['discord.js@13'],
    flags: {
        noReply: false,
        developerOnly: false,
        ephemeral: true,
        ownerOnly: false,
        mongodb: false,
    },
    /**
     * 
     * @param {AutocompleteInteraction} interaction 
     * @returns 
     */
    autoComplete: async (interaction) => {
        const focusedValue = interaction.options.getFocused();

        const choices = ['Popular Topics: Threads', 'Sharding: Getting started', 'Library: Voice Connections', 'Interactions: Replying to slash commands', 'Popular Topics: Embed preview'];
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		); 
    },

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction 
     */



    async run(client,interaction) {
        interaction.editReply({
            content: "Pong!"
        })
        

    },
}