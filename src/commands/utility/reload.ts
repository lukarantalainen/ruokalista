import { SlashCommandBuilder } from "discord.js";
import type { Interaction } from "discord.js";
import type { Command } from "../../types/command.js";

export const data = new SlashCommandBuilder().setName("reload").setDescription("Reloads a command").addStringOption((option) => option.setName('command').setDescription('The command to reload.').setRequired(true));
export async function execute(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  const commandName = interaction.options.getString("command", true);
  const command = interaction.client.commands.get(commandName);

  if (!command) {
    return interaction.reply(`No command matching ${interaction.commandName} was found.`);
  }

  try {
    const newCommand: Command = await import(`./${command.data.name}.ts?${Date.now()}`);
    interaction.client.commands.set(newCommand.data.name, newCommand);
    await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);

  } catch (error: any) {
    console.error(error);
    await interaction.reply(
      `There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``
    );
  }
}

