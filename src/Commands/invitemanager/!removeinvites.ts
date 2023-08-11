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

import * as db from '../../core/functions/DatabaseModel';

export = {
    run: async (client: Client, interaction: any, data: any) => {

        let user = interaction.options.getMember("member");
        let amount = interaction.options.getNumber("amount");
        let a = new EmbedBuilder().setColor("#FF0000").setDescription(data.removeinvites_not_admin_embed_description);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.editReply({ embeds: [a] });
            return;
        }

        await db.DataBaseModel({ id: db.Sub, key: `${interaction.guild.id}.USER.${user.id}.INVITES.invites`, value: amount });

        let finalEmbed = new EmbedBuilder()
            .setDescription(data.removeinvites_confirmation_embed_description
                .replace(/\${amount}/g, amount)
                .replace(/\${user}/g, user)
            )
            .setColor(`#92A8D1`)
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) });

        await db.DataBaseModel({ id: db.Sub, key: `${interaction.guild.id}.USER.${user.id}.INVITES.bonus`, value: amount });
        await interaction.editReply({ embeds: [finalEmbed] });

        try {
            let logEmbed = new EmbedBuilder()
                .setColor("#bf0bb9")
                .setTitle(data.removeinvites_logs_embed_title)
                .setDescription(data.removeinvites_logs_embed_description
                    .replace(/\${interaction\.user\.id}/g, interaction.user.id)
                    .replace(/\${amount}/g, amount)
                    .replace(/\${user\.id}/g, user.id)
                );

            let logchannel = interaction.guild.channels.cache.find((channel: { name: string; }) => channel.name === 'ihorizon-logs');

            if (logchannel) {
                logchannel.send({ embeds: [logEmbed] })
            };
        } catch (e: any) {
            return
        };
    },
};