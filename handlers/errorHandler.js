const { EmbedBuilder } 	= require("discord.js")
const jsonfile			= require("jsonfile")
const fs 				= require("fs")

async function error(interaction, e_text)
{
	const embed = new EmbedBuilder()
	.setTitle("An error has occured")
	.setColor(`#e80400`)
    .setDescription(e_text + "\n\n-# If you believe this is a bug, contact <@467019235328000001>")
    .setFooter({ text: 'Please remember this is a public beta!' });

    try     { await interaction.reply({embeds: [embed]})       }   //trying to reply normaly
    catch   { await interaction.editReply({embeds: [embed]})   }   //if that fails, reply probably needs to be edited
}

module.exports =
{
    error,
}