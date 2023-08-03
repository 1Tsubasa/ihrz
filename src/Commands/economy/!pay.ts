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
        let user = interaction.options.getMember("member");
        let amount = interaction.options.getNumber("amount");

        let member = await db.DataBaseModel({ id: db.Get, key: `${interaction.guild.id}.USER.${user.id}.ECONOMY.money` });
        if (amount.toString().includes('-')) {
            return interaction.reply({ content: data.pay_negative_number_error });
        }
        if (member < amount.value) {
            return interaction.reply({ content: data.pay_dont_have_enought_to_give })
        }

        await interaction.reply({
            content: data.pay_command_work
                .replace(/\${interaction\.user\.username}/g, interaction.user.username)
                .replace(/\${user\.user\.username}/g, user.user.username)
                .replace(/\${amount}/g, amount)
        })
        await db.DataBaseModel({ id: db.Add, key: `${interaction.guild.id}.USER.${user.id}.ECONOMY.money`, value: amount });
        await db.DataBaseModel({ id: db.Sub, key: `${interaction.guild.id}.USER.${interaction.member.id}.ECONOMY.money`, value: amount });
    },
}