const jsonfile	= require("jsonfile")
const fs		= require("fs")
const dh 		= require("../handlers/dataHandler.js")

function leveling(userStats, reward)
{
	console.log(userStats.xp, userStats.level, reward)

	userStats.xp = userStats.xp + reward
	const xpreq			= 20 * (userStats.level * userStats.level) - userStats.xp

	console.log(userStats.xp, xpreq)

	if(xpreq <= 0) userStats.level ++;

	console.log(userStats.xp, userStats.level)
	dh.userSave(userStats)
}

module.exports =
{
	leveling
}