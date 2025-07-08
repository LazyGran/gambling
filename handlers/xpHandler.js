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

function achievements(userStats, pre, won, gameID, reward, bet, additional)
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

	//11-13, 69
	if(userStats.chips >= 10000 && !userStats.achievements.includes("11"))							userStats.achievements.push("11")
	if(userStats.chips >= 100000 && !userStats.achievements.includes("12"))							userStats.achievements.push("12")
	if(userStats.chips >= 1000000 && !userStats.achievements.includes("13"))						userStats.achievements.push("13")
	if(userStats.chips === 69420 && !userStats.achievements.includes("69"))							userStats.achievements.push("69")

	//14
	if(pre === 0 && won === false && !userStats.achievements.includes("14")) 						userStats.achievements.push("14");

	//204
	if(gameID === 2 && won === false && bet === 5000 && !userStats.achievements.includes("204")) 	userStats.achievements.push("204")

	//502
	if(gameID === 5 && won === false && bet >= 1000 && !userStats.achievements.includes("502"))		userStats.achievements.push("502")

	//15
	if(gameID === 0 && !userStats.achievements.includes("15"))										userStats.achievements.push("15")

	//404
	if(gameID === 404 && additional === true && !userStats.achievements.includes("404"))			userStats.achievements.push("404")

	//503
	if(gameID === 503 && additional === true && !userStats.achievements.includes("503"))			userStats.achievements.push("503")

	dh.userSave(userStats)
}

module.exports =
{
	leveling, achievements
}