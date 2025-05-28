const { Events, ActivityType } 	= require("discord.js")
const { Random }				= require("random-js")

const fs		= require("fs")
const random	= new Random()
const statuses 	= 
[
	{ name: "Ranked gambling.", type: ActivityType.Custom },
	{ name: "you gambling", type: ActivityType.Watching },
	{ name: "security feed", type: ActivityType.Streaming },
	{ name: "your cries", type: ActivityType.Listening },
	{ name: "with the Chips", type: ActivityType.Playing }
]

module.exports = 
{
	name: Events.ClientReady,
	once: true,
	execute(client)
	{
		setStatus()

		async function setStatus()
		{
			const n 		= random.integer(0, (statuses.length - 1))
			const status 	= statuses[n]

			console.log(status)

			client.user.setPresence(
	        { 
	        	activities: 
	        	[
	        		status
	        	], 
	        	status: 'dnd' 
	    	});
		}


		console.log(`Online`)

		setInterval(() =>
		{
			setStatus()
		}, 30000)
	}
}