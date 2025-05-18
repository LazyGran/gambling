const { Events }	= require("discord.js")
const jsonfile 		= require("jsonfile")
const fs 			= require('fs')

module.exports =
{
	name: Events.InteractionCreate,
	async execute(interaction, client)
	{
		const command = interaction.client.commands.get(interaction.commandName)

		if(!command) 
		{ 
			console.error(`No command matching ${interaction.commandName} was found`); 
			return; 
		}

		command.execute(interaction, client)
	}
}