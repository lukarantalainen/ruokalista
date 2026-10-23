import { ActionRowBuilder, ButtonStyle, type ButtonInteraction } from "discord.js";
import { getMenuDay } from "../../priimus/priimus.js";
import { buildEmbed } from "../../commands/utility/priimus.js";
import { formatDate, getDateFromButton, getDayFromButton } from "../../utils.js";
import * as Previous from "../../buttons/priimus/previous.js";
import * as Week from "../../buttons/priimus/week.js";
import { Button } from "../../types/button.js";
import type { Day } from "../../types/types.js";

export const name = "priimus:next";
export async function execute(interaction: ButtonInteraction) {
  let date = getDayFromButton(interaction.customId);

  const menu = await getMenuDay(date+1);
  const embed = buildEmbed(menu);
  const dateObj = getDateFromButton(interaction.customId);
  const buttons = updateButtons(dateObj);
  await interaction.update({
    embeds: [embed],
    components: [buttons]
  });
}

export function createButton(): Button {
  return new Button(name).setLabel("Seuraava").setStyle(ButtonStyle.Secondary);
}

function updateButtons(date: Date): ActionRowBuilder<Button> {
  const week = Week.createButton();
  const previous = Previous.createButton().incrementDay(date);
  const next = createButton().incrementDay(date);

  const row = new ActionRowBuilder<Button>().addComponents(previous, next, week);
  return row;
}
