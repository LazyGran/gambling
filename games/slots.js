const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } 	= require("discord.js")
const { Random }                                                     	= require('random-js')
const dh 	= require("../handlers/dataHandler.js")
const eh 	= require("../handlers/errorHandler.js")
const ch    = require('../handlers/cardHandler.js')
const xh	= require('../handlers/xpHandler.js')
const dev   = require('../handlers/dev.js')

const random 	= new Random()

async function main(interaction, bet, userStats)
{
	const embed = new EmbedBuilder()
	.setColor("#259dd9")
	.setTitle("Slots")
	.setDescription("Placeholder")

	try 	{ initial = await interaction.editReply({ embeds: [embed] }) }
	catch 	{ dev.log("Failed to respond \n GameID: 7, Error: 1", 2) }
}

async function spin()
{

}


module.exports =
{
    main,
}