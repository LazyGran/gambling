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

        let desc    = ""
        let n       = random.integer(50, 500)

        dev.log(userStats.chips)
        dev.log(n) 

        if     (lucky <= 34)            
        {
            desc                = `You commit a crime for some money, exchange it for **${n} Chips** \nUse it to gamble.`
            userStats.chips     = userStats.chips + n
            userStats.lastcrime = Date.now()
        }

        else if(userStats.chips < n)    
        {
            desc                = `You commit a crime but get caught. \nSince you're broke they just laugh and lets you go.`
            userStats.lastcrime = Date.now()
        }
        else            
        {
            desc                = `You commit a crime for but get caught, they **take ${n} Chips** from you and let you go.`
            n                   = n * (-1)
            userStats.chips     = userStats.chips + n
            userStats.lastcrime = Date.now()
        }
    
        dev.log(userStats.chips)

        const embed = new EmbedBuilder()
        .setTitle(`Brokey...`)
        .setDescription(desc)

        await dh.userSave(userStats)

        try     { await interaction.editReply({ embeds: [embed] }) }
        catch   { dev.log("Failed to respond \n cmdID: 5, Error: 1", 2) }
    }
}