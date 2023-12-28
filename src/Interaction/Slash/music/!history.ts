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
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    PermissionsBitField,
} from 'discord.js';
import { LanguageData } from '../../../../types/languageData';

export = {
    run: async (client: Client, interaction: ChatInputCommandInteraction, data: LanguageData) => {

        if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.editReply({ content: data.punishpub_not_admin });
            return;
        };

        let history = await client.db.get(`${interaction.guildId}.MUSIC_HISTORY`);

        if (!history || !history.embed || history.embed.length == 0) {
            await interaction.editReply({ content: "There is no entry into this competition." });
            return;
        };

        let buffer = Buffer.from(history.buffer.map((content: string) => content).join('\n'), 'utf-8');
        let attachment = new AttachmentBuilder(buffer, { name: 'music_history_by_ihorizon.txt' })

        let currentPage = 0;
        let usersPerPage = 10;
        let pages: { title: string; description: string; }[] = [];

        for (let i = 0; i < history?.embed.length; i += usersPerPage) {
            let pageUsers = history?.embed.slice(i, i + usersPerPage);
            let pageContent = pageUsers.map((userId: string) => userId).join('\n');

            pages.push({
                title: `${interaction.guild?.name} Music's History | Page ${i / usersPerPage + 1}`,
                description: pageContent,
            });
        };

        let createEmbed = () => {
            return new EmbedBuilder()
                .setColor('#00cc1a')
                .setTimestamp()
                .setTitle(pages[currentPage].title)
                .setDescription(pages[currentPage].description)
                .setFooter({ text: `iHorizon | Page ${currentPage + 1}/${pages.length}`, iconURL: interaction.client.user?.displayAvatarURL() })
                .setTimestamp()
        };

        let row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('previousPage')
                .setLabel('⬅️')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('nextPage')
                .setLabel('➡️')
                .setStyle(ButtonStyle.Secondary),
        );

        let messageEmbed = await interaction.editReply({
            embeds: [createEmbed()], components: [(row as ActionRowBuilder<ButtonBuilder>)], files: [attachment]
        });

        let collector = messageEmbed.createMessageComponentCollector({
            filter: (i) => {
                i.deferUpdate();
                return interaction.user.id === i.user.id;
            }, time: 60000
        });

        collector.on('collect', (interaction: { customId: string; }) => {
            if (interaction.customId === 'previousPage') {
                currentPage = (currentPage - 1 + pages.length) % pages.length;
            } else if (interaction.customId === 'nextPage') {
                currentPage = (currentPage + 1) % pages.length;
            }

            messageEmbed.edit({ embeds: [createEmbed()] });
        });

        collector.on('end', () => {
            row.components.forEach((component) => {
                if (component instanceof ButtonBuilder) {
                    component.setDisabled(true);
                }
            });
            messageEmbed.edit({ components: [(row as ActionRowBuilder<ButtonBuilder>)] });
        });

        return;
    },
};