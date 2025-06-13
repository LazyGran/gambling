const { SlashCommandBuilder, EmbedBuilder, } = require("discord.js")    
const { Random }                             = require("random-js")
const eh    = require('../handlers/errorHandler.js')    
const dh    = require('../handlers/dataHandler.js')
const dev   = require('../handlers/dev.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("crime")
        .setDescription("Rob someone."),
                    
    async execute(interaction, userStats)
    {
        await interaction.deferReply()

        if((Date.now() - userStats.lastcrime) < 300000) return eh.error(interaction, "Criminal... Chill out for a while");

        const random    = new Random()
        const lucky     = random.integer(1, 100)

        let n               = random.integer(5, 100)
        if(lucky === 7) n   = n*2;
        
        userStats.chips     = userStats.chips + n
        userStats.lastcrime = Date.now()

        const embed = new EmbedBuilder()
        .setTitle(`Brokey...`)
        .setDescription(`You commit a crime for some money, exchange it for ${n} chips \nUse it to gamble.`)

        await dh.userSave(userStats)

        try     { await interaction.editReply({ embeds: [embed] }) }
        catch   { dev.log("Failed to respond \n cmdID: 5, Error: 1", 2) }
    }
}