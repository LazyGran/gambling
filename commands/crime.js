const { SlashCommandBuilder, EmbedBuilder, } = require("discord.js")    
const { Random }                             = require("random-js")
const fs    = require('fs')
const path  = require('path')
const eh    = require('../handlers/errorHandler.js')   
const xh    = require('../handlers/xpHandler.js') 
const dh    = require('../handlers/dataHandler.js')
const dev   = require('../handlers/dev.js')

const filePath      = path.join("database/", 'crime.txt')   
const fileContent   = fs.readFileSync(filePath, 'utf-8')   
const first         = fileContent.split('negative')  
const good          = first[0].split('\n').filter(line => line.trim() !== "")
const bad           = first[1].split('\n').filter(line => line.trim() !== "")
const array         = []
const array2        = []

for(i = 0; i < good.length; i += 2)
{
    const first     = good[i]
    const second    = good[i + 1] 

    array.push(`${first}\n${second}`)
}

for(i = 0; i < bad.length; i += 2)
{
    const first     = bad[i]
    const second    = bad[i + 1] 

    array2.push(`${first}\n${second}`)
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("crime")
        .setDescription("Rob someone."),
                    
    async execute(interaction, userStats)
    {
        await interaction.deferReply()

        if((Date.now() - userStats.lastcrime) < 120000) return eh.error(interaction, "Criminal... Chill out for a while");

        const random    = new Random()
        const lucky     = random.integer(1, 100)

        let desc    = ""
        let n       = random.integer(50, 500)

        if     (lucky <= 34)            
        {
            const r         = random.integer(0, array.length - 1)
            const response  = array[r]

            desc                = `${response} \n-# Gained **${n}** Chips`
            userStats.chips     = userStats.chips + n
            userStats.lastcrime = Date.now()

            await xh.achievements(userStats, userStats.chips, true, 0, n, 0, 15)
        }

        else if(userStats.chips < n)    
        {
            desc                = `You commit a crime but get caught. \nSince you're broke they just laugh and let you go.`
            userStats.lastcrime = Date.now()
        }
        else            
        {
            const r         = random.integer(0, array2.length - 1)
            const response  = array2[r]

            desc                = `${response} \n-# Lost **${n}** Chips`
            n                   = n * (-1)
            userStats.chips     = userStats.chips + n
            userStats.lastcrime = Date.now()
        }

        const embed = new EmbedBuilder()
        .setTitle(`Criminal...`)
        .setDescription(desc)

        await dh.userSave(userStats)

        try     { await interaction.editReply({ embeds: [embed] }) }
        catch   { dev.log("Failed to respond \n cmdID: 4, Error: 1", 2) }
    }
}