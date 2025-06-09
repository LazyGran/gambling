const { SlashCommandBuilder, EmbedBuilder, } = require("discord.js")    
const { Random }                             = require("random-js")
const xh    = require('../handlers/xpHandler.js')
const eh    = require('../handlers/errorHandler.js')    
const dh    = require('../handlers/dataHandler.js')
const dev   = require('../handlers/dev.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("beg")
        .setDescription("Broke? Beg for money"),
                    
    async execute(interaction, userStats)
    {
        await interaction.deferReply()

        if((Date.now() - userStats.lastbeg) < 300000) return eh.error(interaction, "Give it a bit until you can beg again");

        const random    = new Random()
        const lucky     = random.integer(1, 100)

        let n               = random.integer(5, 50)
        if(lucky === 7) n   = n*2;
        
        userStats.chips     = userStats.chips + n
        userStats.lastbeg   = Date.now()

        const embed = new EmbedBuilder()
        .setTitle(`Brokey...`)
        .setDescription(`You beg for money and someone gives you ${n} chips \nUse it to gamble.`)

        await xh.leveling(userStats, 1)
        await dh.userSave(userStats)

        try     { await interaction.editReply({ embeds: [embed] }) }
        catch   { dev.log("Failed to respond \n cmdID: 3, Error: 1") }
    }
}