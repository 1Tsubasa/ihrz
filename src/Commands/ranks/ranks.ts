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
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    ApplicationCommandType,
} from 'discord.js';

import { Command } from '../../../types/command';

export const command: Command = {
    name: "ranks",
    description: "Subcommand for ranks category!",
    options: [
        {
            name: "disable",
            description: "Disable the message when user earn new xp level message!",
            type: 1,
            options: [
                {
                    name: 'action',
                    type: ApplicationCommandOptionType.String,
                    description: 'What you want to do?',
                    required: true,
                    choices: [
                        {
                            name: 'Power On the module (send message when user earn xp level)',
                            value: "on"
                        },
                        {
                            name: "Power Off the module (don't send any message but user still earn xp level)",
                            value: "off"
                        },
                        {
                            name: "Disable the module (don't send any message and user don't earn xp level)",
                            value: "disable"
                        },
                    ],
                },
            ],
        },
        {
            name: "show",
            description: "Get the user's xp level!",
            type: 1,
            options: [
                {
                    name: 'user',
                    type: ApplicationCommandOptionType.User,
                    description: 'The user you want to lookup, keep blank if you want to show your stats',
                    required: false
                }
            ],
        },
        {
            name: "set-channel",
            description: "Set the channel where user earn new xp level message!",
            type: 1,
            options: [
                {
                    name: 'action',
                    type: ApplicationCommandOptionType.String,
                    description: 'What you want to do?',
                    required: true,
                    choices: [
                        {
                            name: "Remove the module (send xp message on the user's message channel)",
                            value: "off"
                        },
                        {
                            name: 'Power on the module (send xp message on a specific channel)',
                            value: "on"
                        }
                    ],
                },
                {
                    name: 'channel',
                    type: ApplicationCommandOptionType.Channel,
                    description: 'The specific channel for xp message !',
                    required: false
                }
            ],
        },
        {
            name: "leaderboard",
            description: "Get the xp's leaderboard of the guild!",
            type: 1,
        },
    ],
    thinking: false,
    category: 'ranks',
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        let data = await client.functions.getLanguageData(interaction.guild?.id);
        let command = interaction.options.getSubcommand();

        await require('./!' + command).run(client, interaction, data);
    },
};