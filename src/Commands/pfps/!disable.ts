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
    PermissionsBitField
} from 'discord.js';

export = {
    run: async (client: Client, interaction: any, data: any) => {

        let action = interaction.options.getString('action');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.editReply({ content: ":x: You don't have Administrator Permissions to execute this command" });
            return;
        };

        if (action === 'on') {
            await client.db.set(`${interaction.guild.id}.PFPS.disable`, false);
            await interaction.editReply({ content: `${interaction.user}, you have set to \`Power On\` the PFPS Module.\nIf channel doesn't exist, configure these, with the command: **/pfps channel**.` });

            return;
        } else if (action === 'off') {
            await client.db.set(`${interaction.guild.id}.PFPS.disable`, true);
            await interaction.editReply({ content: `${interaction.user}, you have set to \`Power Off\` the PFPS Module.` });

            return;
        }
    },
};