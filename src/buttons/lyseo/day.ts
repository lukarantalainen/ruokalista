import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { getMenuDayString } from "../../jamix/jamix.js";
import { buildButtonsDay, buildEmbed } from "../../commands/utility/lyseo.js";

export const name = "lyseo:show-day";
export async function execute(interaction: ButtonInteraction) {
  const menu = await getMenuDayString();
    const embed = await buildEmbed(menu);
    const buttons = await buildButtonsDay();
    await interaction.update({
      embeds: [embed],
      components: [buttons]
    });
}

export function createButton(): ButtonBuilder {
  return new ButtonBuilder().setCustomId(name).setLabel("Näytä päivä").setStyle(ButtonStyle.Primary);
}

