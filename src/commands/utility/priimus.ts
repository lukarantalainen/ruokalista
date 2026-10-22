import { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder } from "discord.js";
import type { Interaction } from "discord.js";
import { getWeek } from "../../priimus/priimus.js";
import * as Day from "../../buttons/priimus/day.js";
import * as Refresh from "../../buttons/priimus/refresh.js";
import type { Button } from "../../types/button.js";

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

export function buildButtonsWeek(): ActionRowBuilder<Button> {
	const day = Day.createButton();
	const refresh = Refresh.createButton();
	const row = new ActionRowBuilder<Button>().addComponents(refresh, day);

	return row;
}
