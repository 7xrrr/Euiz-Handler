const Discord = require("discord.js");
const { loadCommands } = require("./handlers/commandHandler.js");
const { loadEvents } = require("./handlers/eventHandler.js");
const {loadSlashCommand} = require("./handlers/slashcommandHandler.js")
const config = require("./config.js");
const I18n = require('./handlers/i18n');

const { default: mongoose } = require("mongoose");
const { autoLoad } = require("./handlers/autoRequireHandler.js");

module.exports = client = new Discord.Client({
    intents: 3276799,
    partials: [
        "CHANNEL",
        "GUILD_MEMBER",
        "GUILD_SCHEDULED_EVENT",
        "MESSAGE",
        "REACTION",
        "USER"
    ],
    failIfNotExists: false
});

// Error Handling

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);


// Cache System
client.I18n = new I18n();
client.guildSettings = new Discord.Collection();
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.dependencies = [];



// Load Commands
autoLoad();
loadCommands(client);
loadSlashCommand(client);
loadEvents();






mongoose.connect(config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => { console.log("Connected to MongoDB") }).catch((err) => { console.log(err) });
client.login(config.token);



































