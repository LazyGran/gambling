const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } 	= require("discord.js")
const dh 	= require("../handlers/dataHandler.js")
const eh 	= require("../handlers/errorHandler.js")
const ch    = require('../handlers/cardHandler.js')
const xh	= require('../handlers/xpHandler.js')

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
	const deck 		= await ch.create(UID, 1, "short")
	const reward 	= Math.floor(bet + ((bet / 4) * 3))
	const xp_rew	= Math.floor(bet / 7)

	if(!deck.success) return eh.error(interaction, deck.reason)

	var	hand			= []
	var hand_str 		= ""
	var points			= 0
	var dealer_hand		= []
	var dealer_hand_str	= ""
	var dealer_points	= 0
	var played 			= false
	var busted			= false

	let inital;

	for(let i = 0; i < 2; i++)
	{
		points 			= await player_draw(UID, hand, points, hand_str)
		dealer_points 	= await dealer_draw(UID, dealer_hand, dealer_points, dealer_hand_str)
	} 

	hand_str 		= hand.join(", ")
	dealer_hand_str = dealer_hand.join(", ")

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
	.setDescription(`Your hand: **${hand_str}** *(${points}p)* \nDealer's hand: **??, ${dealer_hand[1]}**`)
	
	try 	{ initial = await interaction.editReply({ embeds: [embed], components: [row] }) }
	catch 	{ console.log("Failed to respond \n GameID: 3, Error: 1") }

	const pressed	= await initial.createMessageComponentCollector({ time: 30_000 })

	pressed.on('collect', async game =>
	{
		game.deferUpdate()

		if(game.customId === "b_stand")	
		{
			played = true

			return pressed.stop()	
		}

		points 		= await player_draw(UID, hand, points)
		hand_str 	= hand.join(", ")

		embed.setDescription(`Your hand: **${hand_str}** *(${points}p)* \nDealer's hand: **??, ${dealer_hand[1]}**`)
		try 	{ await interaction.editReply({ embeds: [embed] }) }
		catch 	{ console.log("Failed to respond \n GameID: 3, Error: 2") }

		if(points > 21)						
		{
			played = true
			busted = true
			pressed.stop()
		}
	})

	pressed.on('end', async collected =>
	{
		hit		.setDisabled(true)
		stand	.setDisabled(true)

		if(!played)
		{
			embed 	
			.setColor('#e80400')
			.setTitle(`You lost!`)
			.setDescription(`You didn't react in time \n\n-# *You've lost ${bet} Chips*`)
			.setFooter({ text: `The house gives you thirty seconds` });
		}

		while(dealer_points < 17)
		{
			dealer_points	= await dealer_draw(UID, dealer_hand, dealer_points)
			dealer_hand_str = dealer_hand.join(", ")
		}

		if(busted)
		{
			embed 	
			.setColor('#e80400')
			.setTitle(`You lost!`)
			.setDescription(`Your hand: **${hand_str}** *(${points}p)* \nDealer's hand: **${dealer_hand_str}** *(${dealer_points}p)* \n\n-# *You've lost ${bet} Chips*`)
			.setFooter({ text: `The house always wins...` });
		}
		else if(dealer_points > 21)
		{
			embed 	
			.setColor('#1aa32a')
			.setTitle(`You won!`)
			.setDescription(`Your hand: **${hand_str}** *(${points}p)* \nDealer's hand: **${dealer_hand_str}** *(${dealer_points}p)* \n\n-# *You've gained ${reward - bet} Chips*`)

			userStats.chips = userStats.chips + reward
			await xh.leveling(userStats, xp_rew)
		}
		else if(points > dealer_points)
		{
			embed 	
			.setColor('#1aa32a')
			.setTitle(`You won!`)
			.setDescription(`Your hand: **${hand_str}** *(${points}p)* \nDealer's hand: **${dealer_hand_str}** *(${dealer_points}p)* \n\n-# *You've gained ${reward - bet} Chips*`)

			userStats.chips = userStats.chips + reward
			await xh.leveling(userStats, xp_rew)
		}
		else
		{
			embed 	
			.setColor('#e80400')
			.setTitle(`You lost!`)
			.setDescription(`Your hand: **${hand_str}** *(${points}p)* \nDealer's hand: **${dealer_hand_str}** *(${dealer_points}p)* \n\n-# *You've lost ${bet} Chips*`)
			.setFooter({ text: `The house always wins...` });
		}

		try 	{ interaction.editReply({ embeds: [embed], components: [row] })	}
		catch 	{ console.log("Failed to respond \n GameID: 3, Error: 3") }

		userStats.active_game = false

		ch.remove(UID)
		dh.userSave(UID, userStats)
	})
}

async function player_draw(UID, hand, points)
{
	const drawn = await ch.draw(UID)

	hand.push(drawn.card)

    points 		+= values[drawn.card] || drawn.card

	return(points)
}

async function dealer_draw(UID, dealer_hand, dealer_points)
{
	const drawn = await ch.draw(UID)

	dealer_hand.push(drawn.card)

	dealer_points 	+= values[drawn.card] || drawn.card

	return(dealer_points)
}

module.exports =
{
    main,
}