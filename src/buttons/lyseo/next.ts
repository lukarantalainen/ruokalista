import { ActionRowBuilder, ButtonBuilder, ButtonStyle, type ButtonInteraction } from "discord.js";
import { getMenuDayString } from "../../jamix/jamix.js";
import { buildButtonsDay, buildEmbed } from "../../commands/utility/lyseo.js";
import { getDateFromButton } from "../../utils.js";
import { Button } from "../../types/button.js";
import * as Week from "../../buttons/lyseo/week.js";
import * as Previous from "../../buttons/lyseo/previous.js";


export const name = "lyseo:next";
export async function execute(interaction: ButtonInteraction) {
  const date = getDateFromButton(interaction.customId);

  const menu = await getMenuDayString(date);
  const embed = buildEmbed(menu);
  const buttons = updateButtons();
  await interaction.update({
    embeds: [embed],
    components: [buttons]
  });
}

export function createButton(): Button {
  return new Button(name).setLabel("Seuraava").setStyle(ButtonStyle.Secondary);
}

function updateButtons(): ActionRowBuilder<Button> {
  const week = Week.createButton();
  const previous = Previous.createButton().incrementDay();
  const next = createButton().incrementDay();

  const row = new ActionRowBuilder<Button>().addComponents(previous, next, week);
  return row;
}
