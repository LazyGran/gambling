const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require("discord.js")	
const fs	= require('fs')
const path	= require('path')
const dev   = require('../handlers/dev.js')

const filePath      = path.join("database/", 'guide.txt')   
const fileContent   = fs.readFileSync(filePath, 'utf-8')   
const array         = fileContent.split('S P L I T')   

var games =  
[
    { name: "High or Low", value: "1"}, 
    { name: "Roulette", value: "2"},
    { name: "Seventeen + Four", value: "3"}
]

module.exports = 
{
	data: new SlashCommandBuilder()
	.setName("guide")
	.setDescription("See how things work")
	.addStringOption(option => option
		.setName("game")
		.setDescription("Tips for a specific game")
		.setRequired(false)
		.addChoices(games)
	),

	async execute(interaction, userStats)
	{
		const initial 	= await interaction.deferReply()

		const embed 	= new EmbedBuilder()
		const menu 		= new StringSelectMenuBuilder()
		.setCustomId("Switch page")
		.setPlaceholder("Get help about something else")
		.addOptions(
			new StringSelectMenuOptionBuilder()
			.setLabel("Overview")
			.setDescription("General overview")
			.setValue("0"),
			new StringSelectMenuOptionBuilder()
			.setLabel("High or Low")
			.setDescription("Rules, Deck & Card values")
			.setValue("1"),
			new StringSelectMenuOptionBuilder()
			.setLabel("Roulette")
			.setDescription("Odds, Meanings, Payout")
			.setValue("2"),
			new StringSelectMenuOptionBuilder()
			.setLabel("Seventeen + Four")
			.setDescription("Rules, Deck & Card values")
			.setValue("3"),
		)

		const row = new ActionRowBuilder().addComponents(menu)

		var chosen 	= interaction.options.getString("game") || "0"
		var final	= array[chosen]

		sendEmbed()

		const selected	= await initial.createMessageComponentCollector({ time: 30_000 })

		selected.on('collect', async selection =>
		{
			selection.deferUpdate()
			final = array[selection.values]

			sendEmbed()
		})

		selected.on('end', async collected =>
		{
			row.components = []

		    try     { await interaction.editReply({ embeds: [embed], components: [] }) }
		    catch   { dev.log("Failed to respond \n cmdID: 4, Error: 2") }
		})

		async function sendEmbed()
		{
			embed
		    .setTitle(`Guide`)
		    .setDescription(final)

		    try     { await interaction.editReply({ embeds: [embed], components: [row] }) }
		    catch   { dev.log("Failed to respond \n cmdID: 4, Error: 1") }
		}
	}
}