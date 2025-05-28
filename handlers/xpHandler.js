const jsonfile	= require("jsonfile")
const fs		= require("fs")
const dh 		= require("../handlers/dataHandler.js")

function leveling(userStats, reward)
{
	userStats.xp = userStats.xp + reward
	
	const xpreq	= 20 * (userStats.level * userStats.level) - userStats.xp

	if(xpreq <= 0) userStats.level ++;

	dh.userSave(userStats)
}

module.exports =
{
	leveling
}