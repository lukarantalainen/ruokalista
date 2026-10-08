import { ButtonBuilder, ButtonStyle } from "discord.js";
import type { ButtonInteraction } from "discord.js";

export const name = "priimus:previous";
export async function execute(interaction: ButtonInteraction) {

}

export function createButton(): ButtonBuilder {
  return new ButtonBuilder().setCustomId(name).setLabel("Edellinen").setStyle(ButtonStyle.Secondary);
}

