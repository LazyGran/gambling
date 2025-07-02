const jsonfile	= require("jsonfile")
const fs		= require("fs")

var userdata 	= {}
if(fs.existsSync("database/userdata.json")) userdata = jsonfile.readFileSync("database/userdata.json")

function userGet(id)
{
	if(!(id in userdata))
	{
		userdata[id] = 
		{
			userID: id,
			registered: Date.now(),
			xp: 0,
			level: 1,
			chips: 500,
			active_game: false,
			lastbeg: 0,
			inventory: {},
			games: {},
			achievements: [],
			custom: {},
		}

		jsonfile.writeFileSync("database/userdata.json", userdata)
		return userdata[id]
	}
	else
	{
		return userdata[id]
	}
}

function sort(parameter)
{
	if(fs.existsSync("database/userdata.json")) userdata = jsonfile.readFileSync("database/userdata.json")
		
	var sorted = Object.entries(userdata).sort(([, a], [, b]) => b[parameter] - a[parameter])

	if(sorted.length > 10) sorted = sorted.slice(0, 10)

	return sorted;
}

function userSave(id, saveStats)
{
	userdata[id] = saveStats

	jsonfile.writeFileSync("database/userdata.json", userdata)

	return{ success: true }
}

function devGet(id)
{
	if(userdata[id] === undefined) 	return 0
	else 							return userdata[id]
}

module.exports =
{
	userGet, sort, userSave, devGet	
}