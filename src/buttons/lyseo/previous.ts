import { ButtonStyle } from "discord.js";
import { ActionRowBuilder, type ButtonInteraction } from "discord.js";
import { getMenuDayString } from "../../jamix/jamix.js";
import { buildButtonsDay, buildEmbed } from "../../commands/utility/lyseo.js";
import { getDateFromButton, getDayFromButton } from "../../utils.js";
import { Button } from "../../types/button.js";
import * as Week from "../../buttons/lyseo/week.js";
import * as Next from "../../buttons/lyseo/next.js";

export const name = "lyseo:previous";
export async function execute(interaction: ButtonInteraction) {
  const date = getDayFromButton(interaction.customId);
  
  const menu = await getMenuDayString(date - 1);
  const embed = buildEmbed(menu);
  const dateObj = getDateFromButton(interaction.customId);
  const buttons = updateButtons(dateObj);
  await interaction.update({
    embeds: [embed],
    components: [buttons]
  });
}

export function createButton(): Button {
  return new Button(name).setLabel("Edellinen").setStyle(ButtonStyle.Secondary);
}

function updateButtons(date: Date): ActionRowBuilder<Button> {
  const week = Week.createButton();
  const previous = createButton().incrementDay(date);
  const next = Next.createButton().incrementDay(date);

  const row = new ActionRowBuilder<Button>().addComponents(previous, next, week);
  return row;
}
