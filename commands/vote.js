require("dotenv").config()
const { TOPGG_TOKEN: token } = process.env

const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")	
const dh 	= require('../handlers/dataHandler.js')
const dev   = require('../handlers/dev.js')

module.exports = 
{
	data: new SlashCommandBuilder()
	.setName("vote")
	.setDescription("Vote on top.gg!"),

	async execute(interaction, userStats)
	{
		await interaction.deferReply()

        const last 	= userStats.lastvote || 0
        const ready = await check(last, userStats)
        const embed = new EmbedBuilder()

        const button = new ButtonBuilder()
        .setLabel("Vote here")
        .setURL("https://top.gg/bot/1373621336982949992/vote")
        .setStyle(ButtonStyle.Link)

        const row = new ActionRowBuilder().addComponents(button)
        
        if(ready)
        {
        	embed
        	.setTitle(`Thank you for voting!`)
        	.setDescription("You have been given **5.000 Chips** as a bonus.")

        	userStats.chips 	+= 5000
        	userStats.lastvote  = Date.now()

        	dh.userSave(userStats)
        }
        else
        {
        	embed
        	.setTitle(`Hold up!`)
        	.setDescription("Looks like you haven't voted yet \nor already claimed your bonus today. \n-# Bonus available every 24h")
        }
        

        try     { await interaction.editReply({ embeds: [embed], components: [row] }) }
        catch   { dev.log("Failed to respond \n cmdID: 11, Error: 1", 2) }
    }
}

async function check(last, userStats)
{
	if((Date.now() - last) < 43200000) return false;	//user claimed within last 24h

	const url = `https://top.gg/api/bots/1373621336982949992/check?userId=${userStats.userID}`

	const res = await fetch(url,
	{
		method: "GET",
		headers: {
			"Authorization": token
		}
	})

	const data = await res.json()

	if(data.voted === 1) 	return true; 	//user voted within last 24
	else 					return false;	//he didnt
}