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
} from 'discord.js';

import * as db from '../../core/functions/DatabaseModel';

import backup from 'discord-backup';

export = {
    run: async (client: Client, interaction: any, data: any) => {
        let backupID = interaction.options.getString('backup-id');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.editReply({ content: data.backup_dont_have_perm_on_load });
            return;
        };

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.editReply({ content: data.backup_i_dont_have_perm_on_load });
            return;
        };

        if (!backupID) {
            await interaction.editReply({ content: data.backup_unvalid_id_on_load });
            return;
        };

        if (backupID && !await db.DataBaseModel({ id: db.Get, key: `BACKUPS.${interaction.user.id}.${backupID}` })) {
            await interaction.editReply({ content: data.backup_this_is_not_your_backup });
            return;
        };

        await interaction.channel.send({ content: data.backup_waiting_on_load });

        backup.fetch(backupID).then(async () => {
            backup.load(backupID, interaction.guild).then(() => {
                backup.remove(backupID);
            }).catch((err) => {
                interaction.channel.send({
                    content: data.backup_error_on_load
                        .replace("${backupID}", backupID)
                    , ephemeral: true
                });
                return;
            });
        }).catch((err) => {
            interaction.channel.send({ content: `❌` });
            return;
        });
    },
};