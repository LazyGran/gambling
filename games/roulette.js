const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } 	= require("discord.js")
const { Random }														= require("random-js")
const dh 	= require("../handlers/dataHandler.js")
const eh 	= require("../handlers/errorHandler.js")

async function main(interaction, bet, userStats, UID, chosen)
{
	console.log(chosen)
	const wheel 	= []
	const players 	= []

	let p_names 	= ""

	for(i = 0; i < 37; i++)
	{
		let type 	= ""

		if 		(i === 0) 		type = "green"
		else if (i % 2 === 0)	type = "black"
		else 					type = "red"

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

	const initial	= await interaction.editReply({ embeds: [embed] })

	setTimeout(() => { wheelspin(interaction, wheel, embed)}, 2000)
}

async function wheelspin(interaction, wheel, embed)
{
	const random	= new Random()
	const n 		= random.integer(0, 37)
	const field 	= wheel[n]

	embed 
	.setColor("#259dd9")
	.setTitle(`The ball landed on *${field.type} ${field.space}*`)
	.setThumbnail(null)
	.setDescription(null)


	interaction.editReply({ embeds: [embed] })
}

module.exports =
{
    main,
}