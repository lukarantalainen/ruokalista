import { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
import type { Interaction } from "discord.js";
import * as cheerio from "cheerio";

export const data = new SlashCommandBuilder().setName('test').setDescription('Priimuksen ruokalista tälle päivälle.');

export async function execute(interaction: Interaction) {
	if (!interaction.isChatInputCommand()) return;
	const menu = await getMenu();
	const embed = await buildEmbed(menu);
	// const buttons = await buildButtonsDay();
	// await interaction.reply({embeds: [embed], components: [buttons]});
	await interaction.reply({embeds: [embed]});
}

async function buildEmbed(menu: string): Promise<EmbedBuilder> {
	const exampleEmbed = new EmbedBuilder()
	.setColor(0x4dbfbb)
	.setTitle('Priimus ruokalista')
	.setDescription(menu)

	return exampleEmbed;
}

// async function buildButtonsDay(): Promise<ActionRowBuilder<ButtonBuilder>> {
// 	const day = new ButtonBuilder().setCustomId("show-week").setLabel("Näytä viikko").setStyle(ButtonStyle.Primary);
// 	const previous = new ButtonBuilder().setCustomId("previous").setLabel("Edellinen").setStyle(ButtonStyle.Primary);
// 	const next = new ButtonBuilder().setCustomId("next").setLabel("Seuraava").setStyle(ButtonStyle.Primary);
// 	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(previous, next, day);

// 	return row;
// }

// async function buildButtonsWeek(): Promise<ActionRowBuilder<ButtonBuilder>> {
//   const week = new ButtonBuilder().setCustomId("show-day").setLabel("Näytä päivä").setStyle(ButtonStyle.Primary);
//   const refresh = new ButtonBuilder().setCustomId("refresh-week").setLabel("Päivitä").setStyle(ButtonStyle.Secondary);
//   const row = new ActionRowBuilder<ButtonBuilder>().addComponents(refresh, week);

//   return row;
// }

// export async function showWeekCallback(interaction: ButtonInteraction) {
// 	const menu = await getMenuWeekString();
// 	const embed = await buildEmbed(menu);
// 	const buttons = await buildButtonsWeek();
// 	await interaction.update({
// 		embeds: [embed],
// 		components: [buttons]
// 	});
// }

// export async function showDayCallback(interaction: ButtonInteraction) {
// 	const menu = await getMenuDayString();
// 	const embed = await buildEmbed(menu);
// 	const buttons = await buildButtonsDay();
// 	await interaction.update({
// 		embeds: [embed],
// 		components: [buttons]
// 	});
// }

// export async function previousCallback(interaction: ButtonInteraction) {
// 	const menu = await getMenuDayString(-1);
// 	const embed = await buildEmbed(menu);
// 	const buttons = await buildButtonsDay();
// 	await interaction.update({
// 		embeds: [embed],
// 		components: [buttons]
// 	});
// }

// export async function nextCallback(interaction: ButtonInteraction) {
// 	const menu = await getMenuDayString(1);
// 	const embed = await buildEmbed(menu);
// 	const buttons = await buildButtonsDay();
// 	await interaction.update({
// 		embeds: [embed],
// 		components: [buttons]
// 	});
// } 

async function getMenu(): Promise<string> {
	const response = await fetch("https://www.gradia.fi/ravintola-priimus/opiskelija-ja-henkilostolounas");
	
	const html = await response.text();
	
	let $ = cheerio.load(html);

	let menu: string = "";

	for (let i = 3; i <= 2+5; ++i) {
		let element = $(`#block-gradia-content > article > div.l-article__content.l-article__content--page > div.field--item > p:nth-child(${i})`);
		menu += element.html()!.replaceAll("<br>", "\n").replaceAll("<strong>", "\n**").replaceAll("</strong>", "**").replaceAll("&nbsp;", "");
	}

	return menu;
}
