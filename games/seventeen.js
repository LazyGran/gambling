const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } 	= require("discord.js")
const { Random }														= require("random-js")
const dh 	= require("../handlers/dataHandler.js")
const eh 	= require("../handlers/errorHandler.js")
const ch    = require('../handlers/cardHandler.js')

const values	= 
{
	"Ace": 	1,
	"Jack": 2,
	"Queen": 3,
	"King": 4
}
const facecards	= [	"Jack", "Queen","King" ]

async function main(interaction, bet, userStats, UID)
{
	const deck = await ch.create(UID)

	if(!deck.success) return eh.error(interaction, deck.reason)

	var	hand			= []
	var points			= 0
	var dealer_hand		= []
	var dealer_points	= 0
	var played 			= false

	for(let i = 0; i < 2; i++)
	{
		points 			= await player_draw(UID, hand, points)
		dealer_points 	= await dealer_draw(UID, dealer_hand, dealer_points)
	} 

	console.log("balls")
	console.log(hand, points)
	console.log(dealer_hand, dealer_points)

	const hit = new ButtonBuilder()
	.setCustomId("b_hit")
	.setLabel("Hit")
	.setStyle(ButtonStyle.Danger)

	const stand = new ButtonBuilder()
	.setCustomId("b_stand")
	.setLabel("Stand")
	.setStyle(ButtonStyle.Success)

	const again = new ButtonBuilder()
	.setCustomId('b_again')
	.setEmoji('🔁')
	.setLabel('Play again?')
	.setStyle(ButtonStyle.Primary)

	const row 	= new ActionRowBuilder().addComponents(hit, stand)
	const embed = new EmbedBuilder()
	.setColor("#259dd9")
	.setTitle("Seventeen + Four")
	.setDescription(`Your hand: **${hand[0]}, ${hand[1]}** \nDealer's hand: **??, ${dealer_hand[1]}**`)
	
	const initial	= await interaction.editReply({ embeds: [embed], components: [row] })
	const pressed	= await initial.createMessageComponentCollector({ time: 30_000 })

	pressed.on('collect', async game =>
	{
		pressed.stop()
	})

	pressed.on('end', collected =>
	{
		if(!played)
		{
			hit		.setDisabled(true)
			stand	.setDisabled(true)
			embed 	.setColor('#e80400').setTitle(`You lost!`).setDescription(`You didn't react in time \n\n-# *You've lost ${bet} Chips*`).setFooter({ text: `The house gives you thirty seconds` });

			interaction.editReply({ embeds: [embed], components: [row] })	
		}

		userStats.active_game = false

		ch.remove(UID)
		dh.userSave(UID, userStats)
	})
}


async function player_draw(UID, hand, points)
{
	const drawn = await ch.draw(UID)

	hand.push(drawn.card)

    points += values[drawn.card] || drawn.card

	return(points)
}

async function dealer_draw(UID, dealer_hand, dealer_points)
{
	const drawn = await ch.draw(UID)

	dealer_hand.push(drawn.card)

	dealer_points += values[drawn.card] || drawn.card

	return(dealer_points)
}

module.exports =
{
    main,
}