const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")	
const dev   = require('../handlers/dev.js')

module.exports =
{
	data: new SlashCommandBuilder()
	.setName("donate")
	.setDescription("Means everything <3"),

	async execute(interaction, userStats)
	{
		await interaction.deferReply()
        

        const button = new ButtonBuilder()
        .setLabel("Click me!")
        .setURL("https://ko-fi.com/xgraron")
        .setStyle(ButtonStyle.Link)

        const row = new ActionRowBuilder().addComponents(button)

        const embed = new EmbedBuilder()
        .setTitle(`${interaction.user.username}, thank you <3`)
        .setDescription(`
        [You can donate here via Ko-fi](https://ko-fi.com/xgraron) \n-# *Ko-fi takes a 5% cut, I deem that fair* \n
        Other ways to support this project:
        **Word of mouth** \nThe more users the bot has (or servers), the better. \n **Using the bot** \nSeeing people enjoy it is a huge morale boost! \n\n-# *click below to add Chippy* 
        [Have fun gambling!](https://discord.com/oauth2/authorize?client_id=1373621336982949992)`)
        .setFooter({ text: `Entirely optional, donating has no benefits` })


        try     { await interaction.editReply({ embeds: [embed], components: [row] }) }
        catch   { dev.log("Failed to respond \n cmdID: 6, Error: 1", 2) }
    }
}