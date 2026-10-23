import { ButtonInteraction, ButtonStyle } from "discord.js";
import { getMenuDayString, getToday } from "../../jamix/jamix.js";
import { buildButtonsDay, buildEmbed } from "../../commands/utility/lyseo.js";
import { Button } from "../../types/button.js";
import { getDayFromButton } from "../../utils.js";

export const name = "lyseo:show-day";
export async function execute(interaction: ButtonInteraction) {
  const today = getDayFromButton(interaction.customId);

  const menu = await getMenuDayString(today);
  const embed = buildEmbed(menu);
  const buttons = buildButtonsDay();
  await interaction.update({
    embeds: [embed],
    components: [buttons]
  });
}

export function createButton(): Button {
  return new Button(name).setLabel("Näytä päivä").setStyle(ButtonStyle.Primary);
}

