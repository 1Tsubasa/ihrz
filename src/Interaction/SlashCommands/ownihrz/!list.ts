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
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
} from 'discord.js';

import { LanguageData } from '../../../../types/languageData';
import date from 'date-and-time';
import axios from 'axios';

async function buildEmbed(client: Client, data: any, botId: number, lang: LanguageData) {

    let config = {
        headers: {
            Authorization: `Bot ${data.auth}`
        }
    };

    let bot_1 = (await axios.get(`https://discord.com/api/v10/applications/@me`, config).catch(() => { }))?.data || 404;

    let utils_msg = lang.mybot_list_utils_msg
        .replace('${data_2[i].bot.id}', data.bot.id)
        .replace('${data_2[i].bot.username}', data.bot.username)
        .replace("${data_2[i].bot_public ? 'Yes' : 'No'}", data.bot_public ? lang.mybot_list_utils_msg_yes : lang.mybot_list_utils_msg_no);

    let expire = date.format(new Date(data.expireIn), 'ddd, MMM DD YYYY');

    return new EmbedBuilder()
        .setColor('#ff7f50')
        .setThumbnail(`https://cdn.discordapp.com/avatars/${data.bot.id}/${bot_1?.bot.avatar}.png`)
        .setTitle(lang.mybot_list_embed1_title.replace('${data_2[i].bot.username}', data.bot.username))
        .setDescription(
            lang.mybot_list_embed1_desc
                .replace("${client.iHorizon_Emojis.icon.Warning_Icon}", client.iHorizon_Emojis.icon.Warning_Icon)
                .replace('${data_2[i].code}', data.code)
                .replace('${expire}', expire)
                .replace('${utils_msg}', utils_msg)
        )
        .setFooter({ text: 'iHorizon', iconURL: client.user?.displayAvatarURL() })
        .setTimestamp();
}

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction, data: LanguageData) => {
        let data_2 = await client.db.get(`OWNIHRZ.${interaction.user.id}`);
        let table_1 = client.db.table("OWNIHRZ");

        let lsEmbed: EmbedBuilder[] = [
            new EmbedBuilder()
                .setTitle(data.mybot_list_embed0_title)
                .setColor('#000000')
                .setFooter({ text: 'iHorizon', iconURL: client.user?.displayAvatarURL() })
                .setTimestamp()
        ];

        for (let botId in data_2) {
            if (data_2[botId]) {
                let embed = await buildEmbed(client, data_2, botId as unknown as number, data);
                lsEmbed.push(embed);
            }
        }

        let allData = await table_1.all();

        for (let index of allData) {
            for (let ownerId in index.value) {
                for (let botId in index.value[ownerId]) {
                    let embed = await buildEmbed(client, index.value[ownerId][botId], botId as unknown as number, data);
                    lsEmbed.push(embed);
                }
            }
        }

        await interaction.reply({ embeds: lsEmbed, ephemeral: true });
        return;
    },
};
