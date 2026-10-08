import { ButtonBuilder, ButtonStyle, type ButtonInteraction } from "discord.js";
import { getMenuDayString } from "../../jamix/jamix.js";
import { buildButtonsDay, buildEmbed } from "../../commands/utility/lyseo.js";

export const name = "lyseo:next";
export async function execute(interaction: ButtonInteraction) {
  const menu = await getMenuDayString(1);
    const embed = await buildEmbed(menu);
    const buttons = await buildButtonsDay();
    await interaction.update({
      embeds: [embed],
      components: [buttons]
    });
}

export function createButton(): ButtonBuilder {
  return new ButtonBuilder().setCustomId(name).setLabel("Seuraava").setStyle(ButtonStyle.Secondary);
}
