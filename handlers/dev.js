const readline  = require("readline");
const fs        = require("fs")
const path      = require("path")
const dh        = require('../handlers/dataHandler.js')

const rl = readline.createInterface(
{
    input: process.stdin,
    output: process.stdout,
    prompt: '- '
});
    
async function devTools()
{
    rl.prompt();

    rl.on('line', (line) => 
    {
        const input     = line.trim();
        const args      = input.split(" ")
        const command   = args.shift()


        switch (command) 
        {
            case "set":
            {
                const [ UID, key, value ] = args;
                
                if(!UID || !key || value === undefined)
                {
                    console.log("Usage: set <id> <property> <value> \nExample: \nset 467019235328000001 money 100")
                    break;
                }

                let parsedVal;
                if(value === "true")        parsedVal = true
                else if(value === "false")  parsedVal = false
                else if(!isNaN(value))      parsedVal = Number(value)
                else                        parsedVal = value
            
                const userStats = dh.devGet(UID)

                if (userStats === 0) 
                {
                    console.log("User not found!")
                    break;
                }
                else if(!(key in userStats))
                {
                    console.log("Key not found!")
                    break;
                }

                userStats[key] = parsedVal

                dh.userSave(userStats)

                console.log(`Successfully set ${userStats.userID}.${key} to ${userStats[key]}`)

                break;
            }

            case "get":
            {
                const UID = args

                if(!UID)
                {
                    console.log("Usage: get <id> \nExample: \nget 467019235328000001")
                    break;
                }

                const userStats = dh.devGet(UID)

                if (userStats === 0) 
                {
                    console.log("User not found!")
                    break;
                }

                console.log(userStats)

                break;
            }

        case "backup":
        {
            const date  = new Date().toISOString().split('T')[0]
            const src   = path.join("database", "userdata.json")
            const dest  = path.join("database", "backups", `backup_${date}.json`)

            fs.copyFileSync(src, dest)

            console.log("Successfully backed up Database " + date)

            break;
        }
            default: { console.log(`Unknown command: ${input}`) }
        }

        rl.prompt();
    }).on('close', () => 
    {
        log('Stopping bot...');
        
        process.exit(0);
    });
}


async function log(content)
{
    const now       = new Date()
    const months    = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    const pad       = n => String(n).padStart(2, "0")

    const s     = pad(now.getSeconds())
    const m     = pad(now.getMinutes())
    const h     = pad(now.getHours())
    const d     = pad(now.getDate())
    const mo    = months[now.getMonth()]

    const date  = `<${d}-` + `${mo} ` + `${h}:`+ `${m}:` + `${s}> `

    readline.clearLine(process.stdout, 0);       
    readline.cursorTo(process.stdout, 0);        

    console.log(date, content);                        

    rl.prompt(true);                             
}

module.exports =
{
    log, devTools
}