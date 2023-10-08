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
} from 'discord.js';

import { Command } from '../../../types/command';

export const command: Command = {
    name: "guildconfig",
    description: "Subcommand for guildconfig category!",
    options: [
        {
            name: 'setup',
            description: 'Setup the logs channel about the bot!',
            type: 1
        },
        {
            name: 'block',
            description: 'Block/Protect someting/behaviours into this guild!',
            type: 2,
            options: [
                {
                    name: 'bot',
                    description: 'Block the ability to add new bots into this server',
                    type: 1,
                    options: [
                        {
                            name: 'action',
                            type: ApplicationCommandOptionType.String,
                            description: 'What you want to do?',
                            required: true,
                            choices: [
                                {
                                    name: 'Power On',
                                    value: "on"
                                },
                                {
                                    name: "Power Off",
                                    value: "off"
                                }
                            ],
                        }
                    ],
                },
            ],
        },
        {
            name: 'show',
            description: 'Get the guild configuration!',
            type: 1,
        },
        {
            name: 'set',
            description: 'Set someting/behaviours into this guild!',
            type: 2,
            options: [
                {
                    name: 'channel',
                    description: 'Set the channel where the bot will send message when user leave/join guild!',
                    type: 1,
                    options: [
                        {
                            name: 'type',
                            type: ApplicationCommandOptionType.String,
                            description: '<On join/On leave/Delete all settings>',
                            required: true,
                            choices: [
                                {
                                    name: "On join",
                                    value: "join"
                                },
                                {
                                    name: "On leave",
                                    value: "leave"
                                },
                                {
                                    name: "Delete all settings",
                                    value: "off"
                                }
                            ]
                        },
                        {
                            name: 'channel',
                            type: ApplicationCommandOptionType.Channel,
                            description: "The channel you wan't your welcome/goodbye message !",
                            required: false
                        }
                    ],
                },
                {
                    name: 'join-dm',
                    description: 'Set a join dm message when user join the guild!',
                    type: 1,
                    options: [
                        {
                            name: "value",
                            description: "Choose the action you want to do",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            choices: [
                                {
                                    name: "Power on",
                                    value: "on"
                                },
                                {
                                    name: "Power off",
                                    value: "off"
                                },
                                {
                                    name: "Show the message set",
                                    value: "ls"
                                }
                            ]
                        },
                        {
                            name: 'message',
                            type: ApplicationCommandOptionType.String,
                            description: '<Message if the first args is on>',
                            required: false
                        }
                    ],
                },
                {
                    name: 'join-message',
                    description: 'Set a join message when user join the guild!',
                    type: 1,
                    options: [
                        {
                            name: "value",
                            description: "<Power on /Power off/Show the message set>",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            choices: [
                                {
                                    name: "Power on",
                                    value: "on"
                                },
                                {
                                    name: "Power off",
                                    value: "off"
                                },
                                {
                                    name: "Show the message set",
                                    value: "ls"
                                },
                                {
                                    name: "Need help",
                                    value: "needhelp"
                                }
                            ]
                        },
                        {
                            name: 'message',
                            type: ApplicationCommandOptionType.String,
                            description: `{user}:username| {membercount}:guild member count| {createdat}:user create date| {guild}:Guild name`,
                            required: false
                        },
                    ],
                },
                {
                    name: 'join-role',
                    description: 'Set a join roles when user join the guild!',
                    type: 1,
                    options: [
                        {
                            name: "value",
                            description: "<Power on /Power off/Show the message set>",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            choices: [
                                {
                                    name: "Power on",
                                    value: "true"
                                },
                                {
                                    name: "Power off",
                                    value: "false"
                                },
                                {
                                    name: "Show the roles set",
                                    value: "ls"
                                },
                                {
                                    name: "Need help",
                                    value: "needhelp"
                                }
                            ]
                        },
                        {
                            name: 'roles',
                            type: ApplicationCommandOptionType.Role,
                            description: '<roles id>',
                            required: false
                        }
                    ],
                },
                {
                    name: 'leave-message',
                    description: 'Set a leave message when user leave the guild!',
                    type: 1,
                    options: [
                        {
                            name: "value",
                            description: "<Power on /Power off/Show the message set>",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            choices: [
                                {
                                    name: "Power on",
                                    value: "on"
                                },
                                {
                                    name: "Power off",
                                    value: "off"
                                },
                                {
                                    name: "Show the message set",
                                    value: "ls"
                                },
                                {
                                    name: "Need help",
                                    value: "needhelp"
                                }
                            ]
                        },
                        {
                            name: 'message',
                            type: ApplicationCommandOptionType.String,
                            description: `{user} = Username of Member | {membercount} = guild's member count | {guild} = The name of the guild`,
                            required: false
                        },
                    ],
                },
            ],
        },
    ],
    category: 'guildconfig',
    run: async (client: Client, interaction: any) => {
        let data = await client.functions.getLanguageData(interaction.guild.id);
        let command: any = interaction.options.getSubcommand();

        await require('./!' + command).run(client, interaction, data);
    },
};