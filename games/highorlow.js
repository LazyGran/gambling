const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } 	= require("discord.js")
const { Random }														= require("random-js")
const dh 	= require("../handlers/dataHandler.js")
const eh 	= require("../handlers/errorHandler.js")
const ch    = require('../handlers/cardHandler.js')

async function main(interaction, bet, userStats, UID)
{
	const values = 
	{
		"Ace": 2,
		"Jack": 10,
		"Queen": 10,
		"King": 10
	}

	var drawn = await ch.draw(UID)

	if(!drawn.success) 
	{
		const deck = await ch.create(UID)

		if(!deck.success) return eh.error(interaction, deck.reason)

		drawn = await ch.draw(UID)
	}
 		
	const card	= drawn.card
	const value = values[card] || card


	const low = new ButtonBuilder()
	.setCustomId("b_low")
	.setLabel("Lower")
	.setStyle(ButtonStyle.Danger)

	const equal = new ButtonBuilder()
	.setCustomId("b_equal")
	.setLabel("Equal")
	.setStyle(ButtonStyle.Secondary)

	const high = new ButtonBuilder()
	.setCustomId("b_high")
	.setLabel("Higher")
	.setStyle(ButtonStyle.Success)

	const again = new ButtonBuilder()
	.setCustomId('b_again')
	.setEmoji('🔁')
	.setLabel('Play again?')
	.setStyle(ButtonStyle.Primary)

	const row 	= new ActionRowBuilder().addComponents(low, equal, high)
	const embed = new EmbedBuilder()
	.setColor("#259dd9")
	.setTitle("High or Low")
	.setDescription(`You drew a **${card}**`)

	const initial = await interaction.editReply({ embeds: [embed], components: [row] })

	try
	{
		const game 			= await initial.awaitMessageComponent({time: 5_000, max: 1})
		const dealer_drawn 	= await ch.draw(UID)

		if(!dealer_drawn.success) return eh.error(interaction, dealer_drawn.reason)

		const dealer_card	= dealer_drawn.card
		const dealer_value 	= values[dealer_card] || dealer_card

		var chosen 	= 0
		var final 	= 0 

		if(game.customId === "b_low")	chosen = 1
		if(game.customId === "b_equal")	chosen = 2
		if(game.customId === "b_high")	chosen = 3

		if(dealer_value < value) final = 1
		if(dealer_value === value) final = 2
		if(dealer_value > value) final = 3 

		console.log(chosen, final, dealer_value)

		low.setDisabled(true)
		equal.setDisabled(true)
		high.setDisabled(true)

		if(final === chosen) 	embed.setColor('#1aa32a').setTitle(`You won!`).setDescription(`You drew a **${card}** \nThe dealer drew a **${dealer_card}**`)
		else					embed.setColor('#e80400').setTitle(`You lost!`).setDescription(`You drew a **${card}** \nThe dealer drew a **${dealer_card}**`).setFooter({ text: `The house always wins...` });

        await interaction.editReply({ embeds: [embed], components: [row] }).then(game.deferUpdate())
	}
	catch(error)
	{
		console.error(error)
	}
}

module.exports =
{
    main,
}