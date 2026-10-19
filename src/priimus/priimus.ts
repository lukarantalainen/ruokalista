import { TTLCache } from "@isaacs/ttlcache";
import * as cheerio from "cheerio";
import type { Day } from "../types/types.js";

export async function getWeek() {
	return (await getMenu()).join("");
}

export async function getMenuDay(day: Day): Promise<string> {
	const menu = await getMenu();
	return menu[day] || "undefined";
}

const options = {
	max: 1,
	ttl: 60 * 60 * 1000,
};

const cache = new TTLCache(options);

async function getMenu(): Promise<string[]> {
	const url = "https://www.gradia.fi/ravintola-priimus/opiskelija-ja-henkilostolounas";
	
	let html = "";
	if (cache.has(url)) {
		const result = cache.get(url);
		html = (result) ? result as string : "";
	} else {
		const response = await fetch(url);
		html = await response.text();
		cache.set(url, html);
	}
	const menu = await parseMenu(html);

	let days: string[] = [];

	for (const day of menu) {
		let text = "";
		text += day.day + "\n";
		for (const dish of day.dishes) {
			text += dish + "\n";
		}
		days.push(text);
	}
	return days;
}


export async function parseMenu(html: string): Promise<{
	day: string;
	dishes: string[];
}[]> {
	const days = [
		"Maanantai",
		"Tiistai",
		"Keskiviikko",
		"Torstai",
		"Perjantai",
	];

	const menu: { day: string; dishes: string[] }[] = [];

	let $ = cheerio.load(html);

	$("div.field--item > p").each((_, element) => {
		const strong = $(element).find("strong").first();
		let day = strong.text().trim();

		if (!days.includes(day)) {
			return;
		}

		day = "**" + day + "**";

		const dishes = $(element)
			.html()!
			.replace(/^.*?<\/strong><br>/, "")
			.split("<br>")
			.map(dish => $("<div>").html(dish).text().trim())
			.filter(Boolean);

		menu.push({ day, dishes });
	});

	return menu;
}
