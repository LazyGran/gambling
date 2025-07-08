const jsonfile	= require("jsonfile")
const fs		= require("fs")
const dh 		= require("../handlers/dataHandler.js")
const dev   	= require('../handlers/dev.js')

const games_con = [
	//Horl
	{ gameID: 1, plays: 5, wins: 0, earnings: 0, achievementID: "101" },
	{ gameID: 1, plays: 25, wins: 0, earnings: 0, achievementID: "102" },
	{ gameID: 1, plays: 100, wins: 0, earnings: 0, achievementID: "103" },
	//Roulette
	{ gameID: 2, plays: 5, wins: 0, earnings: 0, achievementID: "201" },
	{ gameID: 2, plays: 25, wins: 0, earnings: 0, achievementID: "202" },
	{ gameID: 2, plays: 100, wins: 0, earnings: 0, achievementID: "203" },
	//Seventeen"
	{ gameID: 3, plays: 5, wins: 0, earnings: 0, achievementID: "301" },
	{ gameID: 3, plays: 25, wins: 0, earnings: 0, achievementID: "302" },
	{ gameID: 3, plays: 100, wins: 0, earnings: 0, achievementID: "303" },
	//Blackjack
	{ gameID: 4, plays: 5, wins: 0, earnings: 0, achievementID: "401" },
	{ gameID: 4, plays: 25, wins: 0, earnings: 0, achievementID: "402" },
	{ gameID: 4, plays: 100, wins: 0, earnings: 0, achievementID: "403 "},
	//horse
	{ gameID: 5, plays: 1, wins: 1, earnings: 0, achievementID: "501" },
	//racer
	{ gameID: 6, plays: 10, wins: 0, earnings: 0, achievementID: "601" },
	//slots
	{ gameID: 7, plays: 1, wins: 1, earnings: 10, achievementID: "701"}
]



function leveling(userStats, reward)
{
	userStats.xp = userStats.xp + reward
	
	const xpreq	= 20 * (userStats.level * userStats.level) - userStats.xp

	if(xpreq <= 0) userStats.level ++;

	dh.userSave(userStats)
}

function achievements(userStats, pre, won, gameID, reward)
{
	gameID = Number(gameID)
	if(!userStats.games[gameID])
	{
		userStats.games[gameID] =
		{
			won: 0,
			played: 0,
			earned: 0
		}
	}

	let achievement;

	const game = userStats.games[gameID]

	if(won) game.won ++;
			game.played ++
			game.earned += reward

	for(const con of games_con)
	{
		if(gameID === con.gameID && game.played >= con.plays && game.won >= con.wins && game.earned >= con.earnings && !userStats.achievements.includes(con.achievementID))
		{
			userStats.achievements.push(con.achievementID)
		}
	}

	dh.userSave(userStats)
}

module.exports =
{
	leveling, achievements
}