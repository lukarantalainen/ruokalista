import { ButtonBuilder, ButtonStyle, type ButtonInteraction } from "discord.js";

export const name = "priimus:next";
export async function execute(interaction: ButtonInteraction) {

}

export function createButton(): ButtonBuilder {
  return new ButtonBuilder().setCustomId(name).setLabel("Seuraava").setStyle(ButtonStyle.Secondary);
}
