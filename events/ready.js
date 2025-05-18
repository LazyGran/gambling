const { Events, ActivityType } = require("discord.js")
const fs		= require("fs")

module.exports = 
{
	name: Events.ClientReady,
	once: true,
	execute(client)
	{
		client.user.setPresence(
		{
			activities: [
			{
				name: "with the Chips",
				type: "PLAYING"
			}],
			status: 'dnd'
		})

		console.log(`Online`)
	}
}