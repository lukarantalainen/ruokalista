import { SlashCommandBuilder } from "discord.js";
import * as cheerio from "cheerio";

export const data = new SlashCommandBuilder().setName('pong').setDescription('Priimuksen ruokalista tälle päivälle.');

export async function execute(interaction: any) {
	await interaction.reply('Pong!');
}

async function getMenu(): Promise<string | null> {
	const response = await fetch("https://www.gradia.fi/ravintola-priimus/opiskelija-ja-henkilostolounas");
	
	const html = await response.text();
	
	let $ = cheerio.load(html);

	const element = $("#block-gradia-content > article > div.l-article__content.l-article__content--page > div.field--item");

	return element.html();
}

console.log(await getMenu());
