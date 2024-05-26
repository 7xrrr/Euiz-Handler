const config = require("../../config");
const client = require("../../index");


client.on("interactionCreate", async (interaction) => {
    if(!interaction.isAutocomplete() || !interaction.guild) return;
    const cmd = interaction.commandName;
    const command = client.slashCommands.get(cmd);
    if(!command) return;
    if(command?.Permissions && !interaction.member.permissions.has(command.Permissions) && !command?.roles?.find(d =>  interaction.member.roles.cache.get(d))) return;
    if(command.flags?.ownerOnly && interaction.guild.ownerId !== interaction.user.id) return 
    if(command.flags?.developerOnly && !config.developers.includes(interaction.user.id)) return
    if(command.autoComplete) {
        console.log("AutoComplete")
       await command.autoComplete(interaction).catch(err => console.error(err))
    }




    


    





})