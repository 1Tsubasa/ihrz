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
    BaseGuildTextChannel,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    PermissionsBitField,
} from 'discord.js';

export = {
    run: async (client: Client, interaction: ChatInputCommandInteraction, data: any) => {
        if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.reply({ content: data.addmoney_not_admin });
            return;
        };

        let amount = interaction.options.get("amount");
        let user = interaction.options.getUser("member");

        await interaction.reply({
            content: data.addmoney_command_work
                .replace("${user.user.id}", user?.id)
                .replace("${amount.value}", amount?.value)
        });

        await client.db.add(`${interaction.guild?.id}.USER.${user?.id}.ECONOMY.money`, amount?.value as number);

        try {
            let logEmbed = new EmbedBuilder()
                .setColor(await client.db.get(`${interaction.guild?.id}.GUILD.GUILD_CONFIG.embed_color.ihrz-logs`) || "#bf0bb9")
                .setTitle(data.addmoney_logs_embed_title)
                .setDescription(data.addmoney_logs_embed_description
                    .replace(/\${interaction\.user\.id}/g, interaction.user.id)
                    .replace(/\${amount\.value}/g, amount?.value)
                    .replace(/\${user\.user\.id}/g, user?.id)
                );

            let logchannel = interaction.guild?.channels.cache.find((channel: { name: string; }) => channel.name === 'ihorizon-logs');
            if (logchannel) { (logchannel as BaseGuildTextChannel).send({ embeds: [logEmbed] }) }
        } catch (e) { return; };
    },
};