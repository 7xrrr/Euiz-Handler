const { Message, Client, MessageEmbed } = require("discord.js");
const numeral = require('numeral');


module.exports = {
    name: 'tax',
    Aliases: ["ضريبة"],
    description: 'حساب ضريبة برو بوت',
    cooldown: "30s",
    Permissions: null,
    botPermission: null,
    roles: [],
    dependencies: ["numeral@2.0.6"],
    flags: {
        developerOnly: false,
        ownerOnly: false,
        mongodb: false,
    },
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args 
     */
    async run(client, message, args) {
        let amount = numeral(args[0].toLowerCase()).value();
        if (isNaN(amount) || !amount) return message.reply({ embeds: [new MessageEmbed().setDescription(`- **الرجاء كتابة القيمة بشكل صحيح**`)] });
        
        let normalTax = calculateTax(amount);
        let mediatorTax = calculateTax(normalTax?.amountRequired);
        let embed = new MessageEmbed()


            .addFields(
                {
                    name: `**الضريبة العادية**`,
                    value: `**${normalTax.ProBotTax}**`,
                    inline: false
                },
                {
                    name: `**المبلغ بعد الضريبة العادية**`,
                    value: `**${normalTax.amountRequired}**`,
                    inline: false
                },
                {
                    name: `**ضريبة الوسيط**`,
                    value: `**${mediatorTax.ProBotTax + normalTax.ProBotTax}**`,
                    inline: false
                },
                {
                    name: `**المبلغ بعد ضريبة الوسيط**`,
                    value: `**${mediatorTax.amountRequired}**`,
                    inline: false
                }
            )
            .setTimestamp()
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setTitle(`**ضريبة برو بوت**`)
            .setFooter({
                text: `ProBot Tax`,
                iconURL: client.user.displayAvatarURL({dynamic:true})

            })








       await message.reply({ embeds: [embed] }).catch(console.error);


    },
}




function calculateTax(amount) {
    if (isNaN(Number(amount)) || !amount || amount <= 0) {
        throw new Error("Invalid amount");
    }


    const amountRequired = Math.floor(amount * (20 / 19) + 1);
    const amountAfter = Math.floor(amount - amount * 5 / 100);
    const ProBotTax = Math.floor(amount * 5 / 100);


    return { amountRequired, amountAfter, ProBotTax };
}
