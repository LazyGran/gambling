const { SlashCommandBuilder, EmbedBuilder, } = require("discord.js")	

module.exports = 
{
	data: new SlashCommandBuilder()
	.setName("stats")
	.setDescription("Check your stats"),

	async execute(interaction, userStats)
	{
		await interaction.deferReply()

        const { chips, level, xp } = userStats
        
        const embed = new EmbedBuilder()
        .setTitle(`${interaction.user.username}'s info:`)
        .setDescription(`**Money:** ${chips}\n**Level:** ${level}`)

        interaction.editReply({ embeds: [embed] })
    }
}