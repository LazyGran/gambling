const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } 	= require("discord.js")
const { Random }                                                     	= require('random-js')
const dh 	= require("../handlers/dataHandler.js")
const eh 	= require("../handlers/errorHandler.js")
const ch    = require('../handlers/cardHandler.js')
const xh	= require('../handlers/xpHandler.js')
const dev   = require('../handlers/dev.js')

const random 	= new Random()

const emojis	= [ "<a:slots3f:1393285737432092793>", "<a:slots3:1393285730658156625>", "<a:slots2f:1393285725491036250>", "<a:slots2:1393285719426076682>", "<a:slots1f:1393285701948412015>", "<a:slots1:1393285701948412015>" ]

//for(let i = 0; i < 7; i++) emojis.push("<a:slots3f:1393285737432092793>", "<a:slots3:1393285730658156625>", "<a:slots2f:1393285725491036250>", "<a:slots2:1393285719426076682>", "<a:slots1f:1393285701948412015>", "<a:slots1:1393285701948412015>");

async function main(interaction, bet, userStats)
{
	var reels = ""

	const used = []

	for(i = 0; i < 3; i++) 
	{
		let n = random.integer(0, emojis.length - 1)

		if(used.includes(n)) 
		{
			var selected = true;

			while(selected) 
			{
				n = random.integer(0, emojis.length - 1)

				if(!used.includes(n)) selected = false;
			}
		}
		reels += emojis[n]

		used.push(n)
	}

	const embed = new EmbedBuilder()
	.setColor("#259dd9")
	.setTitle("Slots")
	.setDescription(reels)

	try 	{ initial = await interaction.editReply({ embeds: [embed] }) }
	catch 	{ dev.log("Failed to respond \n GameID: 7, Error: 1", 2) }
}

async function spin()
{

}


module.exports =
{
    main,
}