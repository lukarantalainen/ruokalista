import { ButtonStyle, type ButtonInteraction } from "discord.js";
import { buildButtonsWeek, buildEmbed } from "../../commands/utility/priimus.js";
import { getWeek } from "../../priimus/priimus.js";
import { Button } from "../../types/button.js";

export const name = "priimus:refresh";
export async function execute(interaction: ButtonInteraction) {
  const menu = await getWeek();
  const embed = buildEmbed(menu);
  const buttons = buildButtonsWeek();
  await interaction.update({
    embeds: [embed],
    components: [buttons]
  });
}

export function createButton(): Button {
  return new Button(name).setLabel("Päivitä").setStyle(ButtonStyle.Secondary);
}
