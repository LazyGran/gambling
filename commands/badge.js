const { SlashCommandBuilder, EmbedBuilder, } = require("discord.js")	
const dev   = require('../handlers/dev.js')

const emojis =
{
    11: "<:11:1391490739262718183>",
    12: "<:12:1391490745550245939>",
    13: "<:13:1391490758573559978>",
    14: "<:14:1391788730494484570>",
    15: "<:15:1391493405825175652>",
    50: "<:50:1391788739755245659>",
    69: "<:69:1391788746604675184>",
    101: "<:101:1391414150327963731>",
    102: "<:102:1391414174344679435>",
    103: "<:103:1391414182137565257>",
    201: "<:201:1391414190153011330>",
    202: "<:202:1391414199997169805>",
    203: "<:203:1391414219764924547>",
    204: "<:204:1391793652178882692>",
    301: "<:301:1391483399373324288>",
    302: "<:302:1391483409267818588>",
    303: "<:303:1391483417115361415>",
    401: "<:401:1391483424400998560>",
    402: "<:402:1391483437352882297>",
    403: "<:403:1391483444264960131>",
    404: "<:404:1391788774672961546>",
    501: "<:501:1391483450153767162>",
    502: "<:502:1391793662287155302>",
    503: "<:503:1391793672982499378>",
    601: "<:601:1391483456680235139>",
    701: "<:701:1391487659465248849>"
}

const titles =
{
    11: { name: "Mr. Moneybags",                        description: "Have over 10.000 Chips" },
    12: { name: "Scrooge McDuck",                       description: "Have over 100.000 Chips" },
    13: { name: "One Chiptillion",                      description: "Have over 1.000.000 Chips" },
    14: { name: "Lose It All",                          description: "Lose all your money in a single bet" },
    15: { name: "Menace To Society",                    description: "Use /crime over 100 times" },
    50: { name: "Five Hundred Cigarettes",              description: "Have a total of 500 Cigarettes" },
    69: { name: "Funny Number",                         description: "Have exactly 69.420 Chips" },
    101: { name: "I'm A Good Guesser (bronze)",         description: "Play 5 games of 'High Or Low'" },
    102: { name: "I'm A Good Guesser (silver)",         description: "Play 25 games of 'High Or Low'" },
    103: { name: "I'm A Good Guesser (gold)",           description: "Play 100 games of 'High Or Low'" },
    201: { name: "My Head Is Spinning (bronze)",        description: "Play 5 games of 'Roulette'" },
    202: { name: "My Head Is Spinning (silver)",        description: "Play 25 games of 'Roulette'" },
    203: { name: "My Head Is Spinning (gold)",          description: "Play 100 games of 'Roulette'" },
    204: { name: "Go Big Or Go Home",                   description: "Put in the maximum bet & lose in 'Roulette'" },
    301: { name: "My Friends Love Me (bronze)",         description: "Play 5 games of 'Seventeen + Four'" },
    302: { name: "My Friends Love Me (silver)",         description: "Play 25 games of 'Seventeen + Four'" },
    303: { name: "My Friends Love Me (gold)",           description: "Play 100 games of 'Seventeen + Four'" },
    401: { name: "Basic Strategy, Trust Me (bronze)",   description: "Play 5 games of 'Blackjack'" },
    402: { name: "Basic Strategy, Trust Me (silver)",   description: "Play 25 games of 'Blackjack'" },
    403: { name: "Basic Strategy, Trust Me (gold)",     description: "Play 100 games of 'Blackjack'" },
    404: { name: "I Have No Clue",                      description: "In 'Blackjack', hit when having 17 points" },
    501: { name: "Steroids",                            description: "Win when betting on horse" },
    502: { name: "Glue Factory",                        description: "Bet over 1.000 Chips on a horse & lose" },
    503: { name: "My Brain Is Dead I Fear",             description: "Win when betting on horse 'Giggle' (yellow)" },
    601: { name: "Max Vertrucken",                      description: "Play 10 games of 'Racer'" },
    701: { name: "Leave My Gold Alone",                 description: "Play 10 games of 'Slots'" }
}

const publics = [ 11, 12, 13, 101, 102, 103, 201, 202, 203, 301, 302, 303, 401, 402, 403, 501, 601, 701{ name: "", description: "" }]
const secrets = [ 14, 15, 50, 69, 204, 404, 502, 503 ]

module.exports = 
{
	data: new SlashCommandBuilder()
	.setName("badges")
	.setDescription("Check out (almost) all the badges"),

	async execute(interaction, userStats)
	{
		await interaction.deferReply()

        for(const badge of userStats.achievements)
        {
            dev.log(Object.keys(badge)[0])
        }

        
        const embed = new EmbedBuilder()
        .setTitle(`${interaction.user.username}'s badges:`)
        .setDescription("Badges with a ❓ are Badges you haven't earned yet. \nThere are more under the 'Secret Badges' tab, but those only show up once earned..!")

        try     { await interaction.editReply({ embeds: [embed] }) }
        catch   { dev.log("Failed to respond \n cmdID: 8, Error: 1", 2) }
    }
}