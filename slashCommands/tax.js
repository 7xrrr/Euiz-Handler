const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { SlashCommandStringOption } = require('@discordjs/builders');
const numeral = require("numeral");







module.exports = {
    name: 'tax',
    description: 'حساب ضريبة برو بوت',
    cooldown: "30s",
    Permissions:  null,
    botPermission: null,
    /**@type {import("discord.js").ApplicationCommandOption[]} */
    options: [
       new SlashCommandStringOption().setDescription("المبلغ").setName("amount").setRequired(true)
       .setMaxLength(25)
       .setMinLength(1)
    ],
    roles: [],
    dependencies: [],
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction 
     */



    async run(client,interaction) {
        const amount = numeral(interaction.options.getString("amount").toLowerCase()).value();
        if (isNaN(amount) || !amount) return interaction.editReply({ embeds: [new MessageEmbed().setDescription(`- **الرجاء كتابة القيمة بشكل صحيح**`)] });
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
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            })
            .setTitle(`**ضريبة برو بوت**`)
            .setFooter({
                text: `ProBot Tax`,
                iconURL: client.user.displayAvatarURL({dynamic:true})

            })








       await interaction.editReply({ embeds: [embed] }).catch(console.error);

        

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
