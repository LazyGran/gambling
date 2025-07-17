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
    "Aceh": "1395385705806434405",
    "Aces": "1395385712605659248",
    "Aced": "1395385698520928357",
    "Acec": "1395385686278017034",
    "2h": "1395385474067206248",
    "2s": "1395385481201586216",
    "2d": "1395385468111163504",
    "2c": "1395385460142116864",
    "3h": "1395385498448560192",
    "3s": "1395385503678857266",
    "3d": "1395385491549061251",
    "3c": "1395385486436208712",
    "4h": "1395385519265022034",
    "4s": "1395385524444991648",
    "4d": "1395385514843963595",
    "4c": "1395385508917547139",
    "5h": "1395385543684128801",
    "5s": "1395385548277022821",
    "5d": "1395385538592112762",
    "5c": "1395385532661370880",
    "6h": "1395385568010960926",
    "6s": "1395385575724286044",
    "6d": "1395385561728155810",
    "6c": "1395385552353628262",
    "7h": "1395385595001307178",
    "7s": "1395385600160563210",
    "7d": "1395385590916186142",
    "7c": "1395385585337897172",
    "8h": "1395385616249786510",
    "8s": "1395385630166614159",
    "8d": "1395385609656209568",
    "8c": "1395385604526702592",
    "9h": "1395385649493704754",
    "9s": "1395385653457326172",
    "9d": "1395385643097391156",
    "9c": "1395385636130918531",
    "10h": "1395385674361868288",
    "10s": "1395385680439414814",
    "10d": "1395385668435443782",
    "10c": "1395385659094732961",
    "Jackh": "1395385733275058297",
    "Jacks": "1395385740178751508",
    "Jackd": "1395385726773760071",
    "Jackc": "1395385719891034173",
    "Queenh": "1395385785917767720",
    "Queens": "1395385791642861599",
    "Queend": "1395385780620361753",
    "Queenc": "1395385775016775750",
    "Kingh": "1395385755844608172",
    "Kings": "1395385769245544568",
    "Kingd": "1395385750761111603",
    "Kingc": "1395385746252103790",
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

        const n         = random.integer(0, deck.length - 1)
        const emoji     = `<:${deck[n]}:${emojis[deck[n]]}>`
        const card      = cards[deck[n]]
        const suited    = deck[n]

        deck.splice(n, 1)
        jsonfile.writeFileSync(`database/deck_${ID}`, deck)

        return{ success: true, card: card, remaining: deck.length, emoji: emoji, suited: suited }
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