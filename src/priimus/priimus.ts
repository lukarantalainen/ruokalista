import * as cheerio from "cheerio";

export async function getWeek() {
	return (await getMenu()).join("\n");
}

async function getMenu(): Promise<string[]> {
	const response = await fetch("https://www.gradia.fi/ravintola-priimus/opiskelija-ja-henkilostolounas");

	const html = await response.text();
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
		const day = strong.text().trim();

		if (!days.includes(day)) {
			return;
		}

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
