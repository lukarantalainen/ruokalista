import { LRUCache } from "lru-cache";


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
  console.log(d.getDay());
  return d;
}

function getFriday(date: Date) {
  let d = new Date(date);

  d.setDate(d.getDate() + (5 + 7 - d.getDay()) % 7);
  console.log(d.getDay());
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
  console.log(`https://fi.jamix.cloud/apps/menuservice/rest/haku/menu/96786/10?lang=fi&date=${start}&date2=${end}`);
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

class MenuItem {
  mealtype: string = "None";
  mealname: string = "None";

  constructor(mealtype: string, mealname: string) {
    this.mealtype = mealtype;
    this.mealname = mealname;
  }
}

function formatMenu(menu: Array<Array<MenuItem>>) {

  let lines: string[] = [];

  let weekday = 0
  const today = (new Date().getDay() + 6) % 7;
  for (let day of menu) {
    if (weekday >= 5) break;
    if (weekday == today) {

      lines.push("__**" + WEEKDAYS_FI[weekday] + "**__")
    }
    else {
      lines.push("**" + WEEKDAYS_FI[weekday] + "**")
    }
    for (let meal of day) {
      lines.push(`${meal.mealtype}: ${meal.mealname}`);
    }
    weekday += 1
  }

  return lines.join('\n');
}

export async function getMenuWeekString() {
  return formatMenu(getDishes(await getMenuWeek()));
}

function getDishes(menu: any): Array<Array<MenuItem>> {
  let dishes: Array<Array<MenuItem>> = [];

  for (const days of menu[0].menuTypes[0].menus[0].days) {
    let date: Array<MenuItem> = [];
    for (let mealOption of days.mealoptions) {
      const mealtype = mealOption.name;
      for (const item of mealOption.menuItems) {
        const mealName = String(item.name).toLowerCase();
        let dish = new MenuItem(mealtype, mealName);

        date.push(dish)
      }
    }

    dishes.push(date);
  }
  return dishes;
}

async function getMenuWeek() {
  const today = new Date(Date.now());
  const data = await getMenuJson(formatDate(getMonday(today)), formatDate(getFriday(today)));

  return data;
}
