const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("@discordjs/builders");

const Levels = require("discord.js-leveling");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Adjust a user´s levels.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ADMINISTRATOR)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add levels to a user.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Select a user")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount of levels.")
            .setMinValue(0)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove levels from a user.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Select a user.")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount of levels")
            .setMinValue(0)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set a user´s levels.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to set xp for.")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount of levels")
            .setMinValue(0)
            .setRequired(true)
        )
    ),

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
            .setDescription(`Added ${amount} level(s) to ${target}`)
            .setColor("GREEN")
            .setTimestamp();
          break;
        case "remove":
          await Levels.subtractXp(guildId, target.id, amount);
          embed
            .setDescription(`Removed ${amount} level(s) from ${target}`)
            .setColor("GREEN")
            .setTimestamp();
          break;
        case "set":
          await Levels.setXp(guildId, target.id, amount);
          embed
            .setDescription(`Set ${target}´s level(s) to ${amount}`)
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
