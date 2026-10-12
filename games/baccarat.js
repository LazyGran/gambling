const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } 	= require("discord.js")
const dh 	= require("../handlers/dataHandler.js")
const eh 	= require("../handlers/errorHandler.js")
const ch    = require('../handlers/cardHandler.js')
const xh	= require('../handlers/xpHandler.js')
const dev   = require('../handlers/dev.js')
const ah	= require('../handlers/assetHandler.js')

const values =
{
    "Ace": 	1,
    "Jack": 10,
    "Queen": 10,
    "King": 10
}
const facecards		= [	"Jack", "Queen","King" ]
const secretcard	= ah.cards(true)

async function main(interaction, bet, userStats, UID)
{
    const deck 		= await ch.create(UID)
    const xp_rew	= Math.floor(bet / 7)
    const possible  = userStats.chips >= bet

    if(!deck.success) return eh.error(interaction, deck.reason)

    var reward 			= bet * 2
    var player          = 0
    var player_hand     = []
    var banker          = 0
    var banker_hand     = []

    const initial_draw  = await draw()
    const toburn        = values[initial_draw.card] || initial_draw.card

    let inital;

    const bank = new ButtonBuilder()
    .setCustomId("b_bank")
    .setLabel("Bank")
    .setEmoji('🏦')
    .setStyle(ButtonStyle.Secondary)

    const gambler = new ButtonBuilder()
    .setCustomId("b_player")
    .setLabel("Player")
    .setEmoji('🎮')
    .setStyle(ButtonStyle.Secondary)

    const row 	= new ActionRowBuilder().addComponents(bank, gambler)
    const embed = new EmbedBuilder()
    .setColor("Baccarat")
    .setTitle("Blackjack")
    .setDescription(`${inital_draw.emoji}*(${toburn})* cards will be burnt`)

    initial = await interaction.editReply({ embeds: [embed], components: [row] })
}

module.exports =
{
    main,
}
