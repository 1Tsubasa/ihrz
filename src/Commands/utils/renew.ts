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
    PermissionsBitField,
} from 'discord.js'

import { Command } from '../../../types/command';

export let command: Command = {
    name: 'renew',
    description: 'Re-created a channels (cloning permission and all configurations). nuke equivalent',
    category: 'utils',
    run: async (client: Client, interaction: any) => {
        let data = await client.functions.getLanguageData(interaction.guild.id);
        
        if (!interaction.member.permissions.has([PermissionsBitField.Flags.Administrator])) {
            return interaction.editReply({ content: data.renew_not_administrator });
        };

        let channel = interaction.channel;

        try {
            await channel.delete();

            let here = await channel.clone({
                name: channel.name,
                permissions: channel.permissionsOverwrites,
                type: channel.type,
                topic: channel.withTopic,
                nsfw: channel.nsfw,
                birate: channel.bitrate,
                userLimit: channel.userLimit,
                rateLimitPerUser: channel.rateLimitPerUser,
                position: channel.rawPosition,
                reason: `Channel re-create by ${interaction.user} (${interaction.user.id})`
            });

            here.send({ content: data.renew_channel_send_success.replace(/\${interaction\.user}/g, interaction.user) })
        } catch (error) {
            return interaction.editReply({ content: data.renew_dont_have_permission });
        }
    },
};