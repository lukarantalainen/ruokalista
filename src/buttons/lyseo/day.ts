import { ButtonInteraction, ButtonStyle } from "discord.js";
import { getMenuDayString, getToday } from "../../jamix/jamix.js";
import { buildButtonsDay, buildEmbed } from "../../commands/utility/lyseo.js";
import { Button } from "../../types/button.js";
import { getDateFromButton } from "../../utils.js";

export const name = "lyseo:show-day";
export async function execute(interaction: ButtonInteraction) {
  const today = getDateFromButton(interaction.customId);

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

