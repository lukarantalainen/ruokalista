# Tekijä: github.com/veeti2304
# Käyttö: Etsi päivän ateria Jamixin API:n kautta ja luo siitä halutessasi ICS tiedosto.
# Jamix API: https://fi.jamix.cloud/apps/menuservice/rest/haku/menu/<customer>/<kitchen>?lang=fi

import requests
import datetime
from typing import NamedTuple

ASIAKAS = 96786
KEITTIO = 10

cache: dict = {'updated': datetime.datetime.now(), 'data': {}}

def get_menu_json(start: datetime.datetime, end: datetime.datetime) -> dict:
    # Gradia Viitaniemi: Asiakas = 96786, Keittiö = 10
    url = f"https://fi.jamix.cloud/apps/menuservice/rest/haku/menu/{ASIAKAS}/{KEITTIO}?lang=fi&date={start}&date2={end}"
    try:
        data = requests.get(url).json()
        return data
    except:
        print("[-] JSON tietojen haku epäonnistui!")
        return {}

class Dish(NamedTuple):
    mealtype: str
    mealname: str

def get_dishes(ruokalista) -> list[list[Dish]]:
    try:
        ruoat = []

        for days in ruokalista[0]["menuTypes"][0]["menus"][0]["days"]:
            date = []
            for mealoption in days["mealoptions"]:

                mealtype = mealoption["name"]
                for item in mealoption["menuItems"]:
                    mealname = str(item["name"]).lower().capitalize()
                    dish = Dish(mealtype, mealname)

                    description = item["description"] if "description" in item else ""

                    if description:
                        date.append(f"{mealname} — {description}")
                    else:
                        date.append(dish)
            ruoat.append(date)

        return ruoat
    except Exception as e:
        print(e)
        return []

def get_next_friday(today) -> datetime.datetime:
    return (today + datetime.timedelta((4-today.weekday()) % 7)).strftime("%Y%m%d")

def get_prev_monday(today) -> datetime.datetime:
    return (today - datetime.timedelta((0-today.weekday()) % 7)).strftime("%Y%m%d")

def get_data_today(today) -> dict:
    return get_menu_json(today, today)

def get_data_week(today) -> dict:
    global cache
    start = get_prev_monday(today)
    end = get_next_friday(today)
    return get_menu_json(start, end)

def get_menu(date: datetime.datetime) -> list[list[Dish]]:
    global cache
    print(cache["updated"])
    if cache["updated"] + datetime.timedelta(days=1) > datetime.datetime.now() and cache["data"] != {}:
        print("using cache")
        return get_dishes(cache["data"])
    else:
        cache["updated"] = datetime.datetime.now()
        data = get_data_week(date)
        cache["data"] = data
        return get_dishes(data)
        
