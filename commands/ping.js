const {  Message, Client } = require("discord.js");


module.exports = {
    name: 'ping',
    Aliases: ["p"],
    description: 'Ping!',
    cooldown: "1m",
    Permissions:  null,
    botPermission: null,
    roles: [],
    dependencies: [],
    flags: {
        developerOnly: true,
        ownerOnly: false,
        mongodb: false,
    },
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args 
     */
    async run(client,message, args) {
        let msg = await message.channel.send('Pinging...');
        msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms.\n API Latency is ${Math.round(message.client.ws.ping)}ms`).catch(console.error);
    },
}