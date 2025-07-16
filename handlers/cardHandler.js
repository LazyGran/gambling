const { EmbedBuilder }  = require("discord.js")
const { Random }        = require("random-js")
const jsonfile          = require("jsonfile")
const fs                = require("fs")
const dev               = require('../handlers/dev.js')

const random            = new Random()
const deck_templates    =  
{
    "standard": [ "Aceh", "Aces", "Aced", "Acec", "2h", "2s", "2d", "2c", "3h", "3s", "3d", "3c", "4h", "4s", "4d", "4c", "5h", "5s", "5d", "5c", "6h", "6s", "6d", "6c", "7h", "7s", "7d", "7c", "8h", "8s", "8d", "8c", "9h", "9s", "9d", "9c", "10h", "10s", "10d", "10c", "Jackh", "Jacks", "Jackd", "Jackc", "Queenh", "Queens", "Queend", "Queenc", "Kingh", "Kings", "Kingd", "Kingc" ],
    "short"   : [ "Aceh", "Aces", "Aced", "Acec", "7h", "7s", "7d", "7c", "8h", "8s", "8d", "8c", "9h", "9s", "9d", "9c", "10h", "10s", "10d", "10c", "Jackh", "Jacks", "Jackd", "Jackc", "Queenh", "Queens", "Queend", "Queenc", "Kingh", "Kings", "Kingd", "Kingc" ],
}

const cards =
{
    "Aceh": "Ace",
    "Aces": "Ace",
    "Aced": "Ace",
    "Acec": "Ace",
    "2h": 2,
    "2s": 2,
    "2d": 2,
    "2c": 2,
    "3h": 3,
    "3s": 3,
    "3d": 3,
    "3c": 3,
    "4h": 4,
    "4s": 4,
    "4d": 4,
    "4c": 4,
    "5h": 5,
    "5s": 5,
    "5d": 5,
    "5c": 5,
    "6h": 6,
    "6s": 6,
    "6d": 6,
    "6c": 6,
    "7h": 7,
    "7s": 7,
    "7d": 7,
    "7c": 7,
    "8h": 8,
    "8s": 8,
    "8d": 8,
    "8c": 8,
    "9h": 9,
    "9s": 9,
    "9d": 9,
    "9c": 9,
    "10h": 10,
    "10s": 10,
    "10d": 10,
    "10c": 10,
    "Jackh": "Jack",
    "Jacks": "Jack",
    "Jackd": "Jack",
    "Jackc": "Jack",
    "Queenh": "Queen",
    "Queens": "Queen",
    "Queend": "Queen",
    "Queenc": "Queen",
    "Kingh": "King",
    "Kings": "King",
    "Kingd": "King",
    "Kingc": "King"
}

//dev cards
const emojis =
{
    "Aceh": "1394394321075179650",
    "Aces": "1394394328788373504",
    "Aced": "1394394313064185887",
    "Acec": "1394394298430001429",
    "2h": "1394393962017587280",
    "2s": "1394393968686665878",
    "2d": "1394393955566620774",
    "2c": "1394393949069643787",
    "3h": "1394393987225223338",
    "3s": "1394393994200481924",
    "3d": "1394393980719857745",
    "3c": "1394393975313666068",
    "4h": "1394394011938062356",
    "4s": "1394394017935921302",
    "4d": "1394394005445414964",
    "4c": "1394394000206725292",
    "5h": "1394394033333342299",
    "5s": "1394394038630879313",
    "5d": "1394394027616637019",
    "5c": "1394394023086788728",
    "6h": "1394394067508396205",
    "6s": "1394394074181533747",
    "6d": "1394394060277415977",
    "6c": "1394394047413485768",
    "7h": "1394394095442591834",
    "7s": "1394394102539358319",
    "7d": "1394394089041956874",
    "7c": "1394394081651851264",
    "8h": "1394394128024080546",
    "8s": "1394394134705340568",
    "8d": "1394394117684990072",
    "8c": "1394394110500278404",
    "9h": "1394394192180019241",
    "9s": "1394394203789856970",
    "9d": "1394394186978955344",
    "9c": "1394394145744748745",
    "10h": "1394394241802833931",
    "10s": "1394394250103226558",
    "10d": "1394394228712407070",
    "10c": "1394394220965396570",
    "Jackh": "1394394375693537360",
    "Jacks": "1394394383025049620",
    "Jackd": "1394394362397327390",
    "Jackc": "1394394356391088209",
    "Queenh": "1394394732850970835",
    "Queens": "1394394740308574329",
    "Queend": "1394394726307991766",
    "Queenc": "1394394719995432960",
    "Kingh": "1394394401404358696",
    "Kings": "1394394414134071296",
    "Kingd": "1394394711359488101",
    "Kingc": "1394394391027777586",
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
        const emoji = `<:${deck[n]}:${emojis[deck[n]]}>`

        deck.splice(n, 1)
        jsonfile.writeFileSync(`database/deck_${ID}`, deck)

        return{ success: true, card: cards[deck[n]], remaining: deck.length, emoji: emoji, suited: deck[n] }
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