const { SlashCommandBuilder, EmbedBuilder, } = require("discord.js")    
const { Random }                             = require("random-js")
const fs    = require('fs')
const path  = require('path')
const xh    = require('../handlers/xpHandler.js')
const eh    = require('../handlers/errorHandler.js')    
const dh    = require('../handlers/dataHandler.js')
const dev   = require('../handlers/dev.js')

const filePath      = path.join("database/", 'beg.txt')   
const fileContent   = fs.readFileSync(filePath, 'utf-8')   
const lines         = fileContent.split('\n')  
const array         = []

for(i = 0; i < lines.length; i += 2)
{
    const first     = lines[i]
    const second    = lines[i + 1] 

    array.push(`${first}\n${second}`)
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("beg")
        .setDescription("Broke? Beg for money"),
                    
    async execute(interaction, userStats)
    {
        await interaction.deferReply()

        if((Date.now() - userStats.lastbeg) < 300000) return eh.error(interaction, "Give it a bit until you can beg again");

        const random    = new Random()
        const lucky     = random.integer(1, 10)
        const r         = random.integer(0, array.length - 1)
        const response  = array[r]

        dev.log(r)
        dev.log(response)

        let n               = random.integer(10, 100)
        if(lucky === 7) n   = n*2;
        
        userStats.chips     = userStats.chips + n
        userStats.lastbeg   = Date.now()

        const embed = new EmbedBuilder()
        .setTitle(`Brokey...`)
        .setDescription(`${response} \n-# Gained **${n}** Chips`)

        await xh.leveling(userStats, 5)
        await dh.userSave(userStats)

        try     { await interaction.editReply({ embeds: [embed] }) }
        catch   { dev.log("Failed to respond \n cmdID: 3, Error: 1", 2) }
    }
}