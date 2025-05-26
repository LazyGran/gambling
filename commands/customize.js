const { SlashCommandBuilder, EmbedBuilder, } = require("discord.js")    
const eh    = require("../handlers/errorHandler.js")
const dh    = require("../handlers/dataHandler.js")

module.exports = 
{
    data: new SlashCommandBuilder()
    .setName("customize")
    .setDescription("Customize your embed!")
    .addSubcommand(subcommand => subcommand
        .setName("picture")
        .setDescription("Change the picture in your embed")
        .addStringOption(option => option 
            .setName("url")
            .setDescription("Image url")
            .setRequired(true)
            )
        ),

    async execute(interaction, userStats)
    {
        await interaction.deferReply()

        const thumb = await interaction.options.getString("url")

        try
        {
            const embed = new EmbedBuilder()
            .setTitle(`Success`)
            .setThumbnail(thumb)
            .setColor("#1aa32a")
            .setDescription(`Changed your embed's image`)

            interaction.editReply({ embeds: [embed] })

            userStats.custom.thumbnail = thumb
            dh.userSave(userStats)
        }
        catch(error)
        { 
            console.log(error)
            eh.error(interaction, "Not a valid image-url") 
        }
    }
}