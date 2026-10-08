import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";

export const name = "priimus:show-day";
export async function execute(interaction: ButtonInteraction) {
  
}

export function createButton(): ButtonBuilder {
  return new ButtonBuilder().setCustomId(name).setLabel("Näytä päivä").setStyle(ButtonStyle.Primary);
}

