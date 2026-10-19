import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { getMenuDay } from "../../priimus/priimus.js";
import { buildButtonsDay, buildEmbed } from "../../commands/utility/priimus.js";

export const name = "priimus:show-day";
export async function execute(interaction: ButtonInteraction) {
  const menu = await getMenuDay();
  const embed = await buildEmbed(menu);
  const buttons = buildButtonsDay();

  await interaction.update({
    embeds: [embed],
    components: [buttons]
  });
}

export function createButton(): ButtonBuilder {
  return new ButtonBuilder().setCustomId(name).setLabel("Näytä päivä").setStyle(ButtonStyle.Primary);
}

