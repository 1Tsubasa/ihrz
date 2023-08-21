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

import { AttachmentBuilder, Client, Guild, GuildChannel, GuildChannelManager, Message, MessageManager } from "discord.js";

import { Collection, EmbedBuilder, PermissionsBitField, AuditLogEvent, Events, GuildBan } from 'discord.js';
import axios from 'axios';

import * as apiUrlParser from '../core/functions/apiUrlParser';
import * as db from '../core/functions/DatabaseModel';
import logger from "../core/logger";
import config from '../files/config';

export = async (client: any, member: any) => {

    let data = await client.functions.getLanguageData(member.guild.id);
    async function joinRoles() {
        if (!member.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) return;

        let roleid = await db.DataBaseModel({ id: db.Get, key: `${member.guild.id}.GUILD.GUILD_CONFIG.joinroles` });
        let role = member.guild.roles.cache.get(roleid);
        if (!roleid || !role) return;

        member.roles.add(roleid).catch(() => { });
    };

    async function joinDm() {
        try {
            let msg_dm = await db.DataBaseModel({ id: db.Get, key: `${member.guild.id}.GUILD.GUILD_CONFIG.joindm` });

            if (!msg_dm || msg_dm === "off") return;
            member.send({ content: "**This is a Join DM from** \`" + member.guild.id + "\`**!**\n" + msg_dm });
        } catch { return; };
    };

    async function blacklistFetch() {
        try {
            if (!await db.DataBaseModel({ id: db.Get, key: `${member.guild.id}.USER.${member.user.id}.ECONOMY.money` })) {
                await db.DataBaseModel({ id: db.Add, key: `${member.guild.id}.USER.${member.user.id}.ECONOMY.money`, value: 1 });
            }

            let e = await db.DataBaseModel({ id: db.Get, key: `GLOBAL.BLACKLIST.${member.user.id}.blacklisted` });

            if (e) {
                member.send({ content: "You've been banned, because you are blacklisted" }).catch(member.ban({ reason: 'blacklisted!' })).catch(() => { });
                member.ban({ reason: 'blacklisted!' });
            }
        } catch { return; };
    };

    async function memberCount() {
        try {
            let botMembers = member.guild.members.cache.filter((member: { user: { bot: any; }; }) => member.user.bot);
            let rolesCollection = member.guild.roles.cache;
            let rolesCount = rolesCollection.size;

            let bot = await db.DataBaseModel({ id: db.Get, key: `${member.guild.id}.GUILD.MCOUNT.bot` });
            let member_2 = await db.DataBaseModel({ id: db.Get, key: `${member.guild.id}.GUILD.MCOUNT.member` });
            let roles = await db.DataBaseModel({ id: db.Get, key: `${member.guild.id}.GUILD.MCOUNT.roles` });

            if (bot) {
                let joinmsgreplace = bot.name
                    .replace("{rolescount}", rolesCount)
                    .replace("{membercount}", member.guild.memberCount)
                    .replace("{botcount}", botMembers.size);
                let fetched = member.guild.channels.cache.get(bot.channel);
                await fetched.edit({ name: joinmsgreplace });
            }

            if (member_2) {
                let joinmsgreplace = member_2.name
                    .replace("{rolescount}", rolesCount)
                    .replace("{membercount}", member.guild.memberCount)
                    .replace("{botcount}", botMembers.size);
                let fetched = member.guild.channels.cache.get(member_2.channel);
                await fetched.edit({ name: joinmsgreplace })
            }

            if (roles) {
                let joinmsgreplace = roles.name
                    .replace("{rolescount}", rolesCount)
                    .replace("{membercount}", member.guild.memberCount)
                    .replace("{botcount}", botMembers.size);

                let fetched = member.guild.channels.cache.get(roles.channel);
                await fetched.edit({ name: joinmsgreplace });
            }
        } catch (e) { return };
    };

    function isVanity(invite: any) {
        return member.guild.features.includes("VANITY_URL") && invite.code == member.guild.vanityURLCode;
    };

    async function welcomeMessage() {
        try {
            let oldInvites = client.invites.get(member.guild.id);
            let newInvites = await member.guild.invites.fetch();

            let invite = newInvites.find((i: { uses: number; code: any; }) => i.uses > oldInvites.get(i.code));
            // if(invite.code == isVanity(invite.code)) { };

            let inviter = await client.users.fetch(invite.inviterId);
            client.invites.get(member.guild.id).set(invite.code, invite.uses);

            let check = await db.DataBaseModel({ id: db.Get, key: `${invite.guild.id}.USER.${inviter.id}.INVITES` });

            if (check) {
                await db.DataBaseModel({ id: db.Add, key: `${invite.guild.id}.USER.${inviter.id}.INVITES.regular`, value: 1 });
                await db.DataBaseModel({ id: db.Add, key: `${invite.guild.id}.USER.${inviter.id}.INVITES.invites`, value: 1 });
            } else {

                await db.DataBaseModel({
                    id: db.Set, key: `${invite.guild.id}.USER.${inviter.id}.INVITES`, value: {
                        regular: 0, bonus: 0, leaves: 0, invites: 0
                    }
                });

                await db.DataBaseModel({ id: db.Add, key: `${invite.guild.id}.USER.${inviter.id}.INVITES.regular`, value: 1 });
                await db.DataBaseModel({ id: db.Add, key: `${invite.guild.id}.USER.${inviter.id}.INVITES.invites`, value: 1 });
                check = await db.DataBaseModel({ id: db.Get, key: `${invite.guild.id}.USER.${inviter.id}.INVITES` });
            };

            await db.DataBaseModel({
                id: db.Set, key: `${invite.guild.id}.USER.${member.user.id}.INVITES.BY`,
                value: {
                    inviter: inviter.id,
                    invite: invite.code,
                }
            });

            var invitesAmount = await db.DataBaseModel({ id: db.Get, key: `${member.guild.id}.USER.${inviter.id}.INVITES.invites` });

            let wChan = await db.DataBaseModel({ id: db.Get, key: `${member.guild.id}.GUILD.GUILD_CONFIG.join` });
            if (!wChan || !client.channels.cache.get(wChan)) return;

            let joinMessage = await db.DataBaseModel({ id: db.Get, key: `${member.guild.id}.GUILD.GUILD_CONFIG.joinmessage` });

            if (!joinMessage) {
                client.channels.cache.get(wChan).send({
                    content: data.event_welcomer_inviter
                        .replace("${member.id}", member.id)
                        .replace("${member.user.createdAt.toLocaleDateString()}", member.user.createdAt.toLocaleDateString())
                        .replace("${member.guild.name}", member.guild.name)
                        .replace("${inviter.tag}", inviter.username)
                        .replace("${fetched}", invitesAmount)
                }).catch(() => { });
                return;
            }

            var joinMessageFormated = joinMessage
                .replace("{user}", member.user.username)
                .replace("{guild}", member.guild.name)
                .replace("{createdat}", member.user.createdAt.toLocaleDateString())
                .replace("{membercount}", member.guild.memberCount)
                .replace("{inviter}", inviter.username)
                .replace("{invites}", invitesAmount);

            client.channels.cache.get(wChan).send({ content: joinMessageFormated }).catch(() => { });
            return;
        } catch (e: any) {
            let wChan = await db.DataBaseModel({ id: db.Get, key: `${member.guild.id}.GUILD.GUILD_CONFIG.join` });
            if (!wChan || !client.channels.cache.get(wChan)) return;

            client.channels.cache.get(wChan).send({
                content: data.event_welcomer_default
                    .replace("${member.id}", member.id)
                    .replace("${member.user.createdAt.toLocaleDateString()}", member.user.createdAt.toLocaleDateString())
                    .replace("${member.guild.name}", member.guild.name)
            }).catch(() => { });
            return;
        }
    };

    async function blockBot() {
        if (await db.DataBaseModel({ id: db.Get, key: `${member.guild.id}.GUILD.BLOCK_BOT` }) && member.user.bot) {
            member.ban({ reason: 'The BlockBot function are enable!' }).catch(() => { });
        };
    };

    async function securityCheck() {
        let baseData = await db.DataBaseModel({ id: db.Get, key: `${member.guild.id}.SECURITY` });
        if (!baseData
            || baseData?.disable === true) return;

        let data = await client.functions.getLanguageData(member.guild.id);
        let channel = member.guild.channels.cache.get(baseData?.channel);
        let request = (await axios.get(apiUrlParser.CaptchaURL))?.data;

        let sfbuff = Buffer.from((request?.image).split(",")[1], "base64");
        let sfattach = new AttachmentBuilder(sfbuff);

        channel.send({
            content: data.event_security
                .replace('${member}', member),
            files: [sfattach]
        }).then(async (msg: any) => {
            let filter = (m: Message) => m.author.id === member.id;
            let collector = msg.channel.createMessageCollector({ filter: filter, time: 30000 });
            let passedtest = false;

            collector.on('collect', (m: any) => {

                m.delete().catch(() => { });
                if (request.text === m.content) {
                    member.roles.add(baseData?.role).catch(() => { });
                    msg.delete().catch(() => { });
                    passedtest = true;
                    collector.stop();
                    return;
                } else {
                    // the member has failed the captcha 
                    msg.delete().catch(() => { });
                    member.kick().catch(() => { });
                    return;
                }
            });

            collector.on('end', (collected: { size: any; }) => {
                if (passedtest) return;
                msg.delete().catch(() => { });
                member.kick().catch(() => { });
            });

        }).catch((error: any) => {
            logger.err(error);
        });
    };

    await blockBot(), joinRoles(), joinDm(), blacklistFetch(), memberCount(), welcomeMessage(), securityCheck();
};