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

import {
    Client,
    EmbedBuilder,
} from 'discord.js';

import { QueryType } from 'discord-player';

import * as db from '../../core/functions/DatabaseModel';

export = {
    run: async (client: Client, interaction: any, data: any) => {

        let voiceChannel = interaction.member.voice.channel;
        let check = interaction.options.getString("title");

        if (!voiceChannel) {
            await interaction.editReply({ content: data.p_not_in_voice_channel });
            return;
        };
        //if (!client.functions.isLinkAllowed(check)) { return interaction.editReply({ content: data.p_not_allowed }) };

        let result = await interaction.client.player.search(check, {
            requestedBy: interaction.user, searchEngine: QueryType.AUTO
        });

        let results = new EmbedBuilder()
            .setTitle(data.p_embed_title)
            .setColor(await db.DataBaseModel({ id: db.Get, key: `${interaction.guild.id}.GUILD.GUILD_CONFIG.embed_color.music-cmd` }) || '#ff0000')
            .setTimestamp();

        if (!result.hasTracks()) {
            await interaction.editReply({ embeds: [results] });
            return;
        };

        let yes = await interaction.client.player.play(interaction.member.voice.channel?.id, result, {
            nodeOptions: {
                metadata: {
                    channel: interaction.channel,
                    client: interaction.guild?.members.me,
                    requestedBy: interaction.user.globalName
                },
                volume: 60,
                bufferingTimeout: 3000,
                leaveOnEnd: true,
                leaveOnEndCooldown: 150000,
                leaveOnStop: true,
                leaveOnStopCooldown: 30000,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 300000,
            },
        });

        function yess() {
            let totalDurationMs = yes.track.playlist.tracks.reduce((a: any, c: { durationMS: any; }) => c.durationMS + a, 0)
            let totalDurationSec = Math.floor(totalDurationMs / 1000);
            let hours = Math.floor(totalDurationSec / 3600);
            let minutes = Math.floor((totalDurationSec % 3600) / 60);
            let seconds = totalDurationSec % 60;
            let durationStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            return durationStr;
        };

        let embed = new EmbedBuilder()
            .setDescription(`${yes.track.playlist ? `**multiple tracks** from: **${yes.track.playlist.title}**` : `**${yes.track.title}**`}`)
            .setColor(await db.DataBaseModel({ id: db.Get, key: `${interaction.guild.id}.GUILD.GUILD_CONFIG.embed_color.music-cmd` }) || '#00cc1a')
            .setTimestamp()
            .setFooter({ text: data.p_duration + `${yes.track.playlist ? `${yess()}` : `${yes.track.duration}`}` });

        embed
            .setThumbnail(`${yes.track.playlist ? `${yes.track.playlist.thumbnail}` : `${yes.track.thumbnail}`}`)

        await interaction.editReply({
            content: data.p_loading_message
                .replace("{result}", result.playlist ? 'playlist' : 'track'), embeds: [embed]
        });
        return;
    },
};