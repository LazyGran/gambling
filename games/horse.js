const { EmbedBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } 	= require("discord.js")
const { Random }														= require("random-js")
const cnvs  = require('@napi-rs/canvas');
const dh 	= require("../handlers/dataHandler.js")
const eh 	= require("../handlers/errorHandler.js")
const xh	= require('../handlers/xpHandler.js')
const dev   = require('../handlers/dev.js')

const random    = new Random()

const horses =
[
    { name: "⬛ Spades", value: "black"},
    { name: "🟥 Jackie", value: "red"}, 
    { name: "🟨 Giggle", value: "yellow"},
    { name: "🟪 V", value: "purple"},
    { name: "🟧 Juan", value: "orange"},
    { name: "🟩 Hearts", value: "green"},
    { name: "🟫 Dutch", value: "brown"}
]

const races =
[
    "https://cdn.discordapp.com/attachments/1242636042469642300/1387158274624720937/race_7.gif?ex=685c5350&is=685b01d0&hm=c14a41ca53870b76203d69c696b38a8995a870ef4d0894e3e3561604df4f7738&",
    "https://cdn.discordapp.com/attachments/1242636042469642300/1387158275044413693/race_6.gif?ex=685c5350&is=685b01d0&hm=a40911d177ef93b5ee282a6435d50fe4f2eb8f1bd2989fdb6f172ae9cb9850b4&",
    "https://cdn.discordapp.com/attachments/1242636042469642300/1387158275396473005/race_5.gif?ex=685c5351&is=685b01d1&hm=30cd545a94c2278da2a8d3cbc279fe39debdeb63673a8d0f630932eaec02682f&",
    "https://cdn.discordapp.com/attachments/1242636042469642300/1387158275736473621/race_4.gif?ex=685c5351&is=685b01d1&hm=8b3d713476db3a5846fba33def69322ff0b20c7efdaa0c7eab9a64b225dbb9b5&",
    "https://cdn.discordapp.com/attachments/1242636042469642300/1387158276059430923/race_3.gif?ex=685c5351&is=685b01d1&hm=6bdeca4636f538d19c9e3c3972e83e938d73df18df605692c0e3817592deb4c2&",
    "https://cdn.discordapp.com/attachments/1242636042469642300/1387158276428402850/race_2.gif?ex=685c5351&is=685b01d1&hm=d80784fa019dec4dd30e67d39de2761b2b18165a3ea116af9b8c5741e524969c&",
    "https://cdn.discordapp.com/attachments/1242636042469642300/1387158276780589198/race_1.gif?ex=685c5351&is=685b01d1&hm=b50978c20d85a6e9fe21bab420c8ddff6b2e633b15d1d7556ba40bc7d7fd9898&"
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
    .setThumbnail("https://cdn.discordapp.com/attachments/1242636042469642300/1387158277120589964/horse_start.png?ex=685c5351&is=685b01d1&hm=a9f03f1900ae4945bc6c5efa25b763aacadc81fa60b50ac68b8992f6ae5c1dd9&")
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
        const r         = random.integer(0, 6)
        embed.setDescription(`*The race is on!* \n**Players:** \n${p_names.join(", ")} \n\nBet: ${bet}`).setThumbnail(races[r])

        try     { await interaction.editReply({ embeds: [embed] }) }
        catch   { dev.log("Failed to respond \n\n GameID: 5, Error: 4", 2) }

        setTimeout(async ()  => 
        {
            const horse = await race(interaction, embed)

            await getwinners(players, horse, winners, bet)

            if(winners.length === 0)    embed.setDescription(`**Winners:** \n-# *Nobody won*`)
            else                        embed.setDescription(`**Winners:** \n${winners.join(", ")}`)        

            try     { await interaction.editReply({ embeds: [embed] }) }
            catch   { dev.log("Failed to respond \n GameID: 5, Error: 5", 2) }
        }, 3000)
    })
}

async function race(interaction, embed)
{
    const n         = random.integer(0, 6)
    const horse     = horses[n]
    const canvas    = cnvs.createCanvas(256, 256);
    const context   = canvas.getContext('2d');
    const colors    = ["#000000", "#ff0000", "#ffea00", "c800ff", "#ff8800", "#00c903", "#6e4927"]
    
    context.fillStyle       = colors[n]    
    context.font            = '40pt Ubuntu Sans'
    context.textAlign       = 'center'
    context.textBaseline    = 'middle'
    context.fillText(`${(horse.name).slice(2)}`, 128, 64)

    context.fillText("wins!", 128, 128)

    const b = canvas.toBuffer('image/png') 

    embed 
    .setColor("#259dd9")
    .setThumbnail("attachment://image.png")
    .setDescription(`**Winners:** \n-# *Checking for winners*`)

    try     { await interaction.editReply({embeds: [embed], files: [{attachment:b, name:'image.png'}], components: [] }) }
    catch   { dev.log("Failed to respond \n GameID: 5, Error: 6", 2) }

    return horse;
}

async function getwinners(players, horse, winners, bet)
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
            const reward = bet * 7;

            s.chips += reward 

            winners.push(name)

            await xh.leveling(s, xp_rew)
            await xh.achievements(s, s.chips - reward, true, 5, reward)

            if(chosen === "yellow") await xh.achievements(s, s.chips, false, 503, 0, 0, true);
        }
        else
        {
            await xh.achievements(s, s.chips, false, 5, 0, bet)
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