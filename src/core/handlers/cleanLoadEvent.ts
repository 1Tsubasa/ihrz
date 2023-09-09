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

import { Client } from "discord.js";
import { opendir } from "fs/promises";
import { join as pathJoin } from "node:path";
import logger from "../logger";
import config from "../../files/config";

async function buildDirectoryTree(path: string): Promise<(string | object)[]> {
    let result = [];
    let dir = await opendir(path);
    for await (let dirent of dir) {
        if (dirent.isDirectory()) {
            result.push({ name: dirent.name, sub: await buildDirectoryTree(pathJoin(path, dirent.name)) });
        } else {
            result.push(dirent.name);
        }
    }
    return result;
};

function buildPaths(basePath: string, directoryTree: (string | object)[]): string[] {
    let paths = [];
    for (let elt of directoryTree) {
        switch (typeof elt) {
            case "object":
                for (let subElt of buildPaths((elt as any).name, (elt as any).sub)) {
                    paths.push(pathJoin(basePath, subElt));
                }
                break;
            case "string":
                paths.push(pathJoin(basePath, elt));
                break;
            default:
                throw new Error('Invalid element type');
        }
    }
    return paths;
};

async function loadEvents(client: Client, path: string = `${process.cwd()}/dist/src/Events`): Promise<void> {
    let directoryTree = await buildDirectoryTree(path);
    let paths = buildPaths(path, directoryTree);
    var i = 0;
    for (let path of paths) {
        if (!path.endsWith('.js')) return;
        i++;
        let eevent = require(path);
        let patharray = path.split("/");
        client.on(`${patharray[patharray.length - 1].replace('.js', '')}`, eevent.bind(null, client));
    }
    logger.log(`${config.console.emojis.OK} >> Loaded ${i} events.`);
};

export = loadEvents;