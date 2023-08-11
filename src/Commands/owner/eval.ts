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
    Collection,
    ChannelType,
    EmbedBuilder,
    Permissions,
    ApplicationCommandType,
    PermissionsBitField,
    ApplicationCommandOptionType
} from 'discord.js'

import { Command } from '../../../types/command';
import * as db from '../../core/functions/DatabaseModel';
import logger from '../../core/logger';
import config from '../../files/config';

export const command: Command = {
    name: 'eval',
    description: 'Run Javascript program (only for developers)!',
    options: [
        {
            name: 'code',
            type: ApplicationCommandOptionType.String,
            description: 'javascript code',
            required: true
        }
    ],
    category: 'owner',
    run: async (client: Client, interaction: any) => {

        if ((interaction.user.id !== config.owner.ownerid1) && (interaction.user.id !== config.owner.ownerid2)) {
            await interaction.editReply({ content: "❌", ephemeral: true });
            return;
        };

        var result = interaction.options.getString("code");

        try {
            eval(result);

            let embed = new EmbedBuilder()
                .setColor("#468468")
                .setTitle("This block was evalued with iHorizon.")
                .setDescription(`\`\`\`JS\n${result || "None"}\n\`\`\``)
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });

            await interaction.editReply({ embeds: [embed], ephemeral: true });
            return;
        } catch (err: any) {
            await interaction.editReply({ content: err.toString(), ephemeral: true });
            return;
        };
    }
};