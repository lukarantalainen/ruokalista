import { ButtonBuilder, ButtonStyle, type ButtonInteraction } from "discord.js";
import { buildButtonsWeek, buildEmbed } from "../../commands/utility/priimus.js";
import { getWeek } from "../../priimus/priimus.js";

export const name = "priimus:refresh";
export async function execute(interaction: ButtonInteraction) {
  const menu = await getWeek();
  const embed = await buildEmbed(menu);
  const buttons = await buildButtonsWeek();
  await interaction.update({
    embeds: [embed],
    components: [buttons]
  });
}

export function createButton(): ButtonBuilder {
  return new ButtonBuilder().setCustomId(name).setLabel("Päivitä").setStyle(ButtonStyle.Secondary);
}
