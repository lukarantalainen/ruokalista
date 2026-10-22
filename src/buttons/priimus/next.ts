import { ActionRowBuilder, ButtonStyle, type ButtonInteraction } from "discord.js";
import { getMenuDay } from "../../priimus/priimus.js";
import { buildEmbed } from "../../commands/utility/priimus.js";
import { formatDate, getDateFromButton } from "../../utils.js";
import * as Previous from "../../buttons/priimus/previous.js";
import * as Week from "../../buttons/priimus/week.js";
import { Button } from "../../types/button.js";
import type { Day } from "../../types/types.js";

export const name = "priimus:next";
export async function execute(interaction: ButtonInteraction) {
  let date = getDateFromButton(interaction.customId);
  if (date < 4) date += 1;

  const menu = await getMenuDay(date);
  const embed = buildEmbed(menu);
  const buttons = updateButtons(date);
  await interaction.update({
    embeds: [embed],
    components: [buttons]
  });
}

export function createButton(): Button {
  return new Button(name).setLabel("Seuraava").setStyle(ButtonStyle.Secondary);
}

function updateButtons(day: Day): ActionRowBuilder<Button> {
  const week = Week.createButton();
  const previous = Previous.createButton().incrementDay();
  const next = createButton().incrementDay();

  const row = new ActionRowBuilder<Button>().addComponents(previous, next, week);
  return row;
}
