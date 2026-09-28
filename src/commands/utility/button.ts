import { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle,  } from "discord.js";
import type { Interaction } from "discord.js";

export const data = new SlashCommandBuilder().setName('button').setDescription('Priimuksen ruokalista tälle päivälle.');

export async function execute(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;


  const target = interaction.options.getUser('target');
  const reason = interaction.options.getString('reason') ?? 'No reason provided';
  const confirm = new ButtonBuilder().setCustomId('confirm').setLabel('Confirm Ban').setStyle(ButtonStyle.Danger);
  const cancel = new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Secondary);
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(cancel, confirm);
  await interaction.reply({
    content: `Are you sure you want to ban ${target} for reason: ${reason}?`,
    components: [row]
  });

}
