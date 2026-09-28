import { EmbedBuilder, SlashCommandBuilder, type Interaction } from "discord.js";
import { getMenuWeekString } from "../../jamix/jamix.js";

export const data = new SlashCommandBuilder().setName('lyseo').setDescription('Lyseon ruokalista.');
export async function execute(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  const menu = await getMenuWeekString();
  const embed = await(buildEmbed(menu));
  await interaction.reply({embeds: [embed]});
}

async function buildEmbed(menu: string): Promise<EmbedBuilder> {
  const exampleEmbed = new EmbedBuilder()
  .setColor(0x16216a)
  .setTitle('Lyseo ruokalista')
  .setDescription(menu)

  return exampleEmbed;
}
