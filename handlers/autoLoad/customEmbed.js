
const config = require("../../config");
const OriginalMessageEmbed = require("discord.js").MessageEmbed;
class MessageEmbed extends OriginalMessageEmbed {
    constructor() {
        super();
        this.setColor(this.color || config.embedColor);
     //   this.setTimestamp();
     /*   this.setFooter(this.footer || {
            text: "Euiz Handler v0.0.1",
            iconURL: "https://d.top4top.io/p_3067ck7kr1.png",
        });*/
    }
};

require.cache[require.resolve("discord.js")].exports.MessageEmbed = MessageEmbed;
