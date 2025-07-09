require("dotenv").config()

const fs 	= require("node:fs")
const path 	= require("node:path")
const dev   = require("./handlers/dev.js")

const { Client, GatewayIntentBits, Collection } 	= require("discord.js")
const { DISCORD_TOKEN: token }						= process.env

const client = new Client(
{
	intents:
	[
		GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
	]
})

const eventsPath 	= path.join(__dirname, "events")
const eventFiles 	= fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"))

const cmdPath		= path.join(__dirname, "commands")
const cmdFiles		= fs.readdirSync(cmdPath).filter((file) => file.endsWith(".js"))

for(const file of eventFiles)
{
	const filePath 	= path.join(eventsPath, file)
	const event    	= require(filePath)

	if(event.once) client.once(event.name, (...args) => event.execute(...args))
		else client.on(event.name, (...args) => event.execute(...args, client));

}

client.commands = new Collection()

for(const file of cmdFiles)
{
	const filePath 	= path.join(cmdPath, file)
	const command 	= require(filePath)

	if("data" in command && "execute" in command) client.commands.set(command.data.name, command)
		else console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property`);
}

process.on("unhandledRejection", (reason, promise) =>
{
	dev.log(("(1) Major error:", promise, '\nReason', reason), 2)
})

process.on("uncaughtException", (err) =>
{
	dev.log(("(2) Major error:", err), 2)
})


client.login(token)


