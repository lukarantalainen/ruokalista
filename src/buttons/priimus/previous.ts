import { ButtonBuilder, ButtonStyle } from "discord.js";
import type { ButtonInteraction } from "discord.js";
import { buildButtonsDay, buildEmbed } from "../../commands/utility/priimus.js";
import { getMenuDay } from "../../priimus/priimus.js";

export const name = "priimus:previous";
export async function execute(interaction: ButtonInteraction) {
  const day = interaction.client.priimus.day;
    if (0 < day) {
      interaction.client.priimus.day -= 1;
    }
    
    const menu = await getMenuDay(interaction.client.priimus.day);
    const embed = buildEmbed(menu);
    const buttons = buildButtonsDay();
    await interaction.update({
      embeds: [embed],
      components: [buttons]
    });
}

export function createButton(): ButtonBuilder {
  return new ButtonBuilder().setCustomId(name).setLabel("Edellinen").setStyle(ButtonStyle.Secondary);
}

