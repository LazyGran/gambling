const { EmbedBuilder, ActionRowBuilder } 	= require("discord.js")
const jsonfile  = require("jsonfile")
const fs 		= require("fs")

async function error(interaction, e_text)
{
    const row   = new ActionRowBuilder()
	const embed = new EmbedBuilder()
	.setTitle("An error has occured")
	.setColor(`#e80400`)
    .setDescription(e_text + "\n\n-# If you believe this is a bug, contact <@467019235328000001>")
    .setFooter({ text: 'Please remember this is a public beta!' });

    try             { await interaction.editReply({ embeds: [embed], components: [] }) }   
    catch(error)    { console.log(`Error handler failed to edit message! \nError message: ${e_text} \nError: \n${error}`) }  
}

module.exports =
{
    error,
}