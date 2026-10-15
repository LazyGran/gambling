const { SlashCommandBuilder, EmbedBuilder, MessageAttachment, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")	
const path		= require("path")
const dh 		= require("../handlers/dataHandler.js")
const eh 		= require("../handlers/errorHandler.js")
const dev   	= require('../handlers/dev.js')

module.exports = 
{
	data: new SlashCommandBuilder()
	.setName("challenge")
	.setDescription("Challenge someone else!")
	.addSubcommand(subcommand => subcommand
		.setName("coinflip")
		.setDescription("50/50, who will win?")
		.addIntegerOption(option => option
			.setName("bet")
			.setDescription("Your bet")
			.setRequired(true)
		)
	),

	async execute(interaction, userStats)
	{
	    await interaction.deferReply()

		const bet 			= interaction.options.getInteger('bet')
		const subcommand 	= interaction.options.getSubcommand();
		const UID			= interaction.user.id
		const game 			= require(`../versus/${subcommand}.js`) 

		if(!userStats.active_game)
		{			
			if(bet > userStats.chips) 	{ return eh.error(interaction, "You don't have enough chips!") }

			const embed = new EmbedBuilder()
			.setTitle(`Them vs You`)
			.setDescription(`${interaction.user} challenges the chat! \n**Game:** "${subcommand}" \n**Wager:** ${bet}`)

			userStats.active_game 	= true
			userStats.chips 		= userStats.chips - bet

			game.main(userStats, opponentStats, interaction, embed, bet)
        	await dh.userSave(interaction.user.id, userStats)		
        }
		else
		{
			eh.error(interaction, "You are already playing a game!")
		}
	}
}
