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

	var played 	= false;

	const length 	= random.integer(7, 13)
	const close 	= Math.floor(Date.now() / 1000) + length * 2
	const reaction 	= 1000 * length * 2;

	({ obstacle, race, round } = await lap(round))

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
		if(game.user.id !== UID) return game.reply({ content: "This isn't your game!", ephemeral: true })

		game.deferUpdate()

		const chosen = game.customId

		if(chosen != obstacle) 
		{
			played 	= true;

			embed
			.setColor('#e80400')
			.setTitle(`You lost!`)
			.setDescription(`You crashed! *Avoid* the obstacles. \n\n-# *You've lost ${bet} Chips*`)
			.setFooter({ text: `The house always wins...` });


			return pressed.stop()
		}
		if(round === length)
		{
			played 	= true;

			const reward	= bet + (5 * length)
			const xp_rew	= Math.floor(bet / 7)

			embed
			.setColor('#1aa32a')
			.setTitle(`You won!`)
			.setDescription(`You've finished in time without crashing! \n\n-# *You've gained ${reward - bet} Chips*`)

			userStats.chips 		= userStats.chips + reward
			await xh.leveling(userStats, xp_rew)

			return pressed.stop()
		}

		({ obstacle, race, round } = await lap(round))
		embed.setDescription(race + `\n-# Round ${round}/${length}, ends <t:${close}:R>!`)

		try 	{ initial = await interaction.editReply({ embeds: [embed], components: [row] }) }
		catch 	{ dev.log("Failed to respond \n GameID: 6, Error: 2", 2) }
	})

	pressed.on('end', async collected =>
	{
		up		.setDisabled(true)
		straight.setDisabled(true)
		down 	.setDisabled(true)

		if(!played)
		{
			embed 	
			.setColor('#e80400')
			.setTitle(`You lost!`)
			.setDescription(`You didn't react in time \n\n-# *You've lost ${bet} Chips*`)
			.setFooter({ text: `The house gives you double the race length to react` });	
		}

		try 	{ await interaction.editReply({ embeds: [embed], components: [row] }) }
		catch 	{ dev.log("Failed to respond \n GameID: 6, Error: 3", 2) }
		
		userStats.active_game = false

		dh.userSave(UID, userStats)
	})
}

async function lap(round)
{
	var obstacle	= random.integer(3, 5)
	var race 		= await track(obstacle)
	
	round++

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