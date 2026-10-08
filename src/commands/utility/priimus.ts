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
	const embed = await buildEmbed(menu);
	const buttons = await buildButtonsDay();
	// await interaction.reply({embeds: [embed], components: [buttons]});
	await interaction.reply({ embeds: [embed], components: [buttons] });
}

async function buildEmbed(menu: string): Promise<EmbedBuilder> {
	const exampleEmbed = new EmbedBuilder()
		.setColor(0x4dbfbb)
		.setTitle('Priimus ruokalista')
		.setDescription(menu)

	return exampleEmbed;
}

async function buildButtonsDay(): Promise<ActionRowBuilder<ButtonBuilder>> {
	const day = Day.createButton();
	const previous = Previous.createButton();
	const next = Next.createButton();
	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(previous, next, day);

	return row;
}

