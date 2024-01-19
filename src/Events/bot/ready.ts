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

import { Client, Collection, PermissionsBitField, ActivityType, EmbedBuilder, GuildFeature } from 'discord.js';
import { PfpsManager_Init } from "../../core/managers/pfpsManager.js";
import logger from "../../core/logger.js";
import couleurmdr from 'colors';
import config from "../../files/config.js";

import { OwnIHRZ } from "../../core/managers/ownihrzManager.js";

export default async (client: Client) => {

    async function fetchInvites() {
        client.guilds.cache.forEach(async (guild) => {
            try {
                if (!guild.members.me?.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) return;
                var firstInvites = await guild.invites.fetch();
                client.invites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));

                if (guild.features.includes(GuildFeature.VanityURL)) {
                    guild.fetchVanityData().then((vanityInvite) => {
                        client.vanityInvites.set(guild.id, vanityInvite);
                    });
                }
            } catch (error: any) {
                logger.err(couleurmdr.red(`Error fetching invites for guild ${guild.id}: ${error}`));
            };
        });
    };

    async function refreshDatabaseModel() {
        await client.db.set(`GLOBAL.OWNER.${config.owner.ownerid1}`, { owner: true });
        await client.db.set(`GLOBAL.OWNER.${config.owner.ownerid2}`, { owner: true });
        await client.db.set(`TEMP`, {});
    };

    async function quotesPresence() {
        let quotes = [
            "Balls",
            "discord.gg/ihorizon",
            "https://ihorizon.me",
            "iHorizon x ElektraBots <3",
            "💫 2024 💫",
            "Santa give me lot of script 😇",
            "Like my owner say: More TYPING, MORE TYPING",
            "My source are leaked... github.com/ihrz/ihrz",
            "Eesh, i'm not the most wonderful bot on this Earth? Fake news",
            "iHorizon can hug you when you want 🫂",
            "iHorizon is Free & OpenSource 😎",
            "All humans have rights!",
            // "Did you know you can have your own iHorizon? For really cheap??",
            // "Our goal is to make the internet simpler!",
            "My goal is to make internet so simple that my own mother can use it!",
            // "280K USERS !? 🥳🥳🥳",
            // "It's not 250k anymore it's 280k 😎😎😎😎",
            // "trusted by big servers 😎",
            // "Nah men I'm not getting paid enough to manage 280K users...",
            // "Never gonna give you up...BRO YOU'VE BEEN RICK ROLLED BY A BOT",
            // "I have a youtube channel!",
            "Youtube, X (twitter), only****, what's next?",
            // "Github is basically onlyfan for code, so I have an onlyfan 😎",
            // "My owner doesn't use tiktok...I INSTALLED IT BEHIND HER BACK",
            // "I removed my own database (going insane) 😎😎😎",
            // "I can code myself (Not a joke)",
            // "I BROKED MY CODE HELP ME",
            // "What is a database? Do I really need one?",
            "20 iHorizon's Coins for my token!!",
            "All discord bots have right.. To advertise me!"
        ];
        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        client.user?.setPresence({ activities: [{ name: randomQuote, type: ActivityType.Custom }] });
    };

    let iHorizon_Container = new OwnIHRZ();
    iHorizon_Container.Startup(client);
    iHorizon_Container.Startup_Cluster(client);

    setInterval(() => {
        iHorizon_Container.Refresh(client);
        iHorizon_Container.Refresh_Cluster(client)
    }, 86400000);

    setInterval(quotesPresence, 120_000);

    fetchInvites(), refreshDatabaseModel(), quotesPresence();

    PfpsManager_Init(client);
};
