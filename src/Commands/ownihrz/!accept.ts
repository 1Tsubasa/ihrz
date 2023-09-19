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
} from 'discord.js';

import * as apiUrlParser from '../../core/functions/apiUrlParser';
import * as db from '../../core/functions/DatabaseModel';
import config from '../../files/config';

import CryptoJS, { enc } from 'crypto-js';
import axios from 'axios';
import logger from '../../core/logger';

export = {
    run: async (client: Client, interaction: any, data: any) => {

        let id_1 = interaction.options.getString('id');

        let id_2 = await db.DataBaseModel({
            id: db.Get,
            key: `OWNIHRZ.TEMP`,
        });

        for (let i in id_2) {
            for (let j in id_2[i]) {
                if (id_1 === j) {
                    id_2 = id_2?.[i]?.[j];
                }
            }
        };

        if ((interaction.user.id !== config.owner.ownerid1) && (interaction.user.id !== config.owner.ownerid2)) {
            await interaction.deleteReply();
            await interaction.followUp({ content: "❌", ephemeral: true });
            return;
        };

        if (!id_2) {
            await interaction.editReply({ content: 'Le bot dans la DB est introuvable. Nous ne pouvons pas procéder à la suite.' });
            return;
        };

        id_2.admin_key = config.api.apiToken;
        id_2.code = id_1;

        let config_2 = {
            headers: {
                Authorization: `Bot ${id_2.auth}`
            }
        };

        let bot_1 = (await axios.get(`https://discord.com/api/v10/applications/@me`, config_2)
            .catch((e: any) => { }))?.data || 404;

        if (bot_1 === 404) {
            await interaction.editReply({ content: 'Le token dans la DB est invalide. Nous ne pouvons pas procéder à la suite.' });
            return;
        } else {

            let utils_msg = `__Identifiant du bot__ \`${bot_1.bot.id}\`
            __Username du bot__ \`${bot_1.bot.username}\`
            __Bot Public__ \`${bot_1.bot_public ? 'Oui' : 'Non'}\``

            let embed = new EmbedBuilder()
                .setColor('#ff7f50')
                .setTitle(`Host your own iHorizon : ${bot_1.bot.username}#${bot_1.bot.discriminator}`)
                .setDescription(`Le bot as bien été accepté\n\n${utils_msg}`)
                .setFooter({ text: 'iHorizon', iconURL: client.user?.displayAvatarURL() });

            // await interaction.deleteReply();
            await interaction.editReply({ embeds: [embed], ephemeral: false });

            try {
                let encrypted = CryptoJS.AES.encrypt(JSON.stringify(id_2), config.api.apiToken).toString();

                axios.post(apiUrlParser.PublishURL, { cryptedJSON: encrypted }, { headers: { 'Accept': 'application/json' } })
                    .then((response: any) => { })
                    .catch(error => {
                        logger.err(error)
                    });
            } catch (error: any) {
                logger.err(error)
            };

            await db.DataBaseModel({
                id: db.Delete,
                key: `OWNIHRZ.TEMP.${interaction.user.id}`,
            });
        };
    },
};