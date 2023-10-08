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

/*
・ ElektraBots Discord Bot (https://github.com/belugafr/ElektraBots)

・ Mainly developed by NayaWeb (https://github.com/belugafr)

・ Copyright © 2021-2023 ElektraBots
*/

import {
    AttachmentBuilder,
    Client,
    EmbedBuilder,
    User,
} from 'discord.js'

import axios from 'axios';

export = {
    run: async (client: Client, interaction: any) => {

        let args = interaction.options.getString('comment');
        args = args.split(' ');

        let user: User = interaction.options.getUser('user') || interaction.user;

        if (args.length < 1) {
            await interaction.editReply({ content: 'Please, send a good sentence!' });
            return;
        };

        let username = user.username;
        let displayname = user?.globalName;

        if (username.length > 15) {
            username = username.substring(0, 15);
        };

        if (displayname && displayname.length > 15) {
            displayname = displayname.substring(0, 15);
        };

        let link = `https://some-random-api.com/canvas/misc/tweet?avatar=${encodeURIComponent((user.displayAvatarURL({ extension: 'png' }) as string))}&username=${encodeURIComponent((username as string))}&comment=${encodeURIComponent(args.join(' '))}&displayname=${encodeURIComponent((displayname as string))}`;

        let embed = new EmbedBuilder()
            .setColor('#000000')
            .setImage('attachment://tweet-elektra.png')
            .setTimestamp()
            .setFooter({ text: 'iHorizon x ElektraBots', iconURL: client.user?.displayAvatarURL() });

        let imgs;

        await axios.get(link, { responseType: 'arraybuffer' }).then((response: any) => {
            imgs = new AttachmentBuilder(Buffer.from(response.data, 'base64'), { name: 'tweet-elektra.png' });
            embed.setImage(`attachment://tweet-elektra.png`);
        });

        await interaction.editReply({ embeds: [embed], files: [imgs] });
        return;
    },
};