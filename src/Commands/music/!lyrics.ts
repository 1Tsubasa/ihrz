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

import logger from '../../core/logger';
import {lyricsExtractor} from '@discord-player/extractor';

const lyricsFinder = lyricsExtractor();

export = {
    run: async (client: Client, interaction: any, data: any) => {

        try {
            let title = interaction.options.getString("title");
            let lyrics = await lyricsFinder.search(title).catch(() => null);

            if (!lyrics) return interaction.reply({content: 'No lyrics found', ephemeral: true});
            let trimmedLyrics = lyrics.lyrics.substring(0, 1997);

            let embed = new EmbedBuilder()
                .setTitle(lyrics.title)
                .setURL(lyrics.url)
                .setTimestamp()
                .setThumbnail(lyrics.thumbnail)
                .setAuthor({
                    name: lyrics.artist.name,
                    iconURL: lyrics.artist.image,
                    url: lyrics.artist.url
                })
                .setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics)
                .setColor('#cd703a')
                .setFooter({text: 'iHorizon', iconURL: client.user?.displayAvatarURL()});

            return interaction.reply({embeds: [embed]});

        } catch (error: any) {
            logger.err(error);
        }
        ;
    },
}