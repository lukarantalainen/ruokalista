import { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder } from "discord.js";
import type { Interaction } from "discord.js";
import { getMenuDayString, getToday } from "../../jamix/jamix.js";
import * as Week from "../../buttons/lyseo/week.js";
import * as Day from "../../buttons/lyseo/day.js";
import * as Next from "../../buttons/lyseo/next.js";
import * as Previous from "../../buttons/lyseo/previous.js";
import * as Refresh from "../../buttons/lyseo/refresh.js";
import type { Button } from "../../types/button.js";

export const data = new SlashCommandBuilder().setName('lyseo').setDescription('Lyseon ruokalista.');
export async function execute(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  const today = getToday();
  const menu = await getMenuDayString(today);
  const embed = buildEmbed(menu);
  const buttons = buildButtonsDay();

  console.log({
    command: interaction.commandName,
    replied: interaction.replied,
    deferred: interaction.deferred,
  });

  await interaction.reply({ embeds: [embed], components: [buttons] });
}

export function buildEmbed(menu: string): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(0x16216a)
    .setTitle('Lyseo ruokalista')
    .setDescription(menu)

  return embed;
}

export function buildButtonsDay(): ActionRowBuilder<Button> {
  const week = Week.createButton();
  const previous = Previous.createButton();
  const next = Next.createButton();
  const row = new ActionRowBuilder<Button>().addComponents(previous, next, week);

  return row;
}

export async function buildButtonsWeek(): Promise<ActionRowBuilder<Button>> {
  const day = Day.createButton();
  const refresh = Refresh.createButton();
  const row = new ActionRowBuilder<Button>().addComponents(refresh, day);

  return row;
}

