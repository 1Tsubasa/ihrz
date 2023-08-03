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
    EmbedBuilder,
    Permissions,
    ApplicationCommandType,
    PermissionsBitField,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    SelectMenuBuilder,
    ComponentType,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuOptionBuilder,
} from 'discord.js';

import { Command } from '../../../../types/command';
import * as db from '../../../core/functions/DatabaseModel';
import logger from '../../../core/logger';
import config from '../../../files/config';

import ms from 'ms'; 

export = {
    run: async (client: Client, interaction: any, data: any) => {
        let talkedRecentlyforr = new Set();

        if (talkedRecentlyforr.has(interaction.user.id)) {
            return interaction.reply({ content: data.rob_cooldown_error });
        }

        let user = interaction.options.getMember("member");
        let targetuser = await db.DataBaseModel({ id: db.Get, key: `${interaction.guild.id}.USER.${user.id}.ECONOMY.money` });
        let author = await db.DataBaseModel({ id: db.Get, key: `${interaction.guild.id}.USER.${interaction.user.id}.ECONOMY.money` })
        if (author < 250) {
            return interaction.reply({ content: data.rob_dont_enought_error })
        }

        if (targetuser < 250) {
            return interaction.reply({
                content: data.rob_him_dont_enought_error
                    .replace(/\${user\.user\.username}/g, user.user.username)
            })
        }
        let random = Math.floor(Math.random() * 200) + 1;

        let embed = new EmbedBuilder()
            .setDescription(data.rob_embed_description
                .replace(/\${interaction\.user\.id}/g, interaction.user.id)
                .replace(/\${user\.id}/g, user.id)
                .replace(/\${random}/g, random)
            )
            .setColor("#a4cb80")
            .setTimestamp()

        await interaction.reply({ embeds: [embed] });

        await db.DataBaseModel({ id: db.Sub, key: `${interaction.guild.id}.USER.${user.user.id}.ECONOMY.money`, value: random });
        await db.DataBaseModel({ id: db.Add, key: `${interaction.guild.id}.USER.${interaction.user.id}.ECONOMY.money`, value: random });

        talkedRecentlyforr.add(interaction.user.id);
        setTimeout(() => {
            talkedRecentlyforr.delete(interaction.user.id);
        }, 3000000);
    },
}