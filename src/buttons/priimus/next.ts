import { ButtonBuilder, ButtonStyle, type ButtonInteraction } from "discord.js";
import { getMenuDay } from "../../priimus/priimus.js";
import { buildButtonsDay, buildEmbed } from "../../commands/utility/priimus.js";

export const name = "priimus:next";
export async function execute(interaction: ButtonInteraction) {
  const day = interaction.client.priimus.day;
    if (day < 4) {
      interaction.client.priimus.day += 1;
    }

    const menu = await getMenuDay(interaction.client.priimus.day);
    const embed = await buildEmbed(menu);
    const buttons = buildButtonsDay();
    await interaction.update({
      embeds: [embed],
      components: [buttons]
    });
}

export function createButton(): ButtonBuilder {
  return new ButtonBuilder().setCustomId(name).setLabel("Seuraava").setStyle(ButtonStyle.Secondary);
}
