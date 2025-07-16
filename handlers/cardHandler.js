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

const emojis =
{
    "Aceh": "1394411729664086076",
    "Aces": "1394411735619997726",
    "Aced": "1394411723234087002",
    "Acec": "1394411715856175226",
    "2h": "1394411507969949931",
    "2s": "1394411517125984368",
    "2d": "1394411502282211489",
    "2c": "1394411492140515519",
    "3h": "1394411536331837542",
    "3s": "1394411541373386823",
    "3d": "1394411530480517305",
    "3c": "1394411524126277683",
    "4h": "1394411565087850506",
    "4s": "1394411571421122600",
    "4d": "1394411559085805700",
    "4c": "1394411546905542818",
    "5h": "1394411593097285643",
    "5s": "1394411597635649536",
    "5d": "1394411587217002670",
    "5c": "1394411577825955870",
    "6h": "1394411611376193586",
    "6s": "1394411616014962808",
    "6d": "1394411606322053261",
    "6c": "1394411601976758323",
    "7h": "1394411635833176065",
    "7s": "1394411641457873120",
    "7d": "1394411630447693985",
    "7c": "1394411624449835051",
    "8h": "1394411656188002405",
    "8s": "1394411662345375904",
    "8d": "1394411646159556740",
    "8c": "1394394110500278404",
    "9h": "1394411678677991434",
    "9s": "1394411683023159407",
    "9d": "1394411673929912351",
    "9c": "1394411668238368768",
    "10h": "1394411699787927606",
    "10s": "1394411708180729986",
    "10d": "1394411692267540571",
    "10c": "1394411687582502992",
    "Jackh": "1394412135135580240",
    "Jacks": "1394412142484263016",
    "Jackd": "1394412128462438453",
    "Jackc": "1394412120631934977",
    "Queenh": "1394412191989633115",
    "Queens": "1394412200122388621",
    "Queend": "1394412186067271730",
    "Queenc": "1394412178693427380",
    "Kingh": "1394412165083173076",
    "Kings": "1394412170141503529",
    "Kingd": "1394412158129012917",
    "Kingc": "1394412150860025966",
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
            const card  = cards[deck[n]]

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