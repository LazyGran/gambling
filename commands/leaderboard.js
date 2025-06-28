const { SlashCommandBuilder, EmbedBuilder, } = require("discord.js")    
const eh    = require("../handlers/errorHandler.js")
const dh    = require("../handlers/dataHandler.js")
const dev   = require('../handlers/dev.js')

module.exports = 
{
    data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the global leaderboard"),

    async execute(interaction)
    {
        await interaction.deferReply()

        try     { await interaction.editReply({ embeds: [embed] }) }
        catch   { dev.log("Failed to respond \n cmdID: 7, Error: 1", 2) }  
    }
}