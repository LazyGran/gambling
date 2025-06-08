const { Events, ActivityType } 	= require("discord.js")
const { Random }				= require("random-js")
const readline	= require("readline");
const fs		= require("fs")
const path		= require("path")
const dh        = require('../handlers/dataHandler.js')

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
	async execute(client)
	{
		await setStatus()

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




		const rl = readline.createInterface(
		{
			input: process.stdin,
			output: process.stdout,
			prompt: '- '
		});

		rl.prompt();

		rl.on('line', (line) => 
		{
			const input 	= line.trim();
			const args		= input.split(" ")
			const command	= args.shift()


			switch (command) 
			{
				case "set":
				{
					const [ UID, key, value ] = args;
					
					if(!UID || !key || value === undefined)
					{
						console.log("Usage: set <id> <property> <value> \nExample: \nset 467019235328000001 money 100")
						break;
					}

					const parsedVal	= isNaN(value) ? value : Number(value)
					const userStats = dh.devGet(UID)

					if (userStats === 0) 
					{
						console.log("User not found!")
						break;
					}
					else if(!(key in userStats))
					{
						console.log("Key not found!")
						break;
					}

					userStats[key] = parsedVal

					dh.userSave(userStats)

					console.log(`Successfully set ${userStats.userID}.${key} to ${userStats[key]}`)

				  	break;
				}

				case "get":
				{
					const UID = args

					if(!UID)
					{
						console.log("Usage: get <id> \nExample: \nget 467019235328000001")
						break;
					}

					const userStats = dh.devGet(UID)

					if (userStats === 0) 
					{
						console.log("User not found!")
						break;
					}

					console.log(userStats)

					break;
				}

			case "backup":
			{
				const date	= new Date().toISOString().split('T')[0]
				const src 	= path.join("database", "userdata.json")
				const dest	= path.join("database", "backups", `backup_${date}.json`)

				fs.copyFileSync(src, dest)

				console.log("Successfully backed up Database " + date)

				break;
			}
				default: { console.log(`Unknown command: ${input}`) }
			}

			rl.prompt();
		}).on('close', () => 
		{
			console.log('Stopping bot...');
			process.exit(0);
		});
	}
}