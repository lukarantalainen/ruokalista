import { TTLCache } from "@isaacs/ttlcache";
import { Day, MenuDay, MenuItem } from "../types/types.js";

export function getToday() {
  return (new Date().getDay() + 6) % 7;
}

export async function getMenuDayString(day: number): Promise<string> {
  const menuDay = await getMenuDay(day);
  return formatDish(menuDay);
}

export async function getMenuWeekString() {
  const today = new Date(Date.now());

  const monday = formatDate(getMonday(today));
  const friday = formatDate(getFriday(today));
  const data = await getMenuJson(monday, friday);

  const dishes = await getDishes(data);
  return formatMenu(dishes);
}

const options = {
  max: 1,
  ttl: 60 * 60 * 1000,
};

const cache = new TTLCache(options);

async function getMenuJson(start: string, end: string): Promise<Record<any, any>> {
  const url = `https://fi.jamix.cloud/apps/menuservice/rest/haku/menu/96786/10?lang=fi&date=${start}&date2=${end}`;

  if (cache.has(url)) {
    const json = cache.get(url);
    return json || {};
  } else {
    const response = await fetch(url);
    try {
      const json = await response.json();
      cache.set(url, json);
      return json;
    } catch (error) {
      console.error(error);
    }
  }
  return {};
}

function getMonday(date: Date): Date {
  let monday = new Date(date);

  const diff = (date.getDay() === 0) ? 6 : (date.getDay() - 1);
  monday.setDate(date.getDate() - diff);
  return monday;
}

function getFriday(date: Date): Date {
  let friday = new Date(date);

  const diff = (date.getDay() === 0) ? -2 : 5 - date.getDay();
  friday.setDate(date.getDate() + diff);
  return friday;
}

function formatDate(date: Date): string {
  const dateStr = date?.toISOString()?.split('T')[0]?.replaceAll('-', '');
  return (dateStr || "");
}

function getDayName(day: Day): string {
  return ["Maanantai",
    "Tiistai",
    "Keskiviikko",
    "Torstai",
    "Perjantai",
    "Lauantai",
    "Sunnuntai"][day] || "undefined";
}


function formatDish(menuDay: MenuDay) {
  const today = (new Date().getDay() + 6) % 7;
  const dayStr = getDayName(menuDay.day);
  let lines: string[] = [];
  lines.push("**" + dayStr + "**")

  for (let meal of menuDay.items) {
    lines.push(`${meal.mealtype}: ${meal.mealname}`);

  }
  return lines.join('\n');
}

function formatMenu(menu: Array<MenuDay>) {
  let lines: string[] = [];

  for (let menuDay of menu) {
    const dish = formatDish(menuDay);
    lines.push(dish);
  }
  return lines.join('\n');
}

async function getDishes(menu: any): Promise<Array<MenuDay>> {
  let dishes: Array<MenuDay> = [];

  let day = 0;
  for (const days of menu[0].menuTypes[0].menus[0].days) {
    let date: MenuDay = new MenuDay(day);
    for (let mealOption of days.mealoptions) {
      const mealtype = mealOption.name;
      for (const item of mealOption.menuItems) {
        const mealName = String(item.name).toLowerCase();
        let dish = new MenuItem(mealtype, mealName);

        date.push(dish);
      }
    }
    day += 1;

    dishes.push(date);
  }

  return dishes;
}

async function getMenuDay(day: Day): Promise<MenuDay> {
  const today = new Date(Date.now());

  const monday = formatDate(getMonday(today));
  const friday = formatDate(getFriday(today));
  const data = await getMenuJson(monday, friday);

  const dishes = await getDishes(data);
  if (dishes.length && dishes[day]) {
    return dishes[day];
  } else {
    return new MenuDay(Day.None);
  }
}

