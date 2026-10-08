import { LRUCache } from "lru-cache";
import { Day, MenuDay, MenuItem } from "../types/types.js";

const options = {
  max: 1,
  ttl: 60 * 60 * 24,
  allowStale: true,
  fetchMethod: async (key: any) => {
    return await fetchUpdatedData(key);
  }
};

const cache = new LRUCache(options);

async function fetchUpdatedData(key: any): Promise<any> {
  return cache.get(key);
}

function getMonday(date: Date) {
  let d = new Date(date);

  d.setDate(d.getDate() - (d.getDay() + 6) % 7);
  return d;
}

function getFriday(date: Date) {
  let d = new Date(date);

  d.setDate(d.getDate() + (5 + 7 - d.getDay()) % 7);
  return d;
}

function formatDate(date: Date) {
  let day = '' + date.getDate();
  let month = '' + (date.getMonth() + 1);
  let year = date.getFullYear();

  if (day.length < 2) {
    day = '0' + day;
  }

  if (month.length < 2) {
    month = '0' + month;
  }

  return [year, month, day].join('');
}

async function getMenuJson(start: string, end: string) {
  const response = await fetch(`https://fi.jamix.cloud/apps/menuservice/rest/haku/menu/96786/10?lang=fi&date=${start}&date2=${end}`);

  return response.json();
}

const WEEKDAYS_FI = [
  "Maanantai",
  "Tiistai",
  "Keskiviikko",
  "Torstai",
  "Perjantai",
  "Lauantai",
  "Sunnuntai",
];



function formatMenu(menu: Array<MenuDay>) {
  let lines: string[] = [];

  for (let menuDay of menu) {
    lines.push(formatDish(menuDay));
  }
  return lines.join('\n');
}

export async function getMenuWeekString() {
  const data = await getMenuWeek();
  const dishes = await getDishes(data);
  return formatMenu(dishes);
}

async function getMenuDay(day: Day): Promise<MenuDay> {
  const dishes = await getDishes(await getMenuWeek());
  if (dishes.length && dishes[day]) {
    return dishes[day];
  } else {
    return new MenuDay(Day.None);
  }
}

export async function getMenuDayString(offset: number = 0): Promise<string> {
  const today = (new Date().getDay() + 6) % 7;
  const menuDay = await getMenuDay(today + offset);
  return formatDish(menuDay);
}

function formatDish(menuDay: MenuDay) {
  const today = (new Date().getDay() + 6) % 7;
  const day = menuDay.day;
  let lines: string[] = [];
  lines.push("**" + WEEKDAYS_FI[day] + "**")

  for (let meal of menuDay.items) {
    lines.push(`${meal.mealtype}: ${meal.mealname}`);

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

async function getMenuWeek() {
  const today = new Date(Date.now());
  const data = await getMenuJson(formatDate(getMonday(today)), formatDate(getFriday(today)));

  return data;
}
