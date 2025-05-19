const { EmbedBuilder }  = require("discord.js")
const { Random }        = require("random-js")
const jsonfile	        = require("jsonfile")
const fs                = require("fs")

const random            = new Random()
const deck_template     = [ "Ace", "Ace", "Ace", "Ace", 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, "Jack", "Jack", "Jack", "Jack", "Queen", "Queen", "Queen", "Queen", "King", "King", "King", "King"]

//create a new deck of cards 
async function create(UID, size)
{
    if(fs.existsSync(`database/deck_${UID}`)) return{ success: false, reason: "Deck already exists"}

    try
    {
        size = size || 1

        const deck = Array(size).fill(deck_template).flat()

        jsonfile.writeFileSync(`database/deck_${UID}`, deck)

        return{ success: true }
    }
    catch(err)
    {
        console.log(err)
        return{ success: false, reason: "Failed to create new deck"}
    }
}

//draw from an existing deck of cards
async function draw(ID) 
{
    try 
    { 
        const deck  = jsonfile.readFileSync(`database/deck_${ID}`)
        if (deck.length < 1) return{success: false, reason: "No more cards remaining in deck"}

        const n     = random.integer(0, deck.length - 1)
        const card  = deck[n]

        deck.splice(n, 1)
        jsonfile.writeFileSync(`database/deck_${ID}`, deck)

        return{ success: true, card: card}
    }
    catch   
    { 
        return{ success: false, reason: "Error drawing card from deck" }
    }
}

//burn card(s) from an existing deck
async function burn(ID, amount)
{
    try 
    { 
        amount = amount || 1
        for (let i = 0; i < amount; i++)
        {
            const deck  = jsonfile.readFileSync(`database/deck_${ID}`)
            if (deck.length < 1) return{success: false, reason: "No more cards remaining in deck"}

            const n     = random.integer(0, deck.length - 1)
            const card  = deck[n]

            deck.splice(n, 1)
            jsonfile.writeFileSync(`database/deck_${ID}`, deck)
        } 
        return{ success: true}
    }
    catch   
    { 
        return{ success: false, reason: "Error burning card from deck" }
    }
}

//delete a deck 
async function remove(ID)
{
    try { jsonfile.readFileSync(`database/deck_${ID}`) }
    catch   
    { 
        return{ success: false, reason: "Deck not found" }
    }


    await fs.unlink(`database/deck_${ID}`, (err)=> 
    {
        if(err)
        {
            console.log(err)
            return{ success: false, reason: "Unable to delete deck, error has been logged."}
        }
    })

    return{ success: true }
}


module.exports =
{
    create, draw, burn, remove
}