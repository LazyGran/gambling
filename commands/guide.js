const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")	
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
		await interaction.deferReply()

		const chosen 	= interaction.options.getString("game") || 0
		const final		= array[chosen]

		const embed = new EmbedBuilder()
        .setTitle(`Guide`)
        .setDescription(final)

        try     { await interaction.editReply({ embeds: [embed] }) }
        catch   { dev.log("Failed to respond \n cmdID: 4, Error: 1") }
	}
}