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

const { QuickDB } = require("quick.db");
const db = new QuickDB();
const ms = require('ms');
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

const getLanguageData = require(`${process.cwd()}/src/lang/getLanguageData`);

slashInfo.economy.daily.run = async (client, interaction) => {
  let data = await getLanguageData(interaction.guild.id);

  let timeout = 86400000;
  let amount = 500;
  let daily = await db.get(`${interaction.guild.id}.USER.${interaction.user.id}.ECONOMY.daily`);
  if (daily !== null && timeout - (Date.now() - daily) > 0) {
    let time = ms(timeout - (Date.now() - daily));

    return await interaction.reply({ content: data.daily_cooldown_error.replace(/\${time}/g, time) });
  } else {
    let embed = new EmbedBuilder()
      .setAuthor({ name: data.daily_embed_title, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png` })
      .setColor("#a4cb80")
      .setDescription(data.daily_embed_description)
      .addFields({ name: data.daily_embed_fields, value: `${amount}🪙` })

    await interaction.reply({ embeds: [embed] });
    await db.add(`${interaction.guild.id}.USER.${interaction.user.id}.ECONOMY.money`, amount);
    await db.set(`${interaction.guild.id}.USER.${interaction.user.id}.ECONOMY.daily`, Date.now());
  }
};

module.exports = slashInfo.economy.daily;