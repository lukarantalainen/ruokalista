import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Interaction } from "discord.js";
import * as cheerio from "cheerio";

export const data = new SlashCommandBuilder().setName('test').setDescription('Priimuksen ruokalista tälle päivälle.');

export async function execute(interaction: Interaction) {
	if (!interaction.isChatInputCommand()) return;
	const menu = await getMenu();
	const embed = await buildEmbed(menu);
	await interaction.reply({embeds: [embed]});
}

async function buildEmbed(menu: string): Promise<EmbedBuilder> {
	const exampleEmbed = new EmbedBuilder()
	.setColor(0x4dbfbb)
	.setTitle('Priimus ruokalista')
	.setDescription(menu)

	return exampleEmbed;
}

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

// inside a command, event listener, etc.

