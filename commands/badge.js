const { SlashCommandBuilder, EmbedBuilder, } = require("discord.js")	
const dev   = require('../handlers/dev.js')

//live badges
const emojis =
{
    11: "<:11:1391490739262718183>",
    12: "<:12:1391490745550245939>",
    13: "<:13:1391490758573559978>",
    14: "<:14:1391788730494484570>",
    15: "<:15:1391493405825175652>",
    50: "<:50:1391788739755245659>",
    69: "<:69:1391788746604675184>",
    101: "<:101:1395372911682129920>",
    102: "<:102:1391414174344679435>",
    103: "<:103:1391414182137565257>",
    201: "<:201:1391414190153011330>",
    202: "<:202:1391414199997169805>",
    203: "<:203:1391414219764924547>",
    204: "<:204:1391793652178882692>",
    301: "<:301:1391483399373324288>",
    302: "<:302:1391483409267818588>",
    303: "<:303:1391483417115361415>",
    401: "<:401:1395373191811174441>",
    402: "<:402:1395373202091282443>",
    403: "<:403:1395373209641291796>",
    404: "<:404:1391788774672961546>",
    501: "<:501:1391483450153767162>",
    502: "<:502:1391793662287155302>",
    503: "<:503:1391793672982499378>",
    601: "<:601:1391483456680235139>",
    701: "<:701:1391487659465248849>",
    801: "<:801:1397206591375147182>",
    802: "<:802:1397206600631980064>",
    803: "<:803:1397206608756346932>",
    804: "<:804:1397206616344105021>",
    805: "<:805:1397206623793057873>",
    806: "<:806:1397206629640048691>",
    807: "<:807:1397206636082364426>",
    808: "<:808:1397206643196035217>",
    809: "<:809:1397206649772445736>",
    810: "<:810:1397206657611858070>",
}

const titles =
{
    11: { name: "Mr. Moneybags",                description: "Have over 10.000 Chips" },
    12: { name: "Scrooge McDuck",               description: "Have over 100.000 Chips" },
    13: { name: "One Chiptillion",              description: "Have over 1.000.000 Chips" },
    14: { name: "Lose It All",                  description: "Lose all your money in a single bet" },
    15: { name: "Menace To Society",            description: "Use /crime & succeed" },
    50: { name: "Five Hundred Cigarettes",      description: "Buy 500 Cigarettes at once" },
    69: { name: "Funny Number",                 description: "Have exactly 69.420 Chips" },
    101: { name: "I'm A Good Guesser 🥉",       description: "Play 5 games of 'High Or Low'" },
    102: { name: "I'm A Good Guesser 🥈",       description: "Play 25 games of 'High Or Low'" },
    103: { name: "I'm A Good Guesser 🥇",       description: "Play 100 games of 'High Or Low'" },
    201: { name: "My Head Is Spinning 🥉",      description: "Play 5 games of 'Roulette'" },
    202: { name: "My Head Is Spinning 🥈",      description: "Play 25 games of 'Roulette'" },
    203: { name: "My Head Is Spinning 🥇",      description: "Play 100 games of 'Roulette'" },
    204: { name: "Go Big Or Go Home",           description: "Put in the maximum bet & lose in 'Roulette'" },
    301: { name: "My Friends Love Me 🥉",       description: "Play 5 games of 'Seventeen + Four'" },
    302: { name: "My Friends Love Me 🥈",       description: "Play 25 games of 'Seventeen + Four'" },
    303: { name: "My Friends Love Me 🥇",       description: "Play 100 games of 'Seventeen + Four'" },
    401: { name: "Basic Strategy, Trust Me 🥉", description: "Play 5 games of 'Blackjack'" },
    402: { name: "Basic Strategy, Trust Me 🥈", description: "Play 25 games of 'Blackjack'" },
    403: { name: "Basic Strategy, Trust Me 🥇", description: "Play 100 games of 'Blackjack'" },
    404: { name: "I Have No Clue",              description: "In 'Blackjack', hit when having 17 points" },
    501: { name: "Steroids",                    description: "Win when betting on horse" },
    502: { name: "Glue Factory",                description: "Bet over 1.000 Chips on a horse & lose" },
    503: { name: "My Brain Is Dead I Fear",     description: "Win when betting on horse 'Giggle' (yellow)" },
    601: { name: "Max Vertrucken",              description: "Play 10 games of 'Racer'" },
    701: { name: "Leave My Gold Alone",         description: "Play 10 games of 'Slots'" },
    801: { name: "Amateur",                     description: "In 'Casino Holdem', win with 'High Card'"},
    802: { name: "Pair",                        description: "In 'Casino Holdem', win with 'Pair'"},
    803: { name: "Two Pair",                    description: "In 'Casino Holdem', win with 'Two Pair'"},
    804: { name: "Three Of A Kind",             description: "In 'Casino Holdem', win with 'Three Of A Kind'"},
    805: { name: "Straight",                    description: "In 'Casino Holdem', win with 'Straight'"},
    806: { name: "Flush",                       description: "In 'Casino Holdem', win with 'Flush'"},
    807: { name: "Doctor House",                description: "In 'Casino Holdem', win with 'Full House'"},
    808: { name: "Lucky Man",                   description: "In 'Casino Holdem', win with 'Four Of A Kind'"},
    809: { name: "Twitter",                     description: "In 'Casino Holdem', win with 'Straigh Flush'"},
    810: { name: "Majesty",                     description: "In 'Casino Holdem', win with 'Royal Flush'"},
}

const publics = [ 11, 12, 13, 101, 102, 103, 201, 202, 203, 301, 302, 303, 401, 402, 403, 501, 601, 701 ]
const secrets = [ 14, 15, 50, 69, 204, 404, 502, 503, 801, 802, 803, 804, 805, 806, 807, 808, 809, 810 ]

module.exports = 
{
	data: new SlashCommandBuilder()
	.setName("badges")
	.setDescription("Check out (almost) all the badges"),

	async execute(interaction, userStats)
	{
		await interaction.deferReply()

        const earned = []

        let public_str      = ""
        let private_str     = ""
        let description_str = "Badges with a ❓ are Badges you haven't earned yet. \n-# There are also a few *secret* badges that only show up once earned \n\n"

        for(const badge of userStats.achievements)
        {
            earned.push(Number(badge))
        }
        
        for(const badge of publics)
        {
            if(earned.includes(badge))
            {
                public_str += `${emojis[badge]} ${titles[badge].name} \n-# ${titles[badge].description} \n`
            }
            else
            {
                public_str += `❓ ${titles[badge].name} \n-# ${titles[badge].description} \n`
            }
        }

        for(const badge of secrets)
        {
            if(earned.includes(badge))
            {

                private_str += `${emojis[badge]} ${titles[badge].name} \n-# ${titles[badge].description} \n`
            }
        }

        description_str = description_str + public_str + private_str

        const embed = new EmbedBuilder()
        .setTitle(`${interaction.user.username}'s badges:`)
        .setDescription(description_str)

        try     { await interaction.editReply({ embeds: [embed] }) }
        catch   { dev.log("Failed to respond \n cmdID: 8, Error: 1", 2) }
    }
}