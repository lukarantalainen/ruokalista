import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { getMenuWeekString } from "../../jamix/jamix.js";
import { buildButtonsWeek, buildEmbed } from "../../commands/utility/lyseo.js";
import { Button } from "../../types/button.js";

export const name = "lyseo:show-week";
export async function execute(interaction: ButtonInteraction) {
  const menu = await getMenuWeekString();
  const embed = buildEmbed(menu);
  const buttons = await buildButtonsWeek();
  await interaction.update({
    embeds: [embed],
    components: [buttons]
  });
}


export function createButton(): Button {
  return new Button(name).setLabel("Näytä viikko").setStyle(ButtonStyle.Primary);
}

