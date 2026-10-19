import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { buildButtonsWeek, buildEmbed } from "../../commands/utility/priimus.js";
import { getWeek } from "../../priimus/priimus.js";

export const name = "priimus:show-week";
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
  return new ButtonBuilder().setCustomId(name).setLabel("Näytä viikko").setStyle(ButtonStyle.Primary);
}

