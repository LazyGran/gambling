const { EmbedBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } 	= require("discord.js")
const { Random }														= require("random-js")
const cnvs  = require('@napi-rs/canvas');
const dh 	= require("../handlers/dataHandler.js")
const eh 	= require("../handlers/errorHandler.js")
const xh	= require('../handlers/xpHandler.js')
const dev   = require('../handlers/dev.js')

const horses =
[
    { name: "🟥 Jackie", value: "red"}, 
    { name: "⬛ Spades", value: "black"},
    { name: "🟩 Hearts", value: "green"},
    { name: "🟨 Giggle", value: "yellow"},
    { name: "🟪 V", value: "purple"},
    { name: "🟫 Dutch", value: "brown"}
]

async function main(interaction, bet, userStats, UID, chosen)
{
    const close     = Math.floor(Date.now() / 1000) + 8
    const winners   = []
    const p_names   = []

    let players = {}
    let initial;

    await addplayer(interaction.user, bet, chosen, players, p_names)

    const menu  = new StringSelectMenuBuilder()
    .setCustomId("Bet")
    .setPlaceholder("Bet on a horse")
    .addOptions(
        ...horses.map(field =>
            new StringSelectMenuOptionBuilder()
            .setLabel(field.name)
            .setValue(field.value)
        )
    )

    const row   = new ActionRowBuilder().addComponents(menu)
    const embed = new EmbedBuilder()
    .setColor("#259dd9")
    .setTitle("Horse race")
    .setDescription(`*The horses are getting into starting position* \n**Players:** \n${p_names.join(", ")} \n\nBet: ${bet} *(close <t:${close}:R>)*`)

    try     { initial = await interaction.editReply({ embeds: [embed], components: [row] }) }
    catch   { dev.log("Failed to respond \n GameID: 5, Error: 1", 2) }

    const selected  = await initial.createMessageComponentCollector({ time: 7_000 })

    setTimeout(() => 
    {
        menu.setPlaceholder("Bets closed")
        menu.setDisabled(true)

        try     { interaction.editReply({ components: [row] }) }
        catch   { dev.log("Failed to respond \n GameID: 5, Error: 2", 2) }
    }, 7000)

    selected.on('collect', async selection =>
    {
        const s = dh.userGet(selection.user.id)

        if(s.chips < bet)
        {
            selection.reply({ content: "You can't afford to join in", ephemeral: true})
        }
        else if(selection.user.id in players)
        {
            selection.reply({ content: "You already bet on this", ephemeral: true})
        }
        else
        {
            s.active_game   = true
            s.chips         = s.chips - bet
            chosen          = selection.values[0]

            await dh.userSave(selection.user.id, s) 
            await addplayer(selection.user, bet, chosen, players, p_names)

            selection.deferUpdate()

            embed.setDescription(`*The horses are getting into starting position* \n**Players:** \n${p_names.join(", ")} \n\nBet: ${bet} *(close <t:${close}:R>)*`)

            try     { await interaction.editReply({ embeds: [embed] }) }
            catch   { dev.log("Failed to respond \n\n GameID: 5, Error: 3", 2) }
        }
    })

    selected.on('end', async collected =>
    {
        embed.setDescription(`*The race is on!* \n**Players:** \n${p_names.join(", ")} \n\nBet: ${bet}`)

        try     { await interaction.editReply({ embeds: [embed] }) }
        catch   { dev.log("Failed to respond \n\n GameID: 5, Error: 4", 2) }

        setTimeout(async ()  => 
        {
            const horse = await race(interaction, embed)

            dev.log(horse)

            await getwinners(players, horse, winners)

            if(winners.length === 0)    embed.setDescription(`**Winners:** \n-# *Nobody won*`)
            else                        embed.setDescription(`**Winners:** \n${winners.join(", ")}`)        

            try     { await interaction.editReply({ embeds: [embed] }) }
            catch   { dev.log("Failed to respond \n GameID: 5, Error: 5", 2) }
        }, 3000)
    })
}

async function race(interaction, embed)
{
    const random    = new Random()
    const n         = random.integer(0, 3)
    const horse     = horses[n]

    embed 
    .setColor("#259dd9")
    .setDescription(`**Winners:** \n-# *Checking for winners*`)

    try     { await interaction.editReply({embeds: [embed], components: [] }) }
    catch   { dev.log("Failed to respond \n GameID: 5, Error: 6", 2) }

    return horse;
}

async function getwinners(players, horse, winners)
{
    for(const id in players)
    {
        const p = players[id]
        const s = await dh.userGet(id)
        const { value }   = horse
        const { name, bet, chosen } = p

        var won;

        if(value === chosen) won = true;

        if(won === true)
        {
            const xp_rew = Math.floor(bet / 7)
            const reward = Math.floor(bet + (bet / 2));

            s.chips += reward

            winners.push(name)

            await xh.leveling(s, xp_rew)
        }

        s.active_game = false

        await dh.userSave(id, s)
    }
}

async function addplayer(p, bet, chosen, players, p_names)
{
    players[p.id] = 
    { 
        name: p.username,
        bet: bet,
        chosen: chosen
    }

    p_names.push(p.username)
}


module.exports =
{
    main,
}