import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import type { ButtonInteraction } from "discord.js";
import { buildEmbed } from "../../commands/utility/priimus.js";
import { getMenuDay } from "../../priimus/priimus.js";
import { Button } from "../../types/button.js";
import * as Next from "../../buttons/priimus/next.js";
import * as Week from "../../buttons/priimus/week.js";
import { getDateFromButton } from "../../utils.js";

export const name = "priimus:previous";
export async function execute(interaction: ButtonInteraction) {
    let date = getDateFromButton(interaction.customId);
    if (date > 0) date -= 1;
    
    const menu = await getMenuDay(date);
    const embed = buildEmbed(menu);
    const buttons = updateButtons();
    await interaction.update({
      embeds: [embed],
      components: [buttons]
    });
}

export function createButton(): Button {
  return new Button(name).setLabel("Edellinen").setStyle(ButtonStyle.Secondary);
}

function updateButtons(): ActionRowBuilder<Button> {
  const week = Week.createButton();
  const previous = createButton().incrementDay();
  const next = Next.createButton().incrementDay();

  const row = new ActionRowBuilder<Button>().addComponents(previous, next, week);
  return row;
}
