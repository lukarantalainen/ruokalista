import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { getMenuDayString, getToday } from "../../jamix/jamix.js";
import { buildButtonsDay, buildEmbed } from "../../commands/utility/lyseo.js";

export const name = "lyseo:show-day";
export async function execute(interaction: ButtonInteraction) {
  const today = getToday();
  interaction.client.lyseo.day = today;

  const menu = await getMenuDayString(today);
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

