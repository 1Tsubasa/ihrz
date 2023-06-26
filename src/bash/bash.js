/*
・ iHorizon Discord Bot (https://github.com/ihrz/ihrz)

・ Licensed under the Attribution-NonCommercial-ShareAlike 2.0 Generic (CC BY-NC-SA 2.0)

    ・   Under the following terms:

        ・ Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

        ・ NonCommercial — You may not use the material for commercial purposes.

        ・ ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

        ・ No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.


・ Mainly developed by Kisakay (https://github.com/Kisakay)

・ Copyright © 2020-2023 iHorizon
*/

const wait = require(`${process.cwd()}/src/core/wait`),
    couleurmdr = require('colors'),
    DataBaseModel = require(`${process.cwd()}/files/ihorizon-api/main`),
    os = require('os-utils'),
    readline = require('readline'),
    fs = require('fs'),
    config = require(`${process.cwd()}/files/config`),
    path = require('path'),
    getIP = require(`${process.cwd()}/files/ihorizon-api/getIP`),
    logger = require(`${process.cwd()}/src/core/logger`);

module.exports = async (client) => {
    if (config.core.bash) {

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const now2 = new Date(),
            year = now2.getFullYear().toString().substr(-2),
            month = now2.toLocaleString('default', { month: 'short' }),
            day = now2.toLocaleString('default', { day: '2-digit' }),
            time = now2.toLocaleTimeString('en-US', { hour12: false });

        logger.legacy(`* iHorizon bash terminal is in power on...`.gray.bgBlack);
        await wait(1000);
        logger.legacy(`* iHorizon bash terminal is in booting...`.gray.bgBlack);
        await wait(1000);
        logger.legacy(`* iHorizon bash terminal is in loading...`.gray.bgBlack);
        await wait(1000);
        logger.legacy(`* iHorizon has been loaded !`.gray.bgBlack);

        const now = new Date();
        const options = {
            day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit',
            minute: '2-digit', second: '2-digit', timeZone: 'UTC'
        };

        const formattedDate = now.toLocaleDateString('fr-FR', options),
            LoadFiles = await DataBaseModel({ id: DataBaseModel.Get, key: `BASH.LAST_LOGIN` }) || "None",
            LoadFiles2 = "127.0.0.1";

        const filePath = path.join(process.cwd(), 'src', 'bash', 'history', '.bash_history'),
            createFiles = fs.createWriteStream(filePath, { flags: 'a' });

        let dateStr = `${day} ${month} ${year} ${time} 2023`;
        await DataBaseModel({ id: DataBaseModel.Set, key: `BASH.LAST_LOGIN`, value: dateStr.toString() });
        logger.legacy(`Welcome to iHorizon Bash
    
    * Documentation:  https://github.com/ihrz/ihrz/
    
     System information as of mar.  ${formattedDate}
     Memory usage:                  ${os.freememPercentage()}%
     IPv4 address for eth0:         ${await getIP()}
     IPv6 address for eth0:         None
    
    
    Last login: ${LoadFiles} from ${LoadFiles2}`);

        rl.setPrompt('kisakay@ihorizon'.green + ":".white + "~".blue + "$ ".white);
        rl.prompt();
        rl.on('line', (line) => {
            const [commandName, ...args] = line.trim().split(' '),
                commandPath = `${process.cwd()}/src/bash/commands/${commandName}.js`;
            if (fs.existsSync(commandPath)) {
                const command = require(commandPath);
                command(client, args.join(' '));

                var data = fs.readFileSync(filePath);
                var res = data.toString().split('\n').length;
                if (commandName) { createFiles.write(`   ${res}  ${line}\r\n`); };
            } else {
                if (!commandName) { } else { logger.legacy(`Command not found: ${commandName}`); };
            }
            rl.prompt();
        });

        process.on('SIGINT', () => {
            logger.legacy(`\n* Please shutdown with the command the next time`.gray.bgBlack)
            process.exit(0);
        });  // CTRL+C
        process.on('SIGQUIT', () => {
            logger.legacy(`\n* Please shutdown with the command`.gray.bgBlack)
            process.exit(0);
        }); // Keyboard quit
    }
};