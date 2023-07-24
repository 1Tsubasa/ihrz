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

import CryptoJS from 'crypto-js';
import logger from '../../core/logger';
import config from '../../files/config';
import dbPromise from '../../core/database';
import { Request, Response } from 'express';

export = async (req: Request, res: Response) => {
    const { text } = req.body;
    const db: any = await dbPromise;

    try {
        var bytes = CryptoJS.AES.decrypt(text, config.api.apiToken);
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        var id = decryptedData.id;
        var key = decryptedData.key;
        var values = decryptedData.values || decryptedData.value;

        switch (id) {
            case 1:
                await db.set(key, values);
                res.sendStatus(200);
                break;
            case 2:
                await db.push(key, values);
                res.sendStatus(200);
                break;
            case 3:
                await db.sub(key, values);
                res.sendStatus(200);
                break;
            case 4:
                await db.add(key, values);
                res.sendStatus(200);
                break;
            case 5:
                res.send({ r: await db.get(key) });
                break;
            case 6:
                await db.pull(key, values);
                res.send(200);
                break;
            case 7:
                res.send({ r: await db.all() });
                break;
            case 8:
                await db.delete(key, values);
                res.sendStatus(200);
                break;
            default:
                await res.sendStatus(403) && logger.warn(`${id} -> Bad json request without ip/key`);
                break;
        };
    } catch (e: any) {
        res.sendStatus(403) && logger.warn(e);
        return logger.warn("-> Bad json request without ip/key" + e);
    };
};