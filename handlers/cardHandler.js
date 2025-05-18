const { EmbedBuilder }  = require("discord.js")
const jsonfile	        = require("jsonfile")
const fs                = require("fs")
const deck_template     = [ "Ace", "Ace", "Ace", "Ace", 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, "Jack", "Jack", "Jack", "Jack", "Queen", "Queen", "Queen", "Queen", "King", "King", "King", "King"]

//create a new deck of cards 
async function create(UID, size)
{
    if(size)    size = size
    else        size = 1

    const deck = Array(size).fill(deck_template).flat()

    console.log(size, "\n", deck)

    jsonfile.writeFileSync(`database/deck_${UID}`, deck)
}

//draw from an existing deck of cards
async function draw(ID) 
{

}

//burn card(s) from an existing deck
async function burn(ID, amount)
{

}

//delete a deck 
async function remove(ID, amount)
{
    
}


module.exports =
{
    create, draw, burn, remove
}