const { EmbedBuilder }  = require("discord.js")
const { Random }        = require("random-js")
const jsonfile          = require("jsonfile")
const fs                = require("fs")
const dev               = require('../handlers/dev.js')

const random            = new Random()
const deck_templates    =  
{
    "standard": [ "Ace", "Ace", "Ace", "Ace", 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, "Jack", "Jack", "Jack", "Jack", "Queen", "Queen", "Queen", "Queen", "King", "King", "King", "King" ],
    "short"   : [ "Ace", "Ace", "Ace", "Ace", 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, "Jack", "Jack", "Jack", "Jack", "Queen", "Queen", "Queen", "Queen", "King", "King", "King", "King" ]
}

//create a new deck of cards 
async function create(UID, size, template)
{
    if(fs.existsSync(`database/deck_${UID}`)) return{ success: false, reason: "Deck already exists" }

    try
    {
        size        = size || 1
        template    = deck_templates[template] || deck_templates["standard"]

        const deck = Array(size).fill(template).flat()

        jsonfile.writeFileSync(`database/deck_${UID}`, deck)

        return{ success: true }
    }
    catch(err)
    {
        dev.log(err, 2)
        return{ success: false, reason: "Failed to create new deck" }
    }
}

//draw from an existing deck of cards
async function draw(ID) 
{
    try 
    { 
        const deck  = jsonfile.readFileSync(`database/deck_${ID}`)
        if (deck.length < 1) return{ success: false, reason: "No more cards remaining in deck" }

        const n     = random.integer(0, deck.length - 1)
        const card  = deck[n]

        deck.splice(n, 1)
        jsonfile.writeFileSync(`database/deck_${ID}`, deck)

        return{ success: true, card: card, remaining: deck.length}
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
            if (deck.length < 1) return{ success: false, reason: "No more cards remaining in deck" }

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
            dev.log(err, 2)
            return{ success: false, reason: "Unable to delete deck, error has been logged."}
        }
    })

    return{ success: true }
}


module.exports =
{
    create, draw, burn, remove
}