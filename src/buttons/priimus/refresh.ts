import { ButtonBuilder, ButtonStyle, type ButtonInteraction } from "discord.js";
import { getMenuWeekString } from "../../jamix/jamix.js";
import { buildButtonsWeek, buildEmbed } from "../../commands/utility/lyseo.js";

export const name = "lyseo:refresh";
export async function execute(interaction: ButtonInteraction) {
   const menu = await getMenuWeekString();
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
