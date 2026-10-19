import { ButtonBuilder, ButtonStyle } from "discord.js";
import type { ButtonInteraction } from "discord.js";
import { getMenuDayString } from "../../jamix/jamix.js";
import { buildButtonsDay, buildEmbed } from "../../commands/utility/lyseo.js";

export const name = "lyseo:previous";
export async function execute(interaction: ButtonInteraction) {
  const day = interaction.client.lyseo.day;
  if (0 < day) {
    interaction.client.lyseo.day -= 1;
  }
  
  const menu = await getMenuDayString(interaction.client.lyseo.day);
  const embed = await buildEmbed(menu);
  const buttons = buildButtonsDay();
  await interaction.update({
    embeds: [embed],
    components: [buttons]
  });
}

export function createButton(): ButtonBuilder {
  return new ButtonBuilder().setCustomId(name).setLabel("Edellinen").setStyle(ButtonStyle.Secondary);
}

