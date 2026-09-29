import { Events, MessageFlags, type Interaction } from "discord.js";
import { confirmCallback, cancelCallback } from "../commands/utility/button.js";
import { nextCallback, previousCallback, showDayCallback, showWeekCallback } from "../commands/utility/lyseo.js";

export const name = Events.InteractionCreate;

export async function execute(interaction: Interaction) {
  if (interaction.isButton()) {
    if (interaction.customId == "confirm") {
      await confirmCallback(interaction);
    } else if (interaction.customId == "cancel") {
      await cancelCallback(interaction);
    } else if (interaction.customId == "show-week") {
      await showWeekCallback(interaction);
    } else if (interaction.customId == "show-day") {
      await showDayCallback(interaction);
    } else if (interaction.customId == "previous") {
      await previousCallback(interaction);
    } else if (interaction.customId == "next") {
      await nextCallback(interaction);
    }
    return;
  }

  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}
