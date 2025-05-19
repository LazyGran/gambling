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
			chips: 0,
			inventory: {},
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

function userSave(id, saveStats)
{
	userdata[id] = saveStats

	jsonfile.writeFileSync("database/userdata.json", userdata)

	return{ success: true }
}


module.exports =
{
	userGet, userSave	
}