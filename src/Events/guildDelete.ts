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

import { Client, Guild, GuildChannel, GuildChannelManager, Message, MessageManager } from "discord.js";
import { Collection, EmbedBuilder, PermissionsBitField, AuditLogEvent, Events, GuildBan } from 'discord.js';
import * as db from '../core/functions/DatabaseModel';
import logger from "../core/logger";
import config from '../files/config';

export = async (client: Client, guild: Guild) => {
    async function inviteManager() {
        await db.DataBaseModel({ id: db.Delete, key: `${guild.id}` })
        return client.invites.delete(guild.id);
    };

    async function ownerLogs() {
        try {
            let i: string = '';
            if (guild.vanityURLCode) { i = 'discord.gg/' + guild.vanityURLCode; };
            let embed = new EmbedBuilder().setColor("#ff0505").setTimestamp(guild.joinedTimestamp).setDescription(`**A guild have deleted iHorizon !**`)
                .addFields({ name: "🏷️・Server Name", value: `\`${guild.name}\``, inline: true },
                    { name: "🆔・Server ID", value: `\`${guild.id}\``, inline: true },
                    { name: "🌐・Server Region", value: `\`${guild.preferredLocale}\``, inline: true },
                    { name: "👤・MemberCount", value: `\`${guild.memberCount}\` members`, inline: true },
                    { name: "🪝・Vanity URL", value: `\`${i || 'None'}\``, inline: true })
                .setThumbnail(guild.iconURL())
                .setFooter({ text: 'iHorizon', iconURL: client.user?.displayAvatarURL() });

            let channel: any = client.channels.cache.get(config.core.guildLogsChannelID);

            return channel.send({ embeds: [embed] });
        } catch (error: any) {
            logger.err(error);
        };
    };

    await ownerLogs(), inviteManager();
};