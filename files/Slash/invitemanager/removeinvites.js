const {
    Client,
    Intents,
    Collection,
    ChannelType,
    EmbedBuilder,
    Permissions,
    ApplicationCommandType,
    PermissionsBitField,
    ApplicationCommandOptionType
} = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

const yaml = require('js-yaml'), fs = require('fs');
const getLanguage = require(`${process.cwd()}/files/lang/getLanguage`);

module.exports = {
    name: 'removeinvites',
    description: 'Remove invites from user with this command',
    options: [
        {
            name: 'member',
            type: ApplicationCommandOptionType.User,
            description: 'the member you want to remove invites',
            required: true
        },
        {
            name: 'amount',
            type: ApplicationCommandOptionType.Number,
            description: 'Number of invites you want to substract',
            required: true
        }
    ],
    run: async (client, interaction) => {
        let fileContents = fs.readFileSync(`${process.cwd()}/files/lang/${await getLanguage(interaction.guild.id)}.yml`, 'utf-8');
        let data = yaml.load(fileContents);

        const user = interaction.options.getMember("member")
        const amount = interaction.options.getNumber("amount")

        let a = new EmbedBuilder().setColor("#FF0000").setDescription(data.removeinvites_not_admin_embed_description);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ embeds: [a] })
        }

        await db.sub(`${interaction.guild.id}.USER.${user.id}.INVITES.DATA.invites`, amount);

        const finalEmbed = new EmbedBuilder()
            .setDescription(data.removeinvites_confirmation_embed_description
                .replace(/\${amount}/g, amount)
                .replace(/\${user}/g, user)
                )
            .setColor(`#92A8D1`)
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) });
        await db.sub(`${interaction.guild.id}.USER.${user.id}.INVITES.DATA.bonus`, amount);
        interaction.reply({ embeds: [finalEmbed] });

        try {
            logEmbed = new EmbedBuilder()
              .setColor("#bf0bb9")
              .setTitle(data.removeinvites_logs_embed_title)
              .setDescription(data.removeinvites_logs_embed_description
                .replace(/\${interaction\.user\.id}/g, interaction.user.id)
                .replace(/\${amount}/g, amount)
                .replace(/\${user\.id}/g, user.id)
                )
      
            let logchannel = interaction.guild.channels.cache.find(channel => channel.name === 'ihorizon-logs');
            if (logchannel) { logchannel.send({ embeds: [logEmbed] }) }
          } catch (e) { return };
    }
}