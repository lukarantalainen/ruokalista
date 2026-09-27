import { SlashCommandBuilder } from "discord.js";
import { getMenuWeekString } from "./jamix.js";

export const data = new SlashCommandBuilder().setName('testi').setDescription('Viikon ruokalista.');
export async function execute(interaction: any) {
  // interaction.guild is the object representing the Guild in which the command was run
  const menu = await getMenuWeekString();
  await interaction.reply(
    menu,
  );
}

console.log("testi");
