const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } 	= require("discord.js")
const { Random }                                                     	= require('random-js')
const dh 	= require("../handlers/dataHandler.js")
const eh 	= require("../handlers/errorHandler.js")
const ch    = require('../handlers/cardHandler.js')
const xh	= require('../handlers/xpHandler.js')
const dev   = require('../handlers/dev.js')

let obstacle;
let lap;

async function main(interaction, bet, userStats, UID)
{
	let initial;
	let round = 0

	await game()

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
	.setDescription(lap)

	try 	{ initial = await interaction.editReply({ embeds: [embed], components: [row] }) }
	catch 	{ dev.log("Failed to respond \n GameID: 6, Error: 1", 2) }
}

async function lap()
{
	const random 	= new Random()
	const obstacle  = random.integer(3, 5)

	race = await track(obstacle)
}

async function track(n)
{
	switch(n)
	{
		case 3: 	return "```⬛     \n🔲     🏎️\n🔲     ```"
		case 4: 	return "```🔲     \n⬛     🏎️\n🔲     ```"
		case 5: 	return "```🔲     \n🔲     🏎️\n⬛     ```"
	}
}


module.exports =
{
    main,
}