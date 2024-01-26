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

import { Collection, EmbedBuilder, PermissionsBitField, AuditLogEvent, Client, GuildMember, BaseGuildTextChannel, AuditLogChange } from 'discord.js';

export default async (client: Client, oldMember: GuildMember, newMember: GuildMember) => {
    let data = await client.functions.getLanguageData(newMember.guild.id);

    async function serverLogs() {
        if (!newMember.guild.members.me?.permissions.has([PermissionsBitField.Flags.ViewAuditLog])) return;

        let fetchedLogs = await newMember.guild.fetchAuditLogs({
            type: AuditLogEvent.MemberRoleUpdate,
            limit: 1,
        });

        let firstEntry = fetchedLogs.entries.first();

        if (!firstEntry
            || firstEntry.executorId == client.user?.id
            || firstEntry.targetId !== newMember.user.id
        ) return;

        let someinfo = await client.db.get(`${newMember.guild.id}.GUILD.SERVER_LOGS.roles`);
        let Msgchannel = client.channels.cache.get(someinfo);

        if (!someinfo || !Msgchannel) return;

        interface CustomObject {
            id: string;
        }

        let newObjects: CustomObject[] = [];
        let removeObjects: CustomObject[] = [];

        firstEntry.changes.forEach((item) => {
            if (item.key === '$add') {
                newObjects.push(...<CustomObject[]>item.new);
            } else if (item.key === '$remove') {
                removeObjects.push(...<CustomObject[]>item.new);
            }
        });

        let newObjectsnewObjectIds: string[] = newObjects.map((obj) => obj.id);
        let removeObjectIds: string[] = removeObjects.map((obj) => obj.id);

        let logsEmbed = new EmbedBuilder()
            .setColor("#000000")
            .setAuthor({ name: firstEntry.target?.username as string, iconURL: firstEntry.target?.displayAvatarURL({ extension: 'png', forceStatic: false, size: 512 }) })
            .setTimestamp();

        let desc = ' ';

        if (removeObjects.length >= 1) {
            desc += data.event_srvLogs_guildMemberUpdate_description
                .replace("${firstEntry.executor.id}", firstEntry.executor?.id)
                .replace("${removedRoles}", removeObjectIds.map(value => `<@&${value}>`))
                .replace("${oldMember.user.username}", firstEntry.target?.username) + '\n';
        };

        if (newObjects.length >= 1) {
            desc += data.event_srvLogs_guildMemberUpdate_2_description
                .replace("${firstEntry.executor.id}", firstEntry.executor?.id)
                .replace("${addedRoles}", newObjectsnewObjectIds.map(value => `<@&${value}>`))
                .replace("${oldMember.user.username}", firstEntry.target?.username);
        };
        logsEmbed.setDescription(desc);

        (Msgchannel as BaseGuildTextChannel).send({ embeds: [logsEmbed] }).catch(() => { });
    };

    async function serverLogs_Boost() {
        if (!newMember.guild.roles.premiumSubscriberRole) return;
        let someinfo = await client.db.get(`${newMember.guild.id}.GUILD.SERVER_LOGS.boosts`);
        let Msgchannel = newMember.guild.channels.cache.get(someinfo);

        if (!someinfo || !Msgchannel) return;

        let embed = new EmbedBuilder()
            .setColor("#a27cec")
            .setAuthor({ name: newMember?.user.username as string, iconURL: newMember?.displayAvatarURL({ extension: 'png', forceStatic: false, size: 512 }) })
            .setTimestamp();

        if (
            !oldMember.premiumSince
            && newMember.premiumSince
        ) {
            embed.setDescription(data.event_boostlog_add
                .replace('${newMember.user.id}', newMember.user.id)
                .replace('${newMember.guild.premiumSubscriptionCount}', newMember.guild.premiumSubscriptionCount)
            );

            (Msgchannel as BaseGuildTextChannel).send({ embeds: [embed] }).catch(() => { });
            return;
            
        } else if (
            oldMember.premiumSince
            && !newMember.premiumSince
        ) {
            embed.setDescription(data.event_boostlog_sub
                .replace('${newMember.user.id}', newMember.user.id)
                .replace('${newMember.guild.premiumSubscriptionCount}', newMember.guild.premiumSubscriptionCount)
            );

            (Msgchannel as BaseGuildTextChannel).send({ embeds: [embed] }).catch(() => { });
            return;
        }
    };

    serverLogs_Boost();
    serverLogs();
};