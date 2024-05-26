
const { MessageEmbed } = require("discord.js");
const config = require("../../config");
const client = require("../../index");
const { default: mongoose } = require("mongoose");
const ms = require("ms");
const humanizeDuration = require("humanize-duration");

client.on("interactionCreate", async (interaction) => {
    if(!interaction.guild || !interaction.isCommand()) return;
    const lang = client.guildSettings.get(interaction.guild.id)?.lang || "ar";
    const i18n = client.I18n;
    const cooldowns = client.cooldowns;
    const cmd = interaction.commandName;
    let command = client.slashCommands.get(cmd);
    if(!command) return;
   
    let checkCoolDown = cooldowns.get(`${interaction.guildId}-${interaction.user.id}-${command.name}-slash`);
    if(checkCoolDown) {
        let time = checkCoolDown.time - Date.now();
        if(time > 0 && !checkCoolDown.reply) {
            checkCoolDown.reply = true;
            await interaction.reply({ ephemeral:true,embeds: [new MessageEmbed().setDescription(i18n.t("cooldown",lang, {time: humanizeDuration(time, {
                language: lang,
                round:true,
                units: ["m","h","s","d"]
            })}) )] }).catch(err => null)
        };
        
        if(time > 0) return null;
    };
    if(command.flags?.developerOnly && !config.developers.includes(interaction.user.id)) return interaction.reply({ content: i18n.t("developerOnly",lang), ephemeral: true });
    if(!command.flags?.noReply) await interaction.deferReply({ ephemeral: command.flags?.ephemeral || false }).catch(err => null);
    if(command?.botPermission && !interaction.guild.members.me.permissions.has(command?.botPermission)) return interaction.replied ? interaction.followUp({ embeds: [new MessageEmbed().setDescription(i18n.t("noPermissionBot",lang, {permissions: `\`${command.botPermission.toArray().join(", ")}\``} ))] }) : interaction.reply({ ephemeral:true,embeds: [new MessageEmbed().setDescription(i18n.t("noPermissionBot",lang, {permissions: `\`${command.botPermission.toArray().join(", ")}\``} ))] });
    if(command?.Permissions && !interaction.member.permissions.has(command.Permissions) && !command?.roles?.find(d =>  interaction.member.roles.cache.get(d))) return interaction.replied ? interaction.followUp({ embeds: [new MessageEmbed().setDescription(i18n.t("noPermmisionUser",lang,{permissions: `\`${command.Permissions.toArray().join(", ")}\``}))] }) : interaction.reply({ ephemeral:true,embeds: [new MessageEmbed().setDescription(i18n.t("noPermmisionUser",lang,{permissions: `\`${command.Permissions.toArray().join(", ")}\``}))] });
    if(command.flags?.mongodb && mongoose.connection.readyState !== 1) return config.developers.includes(interaction.user.id) ? interaction.replied ? interaction.followUp({ embeds: [new MessageEmbed().setDescription(i18n.t("noMongoDB",lang))] }) : interaction.reply({ ephemeral:true,embeds: [new MessageEmbed().setDescription(i18n.t("noMongoDB",lang))] }) : null;
    if(command.flags?.ownerOnly && interaction.guild.ownerId !== interaction.user.id) return interaction.replied ? interaction.followUp({ embeds: [new MessageEmbed().setDescription(i18n.t("ownerOnly",lang))] }) : interaction.reply({ ephemeral:true,embeds: [new MessageEmbed().setDescription(i18n.t("ownerOnly",lang))] });
    command.run(client,interaction).catch((err) => console.error(err))
    cooldowns.set(`${interaction.guildId}-${interaction.user.id}-${command.name}-slash`, {time: Date.now() + ms(command.cooldown), reply: false});
    if(ms(command.cooldown) > 0 && ms(command.cooldown) < 2147483647 )  {
        setTimeout(() => {
            cooldowns.delete(`${interaction.guildId}-${interaction.user.id}-${command.name}-slash`);
        }, ms(command.cooldown));
    }





    


    





})