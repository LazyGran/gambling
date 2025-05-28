const { SlashCommandBuilder, EmbedBuilder, MessageAttachment, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")	
const jsonfile	= require("jsonfile")
const path		= require("path")
const dh 		= require("../handlers/dataHandler.js")
const eh 		= require("../handlers/errorHandler.js")

module.exports = 
{
	data: new SlashCommandBuilder()
	.setName("play")
	.setDescription("Play a game")
	.addSubcommand(subcommand => subcommand 
		.setName("highorlow")
		.setDescription("Play High or Low")
		.addIntegerOption(option => option
			.setName("bet")
			.setDescription("Your bet")
			.setRequired(false)
		)
	)
	.addSubcommand(subcommand => subcommand
		.setName("seventeen")
		.setDescription("Play Seventeen + Four")
		.addIntegerOption(option => option
			.setName("bet")
			.setDescription("Your bet")
			.setRequired(false)
		)
	),

	async execute(interaction, userStats)
	{
		await interaction.deferReply()

		const bet 			= interaction.options.getInteger('bet') || 50
		const subcommand 	= interaction.options.getSubcommand();
		const UID			= interaction.user.id
		const game 			= require(`../games/${subcommand}.js`) 

		if(!userStats.active_game)
		{
			if(bet > userStats.chips) 	{ return eh.error(interaction, "You don't have enough chips!") }
			if(bet > 5000)				{ return eh.error(interaction, "You can only bet up to 5.000 chips!") }

			//userStats.active_game 	= true
			userStats.chips 		= userStats.chips - bet

			game.main(interaction, bet, userStats, UID)
        	await dh.userSave(interaction.user.id, userStats)		
        }
		else
		{
			eh.error(interaction, "You are already playing a game!")
		}
	}
}