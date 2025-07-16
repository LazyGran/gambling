const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } 	= require("discord.js")
const dh 	= require("../handlers/dataHandler.js")
const eh 	= require("../handlers/errorHandler.js")
const ch    = require('../handlers/cardHandler.js')
const xh	= require('../handlers/xpHandler.js')
const dev   = require('../handlers/dev.js')

const values = 
{
	"Ace": 	11,
	"Jack": 10,
	"Queen": 10,
	"King": 10
}
const facecards	= [	"Jack", "Queen","King" ]

async function main(interaction, bet, userStats, UID)
{
	dev.log(userStats.chips)

	if(userStats.chips < bet * 2) 
	{
		userStats.chips 		+= bet
		userStats.active_game 	= false

		dh.userSave(UID, userStats)
		return eh.error("You need at least 3x your bet to play this game! \n-# Example: You bet 50, you need 150, since calling requires you to put in double your bet");
	}


	const deck 		= await ch.create(UID)
	const reward 	= bet * 2
	const xp_rew	= Math.floor(bet / 7)

	if(!deck.success) return eh.error(interaction, deck.reason)

	var	hand				= []
	var hand_str 			= ""
	var dealer_hand			= []
	var dealer_hand_str		= ""
	var community_hand		= []
	var community_hand_str 	= ""
	var played 			= false

	let inital;

	for(let i = 0; i < 2; i++)
	{
		hand_str 			= await player_draw(UID, hand, hand_str)
		dealer_hand_str 	= await dealer_draw(UID, dealer_hand, dealer_hand_str)
	} 

	await ch.burn(UID)

	for(let i = 0; i < 3; i++)
	{
		community_hand_str = await community_draw(UID, community_hand, community_hand_str)
	}

	const call = new ButtonBuilder()
	.setCustomId("b_call")
	.setLabel("Call")
	.setStyle(ButtonStyle.Success)

	const fold = new ButtonBuilder()
	.setCustomId("b_fold")
	.setLabel("Fold")
	.setStyle(ButtonStyle.Danger)

	const row 	= new ActionRowBuilder().addComponents(call, fold)
	const embed = new EmbedBuilder()
	.setColor("#259dd9")
	.setTitle("Casino Hold'em")
	.setDescription(`Dealer: ${dealer_hand_str}, You: ${hand_str} \n Community cards: ${community_hand_str}`)
	
	try 	{ initial = await interaction.editReply({ embeds: [embed], components: [row] }) }
	catch 	{ dev.log("Failed to respond \n GameID: 8, Error: 1", 2) }

	const pressed	= await initial.createMessageComponentCollector({ time: 30_000 })

	pressed.on('collect', async game =>
	{
		if(game.user.id !== UID) return game.reply({ content: "This isn't your game!", ephemeral: true })

		game.deferUpdate()

		if(game.customId === "b_fold")	
		{
			played = true

			return pressed.stop()	
		}


	})

	pressed.on('end', async collected =>
	{
		call.setDisabled(true)
		fold.setDisabled(true)

		if(!played)
		{
			embed 	
			.setColor('#e80400')
			.setTitle(`You lost!`)
			.setDescription(`You didn't react in time \n\n-# *You've lost ${bet} Chips*`)
			.setFooter({ text: `The house gives you thirty seconds` });

			await xh.achievements(userStats, userStats.chips, false, 8, 0)
		}

		try 	{ initial = await interaction.editReply({ embeds: [embed], components: [row] }) }
		catch 	{ dev.log("Failed to respond \n GameID: 8, Error: 3", 2) }
	})
}

async function player_draw(UID, hand, hand_str)
{
	const drawn = await ch.draw(UID)

	hand.push(drawn.suited)
	hand_str += (drawn.emoji)

	return hand_str
}

async function dealer_draw(UID, dealer_hand, dealer_hand_str)
{
	const drawn = await ch.draw(UID)

	dealer_hand.push(drawn.suited)
	dealer_hand_str += (drawn.emoji)

	return dealer_hand_str
}

async function community_draw(UID, community_hand, community_hand_str)
{
	const drawn = await ch.draw(UID)

	community_hand.push(drawn.suited)
	community_hand_str += (drawn.emoji)

	return community_hand_str
}

async function calculate()
{ 

}

module.exports =
{
    main,
}