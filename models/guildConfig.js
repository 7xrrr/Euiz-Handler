
const { default: mongoose } = require("mongoose");
const config = require("../config");

const guildConfig = new mongoose.Schema({
    guildId: {
      required: true,
      type: String,
    },
    lang: {
        type: String,
        default: "en"
    },
    prefix: {
       type: String,
       default: config.prefix
    },


    
}, { timestamps: { createdAt: 'Created at' }});

module.exports = mongoose.model('guildConfig', guildConfig);