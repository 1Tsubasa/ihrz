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

import { Client, EmbedBuilder, CommandInteraction, ApplicationCommandType, User, time, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { AnotherCommand } from '../../../types/anotherCommand';
import { axios } from '../../core/functions/axios.js';

export const command: AnotherCommand = {
    name: 'User Lookup',
    type: ApplicationCommandType.User,
    thinking: false,
    run: async (client: Client, interaction: CommandInteraction) => {

        let badges: {
            [key: string]: {
                Value: number;
                Emoji: string;
            }
        } = {
            Discord_Employee: {
                Value: 1,
                Emoji: client.iHorizon_Emojis.badge.Discord_Employee,
            },
            Partnered_Server_Owner: {
                Value: 2,
                Emoji: client.iHorizon_Emojis.badge.Partnered_Server_Owner,
            },
            HypeSquad_Events: {
                Value: 4,
                Emoji: client.iHorizon_Emojis.badge.HypeSquad_Events,
            },
            Bug_Hunter_Level_1: {
                Value: 8,
                Emoji: client.iHorizon_Emojis.badge.Bug_Hunter_Level_1,
            },
            Early_Supporter: {
                Value: 512,
                Emoji: client.iHorizon_Emojis.badge.Early_Supporter,
            },
            Bug_Hunter_Level_2: {
                Value: 16384,
                Emoji: client.iHorizon_Emojis.badge.Bug_Hunter_Level_2,
            },
            Early_Verified_Bot_Developer: {
                Value: 131072,
                Emoji: client.iHorizon_Emojis.badge.Early_Verified_Bot_Developer,
            },
            House_Bravery: {
                Value: 64,
                Emoji: client.iHorizon_Emojis.badge.House_Bravery,
            },
            House_Brilliance: {
                Value: 128,
                Emoji: client.iHorizon_Emojis.badge.House_Brilliance,
            },
            House_Balance: {
                Value: 256,
                Emoji: client.iHorizon_Emojis.badge.House_Balance,
            },
            Active_Developers: {
                Value: 4194304,
                Emoji: client.iHorizon_Emojis.badge.Active_Developers,
            },
            Discord_Moderators: {
                Value: 262144,
                Emoji: client.iHorizon_Emojis.badge.Discord_Moderators,
            },
            Slash_Bot: {
                Value: 524288,
                Emoji: client.iHorizon_Emojis.badge.Slash_Bot,
            },
        };

        function getBadges(flags: number): string {
            let badgeValues = Object.values(badges);
            return badgeValues
                .filter(badge => (flags & badge.Value) === badge.Value)
                .map(badge => badge.Emoji)
                .join('');
        };

        let data = await client.functions.getLanguageData(interaction.guild?.id);
        let member = interaction.options.getUser('user') || interaction.user;

        async function sendMessage(user: User) {

            let format = 'png';

            let user_1 = (await axios.get(`https://discord.com/api/v10/users/${user?.id}`, {
                headers: {
                    Authorization: `Bot ${client.token}`
                }
            })).data;

            let banner = user_1.banner;

            if (banner !== null && banner?.substring(0, 2) === 'a_') {
                format = 'gif'
            };

            let embed = new EmbedBuilder()
                .setFooter({ text: `iHorizon`, iconURL: "attachment://ihrz_logo.png" })
                .setThumbnail("attachment://user_icon.gif")
                .setTimestamp()
                .setColor('#0014a8')
                .setFields(
                    {
                        name: "Badge",
                        value: getBadges(member.flags as unknown as number) || "`Not found`",
                        inline: true,
                    },
                    {
                        name: "Username",
                        value: user.username,
                        inline: true,
                    },
                    {
                        name: "DisplayName",
                        value: user.displayName || "`Not found`",
                        inline: true,
                    },
                    {
                        name: "Creation Date",
                        value: time(user.createdAt, "D") || "`Not found`",
                        inline: true,
                    },
                    {
                        name: "Nitro Status",
                        value: GetNitro(user_1.premium_type) || "`Not found`",
                        inline: true,
                    }
                )
                .setImage("attachment://user_banner.gif");

            var files: { name: string; attachment: string }[] = [
                {
                    attachment: await interaction.client.functions.image64(interaction.client.user?.displayAvatarURL({ forceStatic: false })),
                    name: 'ihrz_logo.png'
                },
                {
                    attachment: user.displayAvatarURL({ size: 512, forceStatic: false }),
                    name: 'user_icon.gif'
                }
            ];

            if (banner) files.push({
                attachment: await interaction.client.functions.image64(`https://cdn.discordapp.com/banners/${user_1?.id}/${banner}.${format}?size=1024`),
                name: 'user_banner.gif'
            });

            await interaction.editReply({
                content: `${client.iHorizon_Emojis.icon.Yes_Logo} Fetched !`,
                embeds: [embed],
                files: files,
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setURL(`https://discordapp.com/users/${user.id}`)
                                .setLabel("User Profil")
                        )
                ]
            });

            return;
        };

        await interaction.reply({
            content: data.userinfo_wait_please.replace("${client.iHorizon_Emojis.icon.Timer}", client.iHorizon_Emojis.icon.Timer)
        });

        function GetNitro(input: number): string {
            let nitro = '';

            switch (input) {
                case 1:
                    nitro = client.iHorizon_Emojis.badge.Nitro;
                    break;
                case 2:
                    nitro = client.iHorizon_Emojis.badge.Nitro + client.iHorizon_Emojis.badge.Server_Boost_Badge;
                    break;
                case 3:
                    nitro = client.iHorizon_Emojis.badge.Nitro;
                    break;
            };

            return nitro;
        };

        sendMessage(member);
    },
};