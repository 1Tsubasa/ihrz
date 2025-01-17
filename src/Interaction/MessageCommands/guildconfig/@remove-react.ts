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

import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    BaseGuildTextChannel,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    GuildMember,
    GuildVoiceChannelResolvable,
    Message,
    PermissionsBitField,
} from 'discord.js';

import { isDiscordEmoji, isSingleEmoji } from '../../../core/functions/emojiChecker.js';
import { LanguageData } from '../../../../types/languageData';
import { Command } from '../../../../types/command';

export const command: Command = {

    name: 'remove-react',

    description: 'Remove reaction by iHorizon when user send message',
    description_localizations: {
        "fr": "Supprimer une réaction d'iHorizon lorsque l'utilisateur envoie un message spécifiqe"
    },

    thinking: false,
    category: 'guildconfig',
    type: "PREFIX_IHORIZON_COMMAND",
    run: async (client: Client, interaction: Message, args: string[]) => {
        let data = await client.functions.getLanguageData(interaction.guild?.id as string) as LanguageData;

        let permission = interaction.member?.permissions?.has(PermissionsBitField.Flags.AddReactions);

        let message = args[0];

        if (!permission) {
            return;
        }

        await interaction.reply({ content: `<@${interaction.member?.id}>, maintenant quand un membre envoie \`${message.toLowerCase()}\`, le bot **ne réagis plus**.` });

        await client.db.delete(`${interaction.guildId}.GUILD.REACT_MSG.${message.toLowerCase()}`);
        return;
    },
};