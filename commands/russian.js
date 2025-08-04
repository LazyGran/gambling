const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")    
const { Random }                             = require("random-js")
const fs    = require('fs')
const path  = require('path')
const eh    = require('../handlers/errorHandler.js')   
const xh    = require('../handlers/xpHandler.js') 
const dh    = require('../handlers/dataHandler.js')
const dev   = require('../handlers/dev.js')

module.exports = 
{
    data: new SlashCommandBuilder()
        .setName("russian")
        .setDescription("The ultimate test"),
                    
    async execute(interaction, userStats)
    {
        await interaction.deferReply()

		let initial;

        if((Date.now() - userStats.lastrussian) < 300000) return eh.error(interaction, "Don't be so risky... Chill out for a while");

        const trigger = new ButtonBuilder()
		.setCustomId("b_trigger")
		.setLabel("Do it..?")
		.setStyle(ButtonStyle.Danger)

		trigger.setDisabled(true)

        const embed = new EmbedBuilder()
        .setTitle(`Test`)
        .setDescription("Testicles")

        const row 	= new ActionRowBuilder().addComponents(trigger)

		try 	{ initial = await interaction.editReply({ embeds: [embed], components: [row] }) }
        catch   { dev.log("Failed to respond \n cmdID: 9, Error: 1", 2) }
 
	    setTimeout(() => 
		{
			disable(interaction, embed, row, trigger)
		}, 2000)

		const pressed = await initial.createMessageComponentCollector({ time: 7_000 })

		pressed.on('collect', async pressed =>
		{
			pressed.deferUpdate()

			dev.log("1")
		})

		pressed.on('end', async collected =>
		{
			dev.log("2")
		})
    }
}

async function disable(interaction, embed, row, trigger)
{
	trigger.setDisabled(false)

	try 	{ await interaction.editReply({ embeds: [embed], components: [row] }) }
	catch 	{ dev.log("Failed to respond \n GameID: 9, Error: 2", 2) }
}

