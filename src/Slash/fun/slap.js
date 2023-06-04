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

const slashInfo = require(`${process.cwd()}/files/ihorizon-api/slashHandler`);

const {
    Client,
    Intents,
    Collection,
    EmbedBuilder,
    Permissions,
    ApplicationCommandType,
    PermissionsBitField,
    ApplicationCommandOptionType
} = require('discord.js');

slashInfo.fun.slap.run = async (client, interaction) => {
    const getLanguageData = require(`${process.cwd()}/src/lang/getLanguageData`);
    let data = await getLanguageData(interaction.guild.id);

    var slapGif = [
        'https://cdn.discordapp.com/attachments/717813924203855882/717982041899139152/slap1.gif',
        'https://cdn.discordapp.com/attachments/717813924203855882/717982255661711381/slap2.gif',
        'https://cdn.discordapp.com/attachments/717813924203855882/717982464299106314/slap3.gif'

    ];
    const slap = interaction.options.getUser("user");

    const embed = new EmbedBuilder()
        .setColor("#42ff08")
        .setDescription(data.slap_embed_description
            .replace(/\${slap\.id}/g, slap.id)
            .replace(/\${interaction\.user\.id}/g, interaction.user.id)
        )
        .setImage(slapGif[Math.floor(Math.random() * slapGif.length)])
        .setTimestamp()
    return interaction.reply({ embeds: [embed] });
};

module.exports = slashInfo.fun.slap;