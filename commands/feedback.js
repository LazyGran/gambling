const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")	
const dev   = require('../handlers/dev.js')

module.exports =
{
	data: new SlashCommandBuilder()
	.setName("feedback")
	.setDescription("Shape the future!"),

	async execute(interaction, userStats)
	{
		await interaction.deferReply()
        

        const button = new ButtonBuilder()
        .setLabel("Click me!")
        .setURL("https://forms.gle/XGRqEpquoy1VrWzA7")
        .setStyle(ButtonStyle.Link)

        const row = new ActionRowBuilder().addComponents(button)

        const embed = new EmbedBuilder()
        .setTitle(`${interaction.user.username}, thank you <3`)
        .setDescription(`
        [You can give your feedback here via a Google Forms survey](https://forms.gle/XGRqEpquoy1VrWzA7) \n-# *It only takes a few minutes* \n
        This is the best I have to gather user feedback and figure out what you guys want.
        [Have fun gambling!](https://discord.com/oauth2/authorize?client_id=1373621336982949992)`)
        .setFooter({ text: `Feedback is the only way the project can grow!` })


        try     { await interaction.editReply({ embeds: [embed], components: [row] }) }
        catch   { dev.log("Failed to respond \n cmdID: 10, Error: 1", 2) }
    }
}