const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } 	= require("discord.js")
const { Random }                                                     	= require('random-js')
const dh 	= require("../handlers/dataHandler.js")
const eh 	= require("../handlers/errorHandler.js")
const ch    = require('../handlers/cardHandler.js')
const xh	= require('../handlers/xpHandler.js')
const dev   = require('../handlers/dev.js')

const random 	= new Random()

async function main(interaction, bet, userStats, UID)
{
	let initial;
	let round = 0


	const length 	= random.integer(7, 13)
	const close 	= Math.floor(Date.now() / 1000) + length * 2
	const reaction 	= 1000 * length * 2;

	({ obstacle, race, round } = await lap(round))

	dev.log(round)

	const up = new ButtonBuilder()
	.setCustomId("3")
	.setLabel("Up")
	.setStyle(ButtonStyle.Danger)

	const straight = new ButtonBuilder()
	.setCustomId("4")
	.setLabel("Straight")
	.setStyle(ButtonStyle.Secondary)

	const down = new ButtonBuilder()
	.setCustomId("5")
	.setLabel("down")
	.setStyle(ButtonStyle.Success)

	const row 	= new ActionRowBuilder().addComponents(up, straight, down)
	const embed = new EmbedBuilder()
	.setColor("#259dd9")
	.setTitle("Racer")
	.setDescription(race + `\n-# Round ${round}/${length}, ends <t:${close}:R>!`)

	try 	{ initial = await interaction.editReply({ embeds: [embed], components: [row] }) }
	catch 	{ dev.log("Failed to respond \n GameID: 6, Error: 1", 2) }

	const pressed = await initial.createMessageComponentCollector({ time: reaction })

	pressed.on('collect', async game =>
	{
		const chosen = game.customId

		if(chosen != obstacle) 
		{
			return dev.log("lost")
		}
		if(round === length)
		{
			return dev.log("won")
		}

		dev.log("Game continues");

		({ obstacle, race, round } = await lap(round))
		embed.setDescription(race + `\n-# Round ${round}/${length}, ends <t:${close}:R>!`)

		try 	{ initial = await interaction.editReply({ embeds: [embed], components: [row] }) }
		catch 	{ dev.log("Failed to respond \n GameID: 6, Error: 2", 2) }
		
		game.deferUpdate()
	})

	pressed.on('end', async collected =>
	{
		dev.log("end")
	})
}

async function lap(round)
{
	var obstacle	= random.integer(3, 5)
	var race 		= await track(obstacle)
	
	round++

	dev.log(round)

	return{ obstacle, race, round }
}

async function track(n)
{
	switch(n)
	{
		case 3: 	return "```⬛\n🔲     🏎️\n🔲```"
		case 4: 	return "```🔲\n⬛     🏎️\n🔲```"
		case 5: 	return "```🔲\n🔲     🏎️\n⬛```"
	}
}


module.exports =
{
    main,
}