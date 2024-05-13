const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionFlagsBits } = require("@discordjs/builders");
const Levels = require("discord.js-leveling");

module.exports = {
  data: [
    new SlashCommandBuilder()
      .setName("xp")
      .setDescription("Gibt XP Informationen zurück.")
      .setDefaultPermission(false),
    new SlashCommandBuilder()
      .setName("xp")
      .setDescription("Adjust a user´s xp.")
      .setDefaultMemberPermissions(PermissionFlagsBits.ADMINISTRATOR)
      .addSubcommand((subcommand) =>
        subcommand
          .setName("add")
          .setDescription("Add xp to a user.")
          .addUserOption((option) =>
            option
              .setName("target")
              .setDescription("The user to add xp to.")
              .setRequired(true)
          )
          .addIntegerOption((option) =>
            option
              .setName("amount")
              .setDescription("The amount of xp to add.")
              .setRequired(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("remove")
          .setDescription("Remove xp from a user.")
          .addUserOption((option) =>
            option
              .setName("target")
              .setDescription("The user to remove xp from.")
              .setRequired(true)
          )
          .addIntegerOption((option) =>
            option
              .setName("amount")
              .setDescription("The amount of xp to remove.")
              .setRequired(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("set")
          .setDescription("Set a user´s xp.")
          .addUserOption((option) =>
            option
              .setName("target")
              .setDescription("The user to set xp for.")
              .setRequired(true)
          )
          .addIntegerOption((option) =>
            option
              .setName("amount")
              .setDescription("The amount of xp to set.")
              .setMinValue(0) // This should be applied here
              .setRequired(true)
          )
      ),
  ],

  async execute(interaction) {
    const { options, guildId } = interaction;

    const sub = options.getSubcommand();
    const target = options.getUser("target");
    const amount = options.getInteger("amount");
    const embed = new EmbedBuilder();

    try {
      switch (sub) {
        case "add":
          await Levels.appendXp(guildId, target.id, amount);
          embed
            .setDescription(`Added ${amount} xp to ${target.tag}`)
            .setColor("GREEN")
            .setTimestamp();
          break;
        case "remove":
          await Levels.subtractXp(guildId, target.id, amount);
          embed
            .setDescription(`Removed ${amount} xp from ${target.tag}`)
            .setColor("GREEN")
            .setTimestamp();
          break;
        case "set":
          await Levels.setXp(guildId, target.id, amount);
          embed
            .setDescription(`Set ${target.tag}'s xp to ${amount}`)
            .setColor("GREEN")
            .setTimestamp();
          break;
      }
    } catch (err) {
      console.log(err);
    }

    interaction.reply({ embed, ephemeral: true });
  },
};
