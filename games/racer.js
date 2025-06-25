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
	let round = 0
	let initial;
	let obstacle;
	let race;

	const length 	= random.integer(7, 13)
	const close 	= Math.floor(Date.now() / 1000) + Math.floor(length + (length / 2))
	const reaction 	= 1000 * Math.floor(length + (length / 2))

	dev.log(reaction)

	race = await lap()

	dev.log(race)

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
	.setDescription(race + `\n-# Race ends <t:${close}:R>!`)

	try 	{ initial = await interaction.editReply({ embeds: [embed], components: [row] }) }
	catch 	{ dev.log("Failed to respond \n GameID: 6, Error: 1", 2) }

	const pressed = await initial.createMessageComponentCollector({ time: reaction })

	pressed.on('collect', async game =>
	{
		game.deferUpdate()

		dev.log(game.customId)
	})

	pressed.on('end', async collected =>
	{
		dev.log("end")
	})
}

async function lap()
{
	const obstacle  = random.integer(3, 5)

	return race = await track(obstacle)
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