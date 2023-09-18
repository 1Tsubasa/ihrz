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
    PermissionsBitField,
} from 'discord.js';

import { isValid, End } from '../../core/giveawaysManager';

import logger from '../../core/logger';

export = {
    run: async (client: Client, interaction: any, data: any) => {

        let inputData = interaction.options.getString("giveaway-id");

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            await interaction.editReply({ content: data.end_not_admin });
            return;
        };

        let giveaway = await isValid(inputData, {
            guildId: interaction.guild.id
        });

        if (!giveaway) {
            await interaction.editReply({
                content: data.end_not_find_giveaway
                    .replace(/\${gw}/g, inputData)
            });
            return;
        };


        await End(client, {
            guildId: interaction.guild.id,
            messageId: inputData,
        });

        await interaction.editReply({
            content: data.end_confirmation_message
                .replace(/\${timeEstimate}/g, 0)
        });

        try {
            let logEmbed = new EmbedBuilder()
                .setColor("#bf0bb9")
                .setTitle(data.end_logs_embed_title)
                .setDescription(data.end_logs_embed_description
                    .replace(/\${interaction\.user\.id}/g, interaction.user.id)
                    .replace(/\${giveaway\.messageID}/g, inputData)
                );
                
            let logchannel = interaction.guild.channels.cache.find((channel: { name: string; }) => channel.name === 'ihorizon-logs');
            if (logchannel) {
                logchannel.send({ embeds: [logEmbed] })
            };

        } catch (e: any) {
            logger.err(e)
        };
    },
};