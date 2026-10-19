import { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";
import type { Interaction } from "discord.js";
import { getMenuDayString, getToday } from "../../jamix/jamix.js";
import * as Week from "../../buttons/lyseo/week.js";
import * as Day from "../../buttons/lyseo/day.js";
import * as Next from "../../buttons/lyseo/next.js";
import * as Previous from "../../buttons/lyseo/previous.js";
import * as Refresh from "../../buttons/lyseo/refresh.js";

export const data = new SlashCommandBuilder().setName('lyseo').setDescription('Lyseon ruokalista.');
export async function execute(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  const today = getToday();
  const menu = await getMenuDayString(today);
  const embed = await buildEmbed(menu);
  const buttons = buildButtonsDay();

  console.log({
    command: interaction.commandName,
    replied: interaction.replied,
    deferred: interaction.deferred,
  });

  await interaction.reply({ embeds: [embed], components: [buttons] });
}

export async function buildEmbed(menu: string): Promise<EmbedBuilder> {
  const exampleEmbed = new EmbedBuilder()
    .setColor(0x16216a)
    .setTitle('Lyseo ruokalista')
    .setDescription(menu)

  return exampleEmbed;
}

export function buildButtonsDay(): ActionRowBuilder<ButtonBuilder> {
  const week = Week.createButton();
  const previous = Previous.createButton();
  const next = Next.createButton();
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(previous, next, week);

  return row;
}

export async function buildButtonsWeek(): Promise<ActionRowBuilder<ButtonBuilder>> {
  const day = Day.createButton();
  const refresh = Refresh.createButton();
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(refresh, day);

  return row;
}

