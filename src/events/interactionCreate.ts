import { Events, MessageFlags, type Interaction } from "discord.js";

export const name = Events.InteractionCreate;

export async function execute(interaction: Interaction) {
  if (interaction.isButton()) {
    const button = interaction.client.buttons.get(interaction.customId);
    if (!button) {
      console.error(`No button matching ${interaction.customId} was found.`);
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
