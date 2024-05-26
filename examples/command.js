const { Permissions, Message } = require("discord.js");






module.exports = {
    name: 'ping',
    Aliases: ["p"],
    description: 'Ping!',
    cooldown: "1m",
    Permissions:  new Permissions("ADMINISTRATOR"),
    botPermission: new Permissions("ADMINISTRATOR"),
    roles: [],
    dependencies: ['discord.js@13'],
    flags: {
        developerOnly: true,
        mongodb: false,
        ownerOnly: true,
    },

    /**
     * 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async run(message, args) {
        let msg = await message.channel.send('Pinging...');
        msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(message.client.ws.ping)}ms`).catch(console.error);

    },
}