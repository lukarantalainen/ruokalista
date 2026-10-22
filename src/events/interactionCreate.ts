import { Events, MessageFlags, type Interaction } from "discord.js";
import { getButtonId } from "../utils.js";

export const name = Events.InteractionCreate;

export async function execute(interaction: Interaction) {
  console.log(
    "Interaction received:",
    interaction.id,
    interaction.type,
    interaction.isChatInputCommand()
      ? interaction.commandName
      : interaction.isButton()
        ? interaction.customId
        : "other"
  );

  if (interaction.isButton()) {
    const buttonId = getButtonId(interaction.customId);
    const button = interaction.client.buttons.get(buttonId);
    if (!button) {
      console.error(`No button matching ${buttonId} was found.`);
      return;
    }
    try {
      await button.execute(interaction);
    } catch (error) {
      console.error(error);
    }
    return;
  }

  if (interaction.isChatInputCommand()) {
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
}
