const { Events, ActivityType } 	= require("discord.js")
const { Random }				= require("random-js")

const fs		= require("fs")
const random	= new Random()
const statuses 	= 
[
	{ name: "Ranked gambling.", 						type: ActivityType.Custom },
	{ name: "Never give up.", 							type: ActivityType.Custom },
	{ name: "Not rigged, probably...", 					type: ActivityType.Custom },
	{ name: "The illusion of choice.",					type: ActivityType.Custom },
	{ name: "you gambling", 							type: ActivityType.Watching },
	{ name: "your next move", 							type: ActivityType.Watching },
	{ name: "the dealers shuffling", 					type: ActivityType.Watching },
	{ name: "the security feed",						type: ActivityType.Streaming },
	{ name: "your losses in 4k", 						type: ActivityType.Streaming },
	{ name: "your downfall (with background music!)", 	type: ActivityType.Streaming },
	{ name: "your cries", 								type: ActivityType.Listening },
	{ name: "with the Chips", 							type: ActivityType.Playing },
	{ name: "with fate", 								type: ActivityType.Playing },
	{ name: "with your odds (and feelings)", 			type: ActivityType.Playing}
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
		}, 1800000)
	}
}