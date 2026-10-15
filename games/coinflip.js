const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } 	= require("discord.js")
const { Random }                                                     	= require('random-js')
const dh 	= require("../handlers/dataHandler.js")
const eh 	= require("../handlers/errorHandler.js")
const ch    = require('../handlers/cardHandler.js')
const xh	= require('../handlers/xpHandler.js')
const dev   = require('../handlers/dev.js')
const ah	= require('../handlers/assetHandler.js')

const colors	= ah.colors()
const random 	= new Random()
const statics	= ah.slots()
const gifs 		= ah.slots(true)

async function main(interaction, bet, userStats)
{
    var foot	= "Flipping the lucky coin"
    const embed = new EmbedBuilder()
    .setThumbnail("TEMP")
    .setFooter({ text: foot });

    setTimeout(() =>
    {
        embed.setThumbnail("TEMP")

        if(reward)
        {
            const xp_rew    = Math.floor(reward / 7)
            foot            = `You won ${reward} Chips`

            embed
            .setColor(colors.green)
            .setFooter({ text: foot });

            userStats.chips 		+= reward
            userStats.active_game 	= false

            xh.leveling(userStats, xp_rew)
            xh.achievements(userStats, userStats - reward, true, 6, reward)
        }
        else
        {
            embed
            .setColor(colors.red)
            .setFooter({ text: "One more flip..."})

            userStats.active_game 	= false

            xh.achievements(userStats, userStats - reward, false, 6, reward)
        }

        end(userStats, interaction, embed, bet, interaction.user.id)
    }, 1500)

}

async function end(userStats, interaction, embed, bet, UID)
{
    userStats.active_game = false;
    dh.userSave(userStats)
    ch.remove(UID)

    newStats = await dh.userGet(UID)

    const again = new ButtonBuilder()
    .setCustomId('b_again')
    .setEmoji('🔁')
    .setLabel('Play again?')
    .setStyle(ButtonStyle.Primary)

    const row 	= new ActionRowBuilder().addComponents(again)

    initial = await interaction.editReply({ embeds: [embed], components:[row] })

    const press = await new Promise(resolve =>
    {
        const collector = initial.createMessageComponentCollector({ time: 7_000 })

        let resolved = false

        collector.on("collect", async button =>
        {
            if(button.user.id !== UID) 	return button.reply({ content: "This isn't your game!", ephemeral: true })
            if(newStats.chips < bet)	return button.reply({ content: "You can't afford to play again with this bet!", ephemeral: true })
            if(newStats.active_game) 	return button.reply({ content: "You are already playing a game!", ephemeral: true })

            if(resolved) return
            resolved = true

            collector.stop("player")
            resolve(button)

            resolve(true)
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
        again.setDisabled(true)
        return interaction.editReply({ components: [row] })
    }
    else
    {
        await press.deferUpdate()

        newStats.chips -= bet
        newStats.active_game = true

        dh.userSave(newStats)

        main(interaction, bet, newStats, UID)
    }
}

module.exports =
{
    main,
}
