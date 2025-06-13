const { SlashCommandBuilder, EmbedBuilder, } = require("discord.js")	
const xh    = require('../handlers/xpHandler.js')
const dev   = require('../handlers/dev.js')

module.exports = 
{
	data: new SlashCommandBuilder()
	.setName("stats")
	.setDescription("Check your stats"),

	async execute(interaction, userStats)
	{
		await interaction.deferReply()
        await xh.leveling(userStats, 0)

        const { chips, level, xp, custom } 	= userStats
        const xpreq                         = 20 * (level * level) 
        const one_per                       = xpreq / 10
        const progress                      = Math.floor(xp / one_per)
        const thumb							= custom.thumbnail || interaction.user.displayAvatarURL({ dynamic: true }) 

        let bar       = "" 
        let remaining = 10

        for(i = 0; i < progress; i++)
        {
            remaining--
            bar += "🟩"
        }
        for(i = 0; i < remaining; i++)
        {
            bar += "⬛"
        }
        
        const embed = new EmbedBuilder()
        .setTitle(`${interaction.user.username}'s info:`)
        .setThumbnail(thumb)
        .setDescription(`**Chips:** ${chips} \n**Level:** ${level} \n-# Next level: ${bar}`)

        try     { await interaction.editReply({ embeds: [embed] }) }
        catch   { dev.log("Failed to respond \n cmdID: 2, Error: 1", 2) }
    }
}