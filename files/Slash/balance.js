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

const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: 'balance',
    description: 'show how much dollars you have in your bank',
    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'Target a user for see their current balance bank or keep blank for yourself',
            required: false
        }
    ],
    run: async (client, interaction) => {
        const member = interaction.options.get('user')
        if (!member) {
            var bal = await db.get(`${interaction.guild.id}.USER.${interaction.user.id}.ECONOMY.money`)
            if (!bal) { return await db.set(`${interaction.guild.id}.USER.${interaction.user.id}.ECONOMY.money`, 1), interaction.reply({ content: `👛 You dont't have wallet... !` }) }
            interaction.reply({ content: `👛 You have ${bal} coin(s) !` })
        } else {
            if (member) {
                var bal = await db.get(`${interaction.guild.id}.USER.${member.value}.ECONOMY.money`)
                if (!bal) { return db.set(`${interaction.guild.id}.USER.${member.value}.ECONOMY.money`, 1), interaction.reply({ content: `👛 he dont't have wallet... !` }) }
                interaction.reply({ content: `👛 He have ${bal} coin(s) !` })
            }
        }


        const filter = (interaction) => interaction.user.id === interaction.member.id;
    }
}