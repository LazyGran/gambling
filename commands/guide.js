const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")	

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

		const testarray = [ "all", "horl", "roul", "seven" ]
		const chosen 	= interaction.options.getString("game") || 0
		const final		= testarray[chosen]

		const embed = new EmbedBuilder()
        .setTitle(`Guide`)
        .setDescription(final)

        try     { await interaction.editReply({ embeds: [embed] }) }
        catch   { console.log("Failed to respond \n cmdID: 4, Error: 1") }
	}
}