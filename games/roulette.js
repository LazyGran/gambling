const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } 	= require("discord.js")
const { Random }														= require("random-js")
const cnvs  = require('@napi-rs/canvas');
const dh 	= require("../handlers/dataHandler.js")
const eh 	= require("../handlers/errorHandler.js")
const xh	= require('../handlers/xpHandler.js')
const dev   = require('../handlers/dev.js')

async function main(interaction, bet, userStats, UID, chosen)
{
	const wheel 		= []
	const players 		= []
	const redNumbers 	= [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];	

	let p_names 	= ""
	let initial;

	for(i = 0; i < 37; i++)
	{
		let type 	= ""

		if 		(i === 0) 					type = "green"
		else if (redNumbers.includes(i))	type = "red"
		else 								type = "black"

		wheel.push({ space: i, type: type })
	}

	players.push(interaction.user)

	for(const u of players)
	{
		p_names += `${u.username}, `
	}

	const embed = new EmbedBuilder()
	.setColor("#259dd9")
	.setTitle("The wheel is spinning..")
	.setThumbnail('https://media.discordapp.net/attachments/1242636042469642300/1376641025606549606/roulette_spin.gif?ex=68380a9d&is=6836b91d&hm=cb8533d5df401544391aa8aaa8e4e1c45ea70cea8b07d34d04c223cdf832c687&=')
	.setDescription(`**Players:** \n${p_names}`)
	.setFooter({ text: `Multiplayer coming soon..` });

	try 	{ initial = await interaction.editReply({ embeds: [embed] }) }
	catch 	{ dev.log("Failed to respond \n GameID: 2, Error: 1", 2) }

	setTimeout(async () => 
	{ 
		const field 			= await wheelspin(interaction, wheel, embed)
		const { space, type }	= field

		const won 		= await checkwin(chosen, space, type)
		const xp_rew 	= Math.floor(bet / 7)

		let reward = 0

		if(["red", "black", "even", "odd"].includes(chosen))	reward = Math.floor(bet + (bet / 2));
		else if(["1st", "2nd", "3rd"].includes(chosen))			reward = bet + bet;
		else if(chosen === "green")								reward = bet * 10;

		if(won)
		{
			embed.setColor('#1aa32a').setDescription(`You won ${reward - bet}`)

			userStats.chips 		= userStats.chips + reward
			await xh.leveling(userStats, xp_rew)
		}
		else
		{
			embed.setColor('#e80400').setDescription("You lost").setFooter({ text: `The house always wins...` })
		}

		try 	{ await interaction.editReply({ embeds: [embed] }) }
		catch 	{ dev.log("Failed to respond \n GameID: 2, Error: 2", 2) }

		userStats.active_game = false

		dh.userSave(UID, userStats)
	}, 2000)

}

async function wheelspin(interaction, wheel, embed)
{
	const random	= new Random()
	const n 		= random.integer(0, 36)
	const field 	= wheel[n]
    const canvas 	= cnvs.createCanvas(256, 256);
    const context 	= canvas.getContext('2d');
    const colors 	= 
	{
		"red": "#ff000a",
		"black": "#000000",
		"green": "#0f6329"
	}
    
    context.fillStyle = colors[field.type]   

    context.beginPath()
    context.arc(128, 128, 128, 0, Math.PI * 2, true)
    context.closePath()
    context.fill()


    context.fillStyle 		= '#ffffff'  
    context.font 			= '130pt Ubuntu Sans'
    context.textAlign 		= 'center'
    context.textBaseline 	= 'middle'
    context.fillText(n, 128, 128)

	const b = canvas.toBuffer('image/png') 

	embed 
	.setColor("#259dd9")
	.setTitle(`The ball landed on *${field.type} ${field.space}*`)
	//.addFields({ name: 'Winners', value: "-# *Checking for winners*"}) //used for Multiplayer later
    .setThumbnail("attachment://image.png")
	.setDescription(null)


	try 	{ await interaction.editReply({embeds: [embed], files: [{attachment:b, name:'image.png'}] }) }
	catch 	{ dev.log("Failed to respond \n GameID: 2, Error: 3", 2) }

	return field;
}

async function checkwin(chosen, space, type)
{
		switch(chosen)
		{
			case "red": 	return type === chosen;
			case "black": 	return type === chosen;
			case "green": 	return type === chosen;

			case "even": 	return space !== 0 && space % 2 === 0;
			case "odd": 	return space !== 0 && space % 2 !== 0;

			case "1st": 	return space >= 1  && space <= 12;
			case "2nd": 	return space >= 13 && space <= 24;
			case "3rd": 	return space >= 25 && space <= 36;
		}
}

module.exports =
{
    main,
}