import aiohttp
import asyncio
from bs4 import BeautifulSoup, Tag
from dataclasses import dataclass
from typing import List, Literal, get_args
import time
import datetime
 
Days = Literal["Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai"]
 
@dataclass
class DayMenu:
    day: Days
    items: List[str]
 
@dataclass
class ListedMenu:
    menus: List[DayMenu]
    week_number: int
 
 
class PriimusMenu:
    def __init__(self) -> None:
        self.__data: ListedMenu | None = None
        self.__last_refresh: int = 0
        pass
 
    async def refresh_data(self) -> None:
        content = await self.__get_page()
        self.__parse_page(content)
 
    async def get_menu(self) -> ListedMenu | None:
        if not self.__data or time.time() - self.__last_refresh > 3*60*60:
            response = await self.__get_page()
            self.__data = self.__parse_page(response)
 
        return self.__data
    
    def get_today(self) -> Days:
        return get_args(Days)[min(datetime.datetime.now().weekday(), 4)]
 
    async def get_days_menu(self, day: Days, week_number: int | None = None) -> DayMenu | None:
        """
        Args:
            day (Days): viikon päivä (esim. Maanantai, Tiistai...)
            week_number (int | None, optional): viikon numero, jos annettu, funktio tarkistaa, onko ruokalistaa päivitetty tälle viikolle. Jos ei ole, palauttaa None
 
        Returns:
            DayMenu | None: ruokalista tai ei mitään jos virhe
        """
 
        data = await self.get_menu()
        if not data:
            return None
        
        if week_number and data.week_number != week_number:
            return None
        
        for menu in data.menus:
            if menu.day != day: continue
            return menu
 
    def __parse_page(self, content: str) -> ListedMenu | None: # huom: jos ongelmia, ota printit takas, auttaa varmasti paljon
        soup = BeautifulSoup(content)
        menu_container: Tag | None = soup.select_one("#block-gradia-content > article > div.l-article__content.l-article__content--page > div.field--item")
 
        if menu_container is None:
            print("ÄÄH")
            return None
        
        week_info: Tag | None = menu_container.select_one("p > strong")
        
        if week_info is None or "Vko" not in week_info.text:
            print("Ruokalista viikkonumero ei annettu")
            return None
 
        week_number: int = -1
        try:
            week_number = int(week_info.get_text().split(" ")[1].replace(",", ""))
        except ValueError as _:
            print(f"Viikkonumeron parse epäonnostui, teksti: `{week_info.get_text()}`",)
 
        menu_items: List[Tag] | None = menu_container.select("p")
 
        menu_days: ListedMenu = ListedMenu([], week_number)
        
        for item in menu_items:
            day_el: Tag | None = item.select_one("strong:last-of-type")
 
            if not day_el:
                # print("Couldnt find for: " + repr(item))
                continue
            
            day: Days = day_el.get_text() # type: ignore
            if day not in get_args(Days):
                # print(f"Day {day} isnt real")
                continue
 
            food_items: List[str] = []
 
            for child in item.children:
                text = child.get_text()
                if len(text) < 1:
                    continue
 
                if text.strip().rstrip() in get_args(Days): continue
                if text.startswith(("Vko", "Klo")): continue
 
                food_items.append(text)
 
            menu_days.menus.append(DayMenu(day, food_items))
        return menu_days
 
    async def __get_page(self) -> str:
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get("https://www.gradia.fi/ravintola-priimus/opiskelija-ja-henkilostolounas") as resp:
                    return await resp.text()
            except Exception as e:
                print(e)
                return ""
            
## SPECIAL THANKS FOR THIS CODE: ONNI N. (L25C)