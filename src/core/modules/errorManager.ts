/*
・ iHorizon Discord Bot (https://github.com/ihrz/ihrz)

・ Licensed under the Attribution-NonCommercial-ShareAlike 2.0 Generic (CC BY-NC-SA 2.0)

    ・   Under the following terms:

        ・ Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

        ・ NonCommercial — You may not use the material for commercial purposes.

        ・ ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

        ・ No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.


・ Mainly developed by Kisakay (https://github.com/Kisakay)

・ Copyright © 2020-2024 iHorizon
*/

import { format } from '../functions/date-and-time.js';
import config from '../../files/config.js';
import logger from '../logger.js';

import { MongoDriver } from 'quickmongo';
import fs from 'node:fs';

let exec = async (driver: MongoDriver) => {
    await driver.close();
    logger.warn(`${config.console.emojis.ERROR} >> Database connection are closed (${config.database?.method})!`);
    process.exit();
};

export const uncaughtExceptionHandler = () => {
    process.on('uncaughtException', function (err) {
        if (!config.core.devMode) {
            logger.err(`${config.console.emojis.ERROR} >> Error detected`.red());
            logger.err(`${config.console.emojis.OK} >> Save in the logs`.gray());

            let filesPath: string = `${process.cwd()}/src/files/error.log`;
            let CreateFile = fs.createWriteStream(filesPath, { flags: 'a' });
            let i = `[${format((new Date()), 'DD/MM/YYYY HH:mm:ss')}]\n${err.stack || err.message}\r\n`;

            return CreateFile.write(i);
        };

        logger.err(err.stack || err.message);
    });
};

export let exit = async (driver: MongoDriver) => {
    process.on('exit', async () => { await exec(driver); });
    process.on('abort', async () => { await exec(driver); });
    process.on('SIGINT', async () => { await exec(driver); });
};