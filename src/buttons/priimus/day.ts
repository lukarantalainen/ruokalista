import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { getMenuDay } from "../../priimus/priimus.js";
import { buildButtonsDay, buildEmbed } from "../../commands/utility/priimus.js";
import { getToday } from "../../jamix/jamix.js";

export const name = "priimus:show-day";
export async function execute(interaction: ButtonInteraction) {
  const today = getToday();
  const menu = await getMenuDay(today);
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

