const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Levels = require("discord.js-leveling");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("howmuchxp")
    .setDescription("See how much xp a level takes to reach.")
    .addIntegerOption(option =>
      option.setName("level")
        .setDescription("Desired level")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options } = interaction;

    const level = options.getInteger("level");
    const xpAmount = Levels.xpFor(level);

    const embed = new EmbedBuilder()
      .setTitle("XP Required for Level")
      .setDescription(`Level ${level} requires ${xpAmount} xp to reach.`)
      .setColor("#0099ff");

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
