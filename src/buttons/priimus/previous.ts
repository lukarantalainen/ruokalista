import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import type { ButtonInteraction } from "discord.js";
import { buildEmbed } from "../../commands/utility/priimus.js";
import { getMenuDay } from "../../priimus/priimus.js";
import { Button } from "../../types/button.js";
import * as Next from "../../buttons/priimus/next.js";
import * as Week from "../../buttons/priimus/week.js";
import { getDateFromButton, getDayFromButton } from "../../utils.js";

export const name = "priimus:previous";
export async function execute(interaction: ButtonInteraction) {
    let date = getDayFromButton(interaction.customId);
    
    const menu = await getMenuDay(date);
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
  const previous = createButton().decrementDay(date);
  const next = Next.createButton().decrementDay(date);

  const row = new ActionRowBuilder<Button>().addComponents(previous, next, week);
  return row;
}
