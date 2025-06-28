const { SlashCommandBuilder, EmbedBuilder, } = require("discord.js")	

module.exports =
{
	data: new SlashCommandBuilder()
	.setName("donate")
	.setDescription("Means everything <3"),

	async execute(interaction, userStats)
	{
		await interaction.deferReply()
        
        const embed = new EmbedBuilder()
        .setTitle(`${interaction.user.username}, thank you <3`)
        .setDescription(`
        [You can donate here via PayPal (@xgraron)](https://www.paypal.com/paypalme/xgraron) \n
        Other ways to support tis project:
        **Word of mouth** \nThe more users the bot has (or servers), the better. \n **Using the bot** \nSeeing people enjoy it is a huge morale boost! \n\n-# *click below to add Chippy* 
        [Have fun gambling!](https://discord.com/oauth2/authorize?client_id=1373621336982949992)`)
        .setFooter({ text: `Entirely optional, donating has no benefits` })

        try     { await interaction.editReply({ embeds: [embed] }) }
        catch   { dev.log("Failed to respond \n cmdID: 6, Error: 1", 2) }
    }
}