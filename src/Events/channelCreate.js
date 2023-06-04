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

const { Client, Intents, Collection, EmbedBuilder, Permissions } = require('discord.js');
const getLanguageData = require(`${process.cwd()}/src/lang/getLanguageData`);

module.exports = async (client, channel) => {
    if (channel.name !== "ihorizon-logs") return;
    let data = await getLanguageData(channel.guild.id);
    
    let setup_embed = new EmbedBuilder()
        .setColor("#1e1d22")
        .setTitle(data.event_channel_create_message_embed_title)
        .setDescription(data.event_channel_create_message_embed_description);
    channel.send({ embeds: [setup_embed] });
    
};