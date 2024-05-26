
const client = require("../index");
const guildConfig = require("../models/guildConfig");
client.setMaxListeners(99);




client.on("ready", async () => {  
    console.log(`Logged in as ${client.user.tag}`);
    const guildsData = await guildConfig.find();
    guildsData.forEach(guild => {
        client.guildSettings.set(guild.guildId, guild);
    });









    console.table({"Client":{
        Username: client.user.tag,
        ID: client.user.id,
        Commands: `${client.commands.size} Commands | ${client.slashCommands.size} Slash`,
        guilds: client.guilds.cache.size,
        Settings: client.guildSettings.size,
    }
})

    
    
    
    
 






})

