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
    var player_hand_str = ""
    var banker          = 0
    var banker_hand_str = ""
    var chosen          = 0
    var outcome         = 0

    const initial_draw  = await ch.draw(UID)
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
    .setColor("#259dd9")
    .setTitle("Baccarat")
    .setDescription(`${initial_draw.emoji}*(${toburn})* cards will be burnt`)

    initial = await interaction.editReply({ embeds: [embed], components: [row] })

    const press = await new Promise(resolve =>
    {
        const collector = initial.createMessageComponentCollector({ time: 7_000 })

        let resolved = false

        collector.on("collect", async button =>
        {
            if(button.user.id !== UID) 	return button.reply({ content: "This isn't your game!", ephemeral: true })

            if(resolved) return
            resolved = true

            if(button.customId === "b_player") chosen = 1

            collector.stop("player")
            resolve(button)
        })

        collector.on("end", (collected, reason) =>
        {
            if(resolved) return

            resolved = true
            resolve(null)
        })
    })

    if(!press)
    {
        dev.log("Booty")

        return devend(userStats, UID)
    }

    press.deferUpdate()

    await ch.burn(UID, toburn)

    while(player < 8 && banker < 8)
    {
        const player_card = await ch.draw(UID)
        player += values[player_card.card] || player_card.card
        player = player % 10
        player_hand_str += player_card.emoji

        const banker_card = await ch.draw(UID)
        banker += values[banker_card.card] || banker_card.card
        banker = banker % 10
        banker_hand_str += banker_card.emoji
    }

    embed
    .setDescription(`Bank: ${banker_hand_str} *(${banker})* \nPlayer: ${player_hand_str} *(${player})* `)

    if(player > banker)
    {
        outcome = 1
        gambler.setStyle(ButtonStyle.Success)
    }
    else if(banker > player)
    {
        bank.setStyle(ButtonStyle.Success)
    }
    else outcome = 2;

    bank.setDisabled(true)
    gambler.setDisabled(true)

    await interaction.editReply({ embeds: [embed], components: [row] })

    devend(userStats, UID)
}

module.exports =
{
    main,
}

function devend(userStats, UID)
{
    ch.remove(UID)

    userStats.active_game = false
    dh.userSave(userStats)
}
