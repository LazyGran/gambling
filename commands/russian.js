const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")    
const { Random }                             = require("random-js")
const fs    = require('fs')
const path  = require('path')
const eh    = require('../handlers/errorHandler.js')   
const xh    = require('../handlers/xpHandler.js') 
const dh    = require('../handlers/dataHandler.js')
const dev   = require('../handlers/dev.js')

const random = new Random()

module.exports = 
{
    data: new SlashCommandBuilder()
        .setName("russian")
        .setDescription("The ultimate test"),
                    
    async execute(interaction, userStats)
    {
        await interaction.deferReply()

        var dead 	= false
        var pulled 	= false

		let initial;

		if(userStats.dead) 									return eh.error(interaction, `You've used this before... And died. \n-# Final round: <t:${Math.floor(userStats.lastrussian / 1000)}:F>`);
        if((Date.now() - userStats.lastrussian) < 300000) 	return eh.error(interaction, "Don't be so risky... Chill out for a while");

        const trigger = new ButtonBuilder()
		.setCustomId("b_trigger")
		.setLabel("Do it..?")
		.setStyle(ButtonStyle.Danger)

		trigger.setDisabled(true)

        const embed = new EmbedBuilder()
        .setTitle(`Russian Roulette`)
        .setDescription("Six chambers, one bullet. Do you pull the trigger? \n *The cylinder is spinning..*")

        const row 	= new ActionRowBuilder().addComponents(trigger)

		try 	{ initial = await interaction.editReply({ embeds: [embed], components: [row] }) }
        catch   { dev.log("Failed to respond \n cmdID: 9, Error: 1", 2) }
 
	    setTimeout(() => 
		{
			disable(interaction, embed, row, trigger)
		}, 2000)

		const pressed = await initial.createMessageComponentCollector({ time: 7_000 })

		pressed.on('collect', async press =>
		{
			press.deferUpdate()

			const n = await random.integer(1, 6)

			if(n === 6) dead = true;

			pulled = true

			return pressed.stop()	

		})

		pressed.on('end', async collected =>
		{
			trigger.setDisabled(true)

			if(!pulled)
			{
				embed
				.setTitle("Coward.")
				.setColor("#f58916")
				.setDescription("You didn't pull the trigger.")

				try 	{ interaction.editReply({ embeds: [embed], components: [row] })	}
				catch 	{ dev.log("Failed to respond \n GameID: 9, Error: 3", 2) }
			}
			else
			{
				if(dead)
				{
					userStats.dead 			= true
					userStats.lastrussian 	= Date.now()

					embed
					.setTitle("You died.")
					.setColor("#e80400")
					.setDescription("You will no longer be able to use this command for free money. \n-# You've earned a new Badge!")

					await xh.achievements(userStats, userStats.chips, true, 0, 0, 0, 90)
				}
				else
				{
					userStats.chips += 200
					userStats.lastrussian 	= Date.now()

					embed
					.setTitle("You survived.")
					.setColor("#1aa32a")
					.setDescription("You've been given 200 Chips. \n-# Remember, every time you do this there's a chance it'll be your last!")
				}

				await xh.leveling(userStats, 7)
				await dh.userSave(userStats)

				try 	{ interaction.editReply({ embeds: [embed], components: [row] })	}
				catch 	{ dev.log("Failed to respond \n GameID: 9, Error: 4", 2) }
			}
		})
    }
}

async function disable(interaction, embed, row, trigger)
{
	trigger.setDisabled(false)
	embed.setDescription("Six chambers, one bullet. Do you pull the trigger?")

	try 	{ await interaction.editReply({ embeds: [embed], components: [row] }) }
	catch 	{ dev.log("Failed to respond \n GameID: 9, Error: 2", 2) }
}

