import { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
import type { Interaction } from "discord.js";
import { getWeek } from "../../priimus/priimus.js";
import * as Day from "../../buttons/priimus/day.js";
import * as Week from "../../buttons/priimus/week.js";
import * as Next from "../../buttons/priimus/next.js";
import * as Previous from "../../buttons/priimus/previous.js";
import * as Refresh from "../../buttons/priimus/refresh.js";

export const data = new SlashCommandBuilder().setName('priimus').setDescription('Priimuksen ruokalista tälle päivälle.');

export async function execute(interaction: Interaction) {
	if (!interaction.isChatInputCommand()) return;
	const menu = await getWeek();
	const embed = buildEmbed(menu);
	const buttons = buildButtonsWeek();
	await interaction.reply({ embeds: [embed], components: [buttons] });
}

export function buildEmbed(menu: string): EmbedBuilder {
	const embed = new EmbedBuilder()
		.setColor(0x4dbfbb)
		.setTitle('Priimus ruokalista')
		.setDescription(menu)

	return embed;
}

export function buildButtonsDay(): ActionRowBuilder<ButtonBuilder> {
	const week = Week.createButton();
	const previous = Previous.createButton();
	const next = Next.createButton();
	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(previous, next, week);

	return row;
}

export function buildButtonsWeek(): ActionRowBuilder<ButtonBuilder> {
	const day = Day.createButton();
	const refresh = Refresh.createButton();
	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(refresh, day);

	return row;
}


