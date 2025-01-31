
const { MessageEmbed } = require("discord.js");
const config = require("../../config");
const client = require("../../index");
const { default: mongoose } = require("mongoose");
const ms = require("ms");
const humanizeDuration = require("humanize-duration");
//const CustomEmbed = require("../../handlers/autoLoad/customEmbed");


client.on("messageCreate", async (message) => {
    const perfix = client.guildSettings.get(message.guild.id)?.prefix || config.prefix;
    const lang = client.guildSettings.get(message.guild.id)?.lang || "ar";
    if(!message.guild || message.author.bot || !message.content || !message.content.startsWith(perfix)) return;
    const i18n = client.I18n;
   
    const cooldowns = client.cooldowns;
    const args = message.content.trim().split(/ +/);
    const cmd = args.shift().slice(perfix.length).toLowerCase();

    // trying to get the command
       let command = client.commands.find((c) => c.name === cmd || c?.Aliases?.map(a => a.toLowerCase().trim()).includes(cmd))
       if(!command) return;
       if(command.flags?.developerOnly && !config.developers.includes(message.author.id)) return;
       let checkCoolDown = cooldowns.get(`${message.guildId}-${message.author.id}-${command.name}`);
       if(checkCoolDown) {
        let time = checkCoolDown.time - Date.now();

        if(time > 0 && !checkCoolDown.reply) {
            checkCoolDown.reply = true;
            await message.channel.send({ embeds: [new MessageEmbed().setDescription(i18n.t("cooldown",lang, {time: humanizeDuration(time, {
                language: lang,
                round:true,
                units: ["m","h","s","d"]
            })}))] }).then((msg) => setTimeout(() => {
                     msg.delete().catch(err => null);
            }, ms("5s"))).catch(err => null)
        }
      
        if(time > 0) return null;

            
       };

       /// permissions handler
       if(command?.botPermission && !message.guild.members.me.permissions.has(command?.botPermission)) return message.channel.send({ embeds: [new MessageEmbed().setDescription(i18n.t("noPermissionBot",lang, {permissions: `\`${command.botPermission.toArray().join(", ")}\``} ))] });
       if(command?.Permissions && !message.member.permissions.has(command.Permissions) && !command?.roles?.find(d =>  message.member.roles.cache.get(d))) return message.channel.send({ embeds: [new MessageEmbed().setDescription(i18n.t("noPermmisionUser",lang,{permissions: `\`${command.Permissions.toArray().join(", ")}\``}))] });
       if(command.flags?.mongodb && mongoose.connection.readyState !== 1) return config.developers.includes(message.author.id) ? message.channel.send({ embeds: [new MessageEmbed().setDescription(i18n.t("noMongoDB",lang))] }) : null;
       if(command.flags?.ownerOnly && message.guild.ownerId !== message.author.id) return message.channel.send({ embeds: [new MessageEmbed().setDescription(i18n.t("ownerOnly",lang))] });






       // run the command + cooldown
        command.run(client,message,args).catch(err => message.channel.send({ embeds: [new MessageEmbed().setDescription(i18n.t("error",lang))] }));
        cooldowns.set(`${message.guildId}-${message.author.id}-${command.name}`, {time: Date.now() + ms(command.cooldown), reply: false});
        if(ms(command.cooldown) > 0 && ms(command.cooldown) < 2147483647 )  {
            setTimeout(() => {
                cooldowns.delete(`${message.guildId}-${message.author.id}-${command.name}`);
            }, ms(command.cooldown));
        }
       


    





})