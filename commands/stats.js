const { SlashCommandBuilder, EmbedBuilder, } = require("discord.js")	
const xh    = require('../handlers/xpHandler.js')
const dev   = require('../handlers/dev.js')

const badges =
{
    11: "<>",
    12: "<>",
    13: "<>",
    14: "<>",
    15: "<>",
    50: "<>",
    69: "<>",
    101: "<:101:1391414150327963731>",
    102: "<:102:1391414174344679435>",
    103: "<:103:1391414182137565257>",
    201: "<:201:1391414190153011330>",
    202: "<:202:1391414199997169805>",
    203: "<:203:1391414219764924547>",
    204: "<>",
    301: "<>",
    302: "<>",
    303: "<>",
    401: "<>",
    402: "<>",
    403: "<>",
    404: "<>",
    501: "<>",
    502: "<>",
    503: "<>",
    601: "<>",
    701: "<>"
}

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

        let badge_str = ""
        let bar       = "" 
        let remaining = 10

        for(const badge of userStats.achievements)
        {
            badge_str += `${badges[Object.keys(badge)[0]]}`
        }

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
        .setTitle(`${interaction.user.username}'s stats:`)
        .setThumbnail(thumb)
        .setDescription(`**Chips:** ${chips} \n**Level:** ${level} \n-# Next level: ${bar}`)
        .addFields(
            { name: "Badges", value: badge_str, inline: true },
        )

        try     { await interaction.editReply({ embeds: [embed] }) }
        catch   { dev.log("Failed to respond \n cmdID: 1, Error: 1", 2) }
    }
}