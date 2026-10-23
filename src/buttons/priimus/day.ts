import { ActionRowBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { getMenuDay } from "../../priimus/priimus.js";
import { buildEmbed } from "../../commands/utility/priimus.js";
import { Button } from "../../types/button.js";
import { getDayFromButton } from "../../utils.js";
import * as Week from "../../buttons/priimus/week.js";
import * as Next from "../../buttons/priimus/next.js";
import * as Previous from "../../buttons/priimus/previous.js";

export const name = "priimus:show-day";
export async function execute(interaction: ButtonInteraction) {
  const today = getDayFromButton(interaction.customId);

  const menu = await getMenuDay(today);
  const embed = buildEmbed(menu);
  const buttons = buildButtons();

  await interaction.update({
    embeds: [embed],
    components: [buttons]
  });
}

export function createButton(): Button {
  const today = new Date();
  return new Button(name).setLabel("Näytä päivä").setStyle(ButtonStyle.Primary).setDate(today);
}

export function buildButtons(): ActionRowBuilder<Button> {
  const week = Week.createButton();
  const today = new Date();
  const previous = Previous.createButton().setDate(today);
  const next = Next.createButton().setDate(today);
  const row = new ActionRowBuilder<Button>().addComponents(previous, next, week);

  return row;
}
