import { SlashCommandBuilder } from "discord.js";
import { getMenuWeekString } from "../../jamix.js";

export const data = new SlashCommandBuilder().setName('testi').setDescription('Testi.');
export async function execute(interaction: any) {
  const menu = await getMenuWeekString();
  await interaction.deferReply();
  await interaction.editReply(menu);
}
