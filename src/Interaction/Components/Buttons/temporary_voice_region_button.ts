/*
・ iHorizon Discord Bot (https://github.com/ihrz/ihrz)

・ Licensed under the Attribution-NonCommercial-ShareAlike 2.0 Generic (CC BY-NC-SA 2.0)

    ・   Under the following terms:

        ・ Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

        ・ NonCommercial — You may not use the material for commercial purposes.

        ・ ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

        ・ No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.


・ Mainly developed by Kisakay (https://github.com/Kisakay)

・ Copyright © 2020-2024 iHorizon
*/

import { ActionRowBuilder, ButtonInteraction, CacheType, ComponentType, EmbedBuilder, Guild, GuildMember, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { LanguageData } from '../../../../types/languageData';

export default async function (interaction: ButtonInteraction<CacheType>) {

    let result = await interaction.client.db.get(`${interaction.guildId}.VOICE_INTERFACE.interface`);
    let table = interaction.client.db.table('TEMP');

    let lang = await interaction.client.functions.getLanguageData(interaction.guildId) as LanguageData;
    let member = interaction.member as GuildMember;

    let targetedChannel = (interaction.member as GuildMember).voice.channel;
    let getChannelOwner = await table.get(`CUSTOM_VOICE.${interaction.guild?.id}.${interaction.user?.id}`);

    if (result.channelId !== interaction.channelId
        || getChannelOwner !== targetedChannel?.id) return interaction.deferUpdate();

    if (!member.voice.channel) {
        await interaction.deferUpdate()
        return;
    } else {

        let comp = new StringSelectMenuBuilder()
            .setCustomId('starter')
            .setPlaceholder('Select a Region')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Singapore')
                    .setValue('singapore'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Australia/Sydney')
                    .setValue('sydney'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Russia')
                    .setValue('russia'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('India')
                    .setValue('india'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Hong Kong')
                    .setValue('hongkong'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('South Africa')
                    .setValue('southafrica'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Netherland/Rotterdam')
                    .setValue('rotterdam'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Japan/Tokyo')
                    .setValue('japan'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('South Korea')
                    .setValue('south-korea'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('US/East')
                    .setValue('us-east'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('US/South')
                    .setValue('us-south'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('US/West')
                    .setValue('us-west'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('US/Central')
                    .setValue('us-central'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Brazil')
                    .setValue('brazil'),
            );

        let response = await interaction.reply({
            ephemeral: true,
            components: [
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(comp)
            ]
        });

        let collector = interaction.channel?.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            filter: (u) => u.user.id === interaction.user.id,
            time: 200_000
        });

        collector?.on('collect', async i => {
            let channel = (i.member as GuildMember).voice.channel;
            let value = i.values[0];

            await channel?.setRTCRegion(value);

            await i.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`## Modifications about your temporary voice channel`)
                        .setColor(2829617)
                        .setFields(
                            {
                                name: "New region",
                                value: `${i.client.iHorizon_Emojis.vc.Region} **${value}**`,
                                inline: true
                            },
                        )
                        .setImage(`https://ihorizon.me/assets/img/banner/ihrz_${await i.client.db.get(`${interaction.guildId}.GUILD.LANG.lang`) || 'en-US'}.png`)
                        .setFooter(
                            {
                                text: "iHorizon",
                                iconURL: 'attachment://icon.png'
                            }
                        )
                ],
                files: [
                    {
                        attachment: await interaction.client.functions.image64(interaction.client.user?.displayAvatarURL()),
                        name: 'icon.png'
                    }
                ],
                ephemeral: true
            });

            collector?.stop();
        });

        collector?.on('end', i => {
            response.delete();
        })

    }
};