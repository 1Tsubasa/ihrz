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
} from 'discord.js';

import * as db from '../../core/functions/DatabaseModel';

export = {
    run: async (client: Client, interaction: any, data: any) => {

        let blockQ = await db.DataBaseModel({ id: db.Get, key: `${interaction.guild.id}.GUILD.TICKET.disable` });

        if (blockQ) {
            await interaction.editReply({ content: data.add_disabled_command });
            return;
        };

        if (interaction.channel.name.includes('ticket-')) {

            let member = interaction.options.getUser("user");

            if (!member) {
                await interaction.editReply({ content: data.add_incorect_syntax });
                return;
            };

            try {
                interaction.channel.permissionOverwrites.create(member, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true });
                await interaction.editReply({ content: data.add_command_work.replace(/\${member\.tag}/g, member.username) });
                return;
            } catch (e) {
                await interaction.editReply({ content: data.add_command_error });
                return;
            }
        };
    },
};