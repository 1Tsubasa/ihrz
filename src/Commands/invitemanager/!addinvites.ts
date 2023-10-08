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

export = {
    run: async (client: Client, interaction: any, data: any) => {

        let user = interaction.options.getMember("member");
        let amount = interaction.options.getNumber("amount");

        let a = new EmbedBuilder().setColor(await db.DataBaseModel({ id: db.Get, key: `${interaction.guild.id}.GUILD.GUILD_CONFIG.embed_color`}) || "#FF0000").setDescription(data.addinvites_not_admin_embed_description);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.editReply({ embeds: [a] });
            return;
        };

        await client.db.add(`${interaction.guild.id}.USER.${user.id}.INVITES.invites`, amount);

        let finalEmbed = new EmbedBuilder()
            .setDescription(data.addinvites_confirmation_embed_description
                .replace(/\${amount}/g, amount)
                .replace(/\${user}/g, user)
            )
            .setColor(await db.DataBaseModel({ id: db.Get, key: `${interaction.guild.id}.GUILD.GUILD_CONFIG.embed_color`}) || `#92A8D1`)
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) });

        await client.db.add(`${interaction.guild.id}.USER.${user.id}.INVITES.bonus`, amount);
        await interaction.editReply({ embeds: [finalEmbed] });

        try {
            let logEmbed = new EmbedBuilder()
                .setColor(await db.DataBaseModel({ id: db.Get, key: `${interaction.guild.id}.GUILD.GUILD_CONFIG.embed_color.ihrz-logs`}) || "#bf0bb9")
                .setTitle(data.addinvites_logs_embed_title)
                .setDescription(data.addinvites_logs_embed_description
                    .replace(/\${interaction\.user\.id}/g, interaction.user.id)
                    .replace(/\${amount}/g, amount)
                    .replace(/\${user\.id}/g, user.id)
                );

            let logchannel = interaction.guild.channels.cache.find((channel: { name: string; }) => channel.name === 'ihorizon-logs');

            if (logchannel) {
                logchannel.send({ embeds: [logEmbed] });
            };
        } catch (e: any) {
            return;
        };
    },
};