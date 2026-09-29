import { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
import type { ButtonInteraction, Interaction } from "discord.js";
import { getMenuWeekString } from "../../jamix/jamix.js";

export const data = new SlashCommandBuilder().setName('lyseo').setDescription('Lyseon ruokalista.');
export async function execute(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  const menu = await getMenuWeekString();
  const embed = await buildEmbed(menu);
  const buttons = await buildButtons();
  await interaction.reply({embeds: [embed], components: [buttons]});
}

async function buildEmbed(menu: string): Promise<EmbedBuilder> {
  const exampleEmbed = new EmbedBuilder()
  .setColor(0x16216a)
  .setTitle('Lyseo ruokalista')
  .setDescription(menu)

  return exampleEmbed;
}

async function buildButtons(): Promise<ActionRowBuilder<ButtonBuilder>> {
  const week = new ButtonBuilder().setCustomId('show-week').setLabel('Näytä viikko').setStyle(ButtonStyle.Primary);
  const cancel = new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Secondary);
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(cancel, week);

  return row;
}

export async function showWeek(interaction: ButtonInteraction) {
  const menu = await getMenuWeekString();
  await interaction.update({
    content: "menu",
    components: [],
  });
}
