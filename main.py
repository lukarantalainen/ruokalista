import discord
from discord.ext import commands
import jamixapi
import datetime
import priimusapi

from jamixapi import Dish
try:
    import ctypes

    kernel32 = ctypes.windll.kernel32 #type: ignore
    kernel32.SetConsoleMode(kernel32.GetStdHandle(-10), 0x0004)
except Exception:  # noqa: S110
    pass

import logging
from logger import GooberFormatter

logger = logging.getLogger("ruokalogger ")
logger.setLevel(logging.DEBUG)

console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)
console_handler.setFormatter(GooberFormatter())

file_handler = logging.FileHandler("log.txt", mode="w+", encoding="UTF-8")
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(GooberFormatter(colors=False))

logger.addHandler(console_handler)
logger.addHandler(file_handler)

logger.info("Starting...")

import os 
from dotenv import load_dotenv

WEEKDAYS_FI = [
    "Maanantai",
    "Tiistai",
    "Keskiviikko",
    "Torstai",
    "Perjantai",
    "Lauantai",
    "Sunnuntai",
]


def finnish_weekday_title(date_obj: datetime.datetime) -> str:
    weekday = WEEKDAYS_FI[date_obj.weekday()]
    return f"{weekday}n ruokalista, namskutarallaa 🤤"


def format_ruokalista(ruokalista) -> str:
    if not ruokalista:
        return "⚠️ Virhe: Ruokalistaa ei saatavilla."

    lines = []

    try:
        first_menu = ruokalista[0]["menuTypes"][0]["menus"][0]

        for day in first_menu.get("days", []):
            for mealoption in day.get("mealoptions", []):
                for item in mealoption.get("menuItems", []):
                    name = item.get("name", "Tuntematon")
                    description = item.get("description", "")

                    if description:
                        lines.append(f"{name} — {description}")
                    else:
                        lines.append(name)

        if not lines:
            return "⚠️ Virhe: Ruokalistaa ei löytynyt."

        return "\n".join(f"• {line}" for line in lines)

    except Exception as e:
        logger.info(f"Ruokalistan parsevirhe: {e}")
        return "⚠️ Virhe: Ruokalistan jäsentäminen epäonnistui."

def format_menu(menu: list[list[Dish]]) -> str:
    lines = []

    today = datetime.datetime.now().weekday()
    
    weekday = 0
    for day in menu:
        if (weekday == today):
            lines.append("__**" + WEEKDAYS_FI[weekday] + "**__")
        else:
            lines.append("**" + WEEKDAYS_FI[weekday] + "**")
        for meal in day:
            lines.append(f"{meal.mealtype + ": " + meal.mealname}")
        weekday += 1
        

    return "\n".join(lines)

    
class MyClient(commands.Bot):
    def __init__(self, *, intents: discord.Intents):
        super().__init__(intents=intents, command_prefix="aah")
        # self.tree = discord.app_commands.CommandTree(self)

    async def setup_hook(self):
        self.tree.add_command(
            discord.app_commands.Command(
                name="ruokalista",
                description="Voisit syödä vaikka ramitikkuja.",
                callback=self.ruoka_command,
            )
        )

        self.tree.add_command(
            discord.app_commands.Command(
                name="priimus",
                description="Onko lyseolla nyt niin paskaa ruokaa, että priimukselle pitäis lähteä?",
                callback=self.priimus_command,
            )
        )

        self.tree.add_command(
            discord.app_commands.Command(name="viikko",
                description="Koko viikon ruokalista",
                callback=self.get_week_menu,
                )
        )

        synced = await self.tree.sync()
        logger.info(f"Synced {len(synced)} commands")

    async def on_ready(self):
        await load_cogs_from_folder(self)
        logger.info(f"Logged on as {self.user}!")

    async def ruoka_command(self, interaction: discord.Interaction):
        nyt = datetime.datetime.now()
        pvm = nyt.strftime("%Y%m%d")

        paivan_ruokalista = jamixapi.get_data_today(pvm)

        ruokalista_text = format_ruokalista(paivan_ruokalista)

        embed = discord.Embed(
            title=finnish_weekday_title(nyt),
            color=0xE033FF,
        )

        embed.add_field(
            name="Pääruoka",
            value=ruokalista_text,
            inline=False
        )

        embed.set_footer(
            text="By: Jyväskylän Lyseon Lukio, L24C"
        )

        await interaction.response.send_message(embed=embed)

    async def priimus_command(self, interaction: discord.Interaction):
        await interaction.response.defer()

        p = priimusapi.PriimusMenu()
        now = datetime.datetime.now()

        menu = await p.get_days_menu(
            p.get_today(),
            now.isocalendar().week
        )

        embed = discord.Embed(
            title=finnish_weekday_title(now),
            color=0x33FFE0,
        )

        if menu is None:
            embed.title = "⚠️ Virhe"
            embed.description = "Priimuksen ruokalistaa ei saatavilla tälle päivälle."
        else:
            embed.title="🔥 Priimuksen ruokalista"
            embed.description="\n".join(f"{item}" for item in menu.items) or "⚠️ Ei ruokia saatavilla"

        embed.set_footer(
            text="By: Jyväskylän Lyseon Lukio, L24C & L25C"
        )            

        await interaction.followup.send(embed=embed)

    async def get_week_menu(self, interaction: discord.Interaction):
        await interaction.response.defer()

        today: datetime.datetime = datetime.datetime.now()

        menu: list[list[Dish]] = jamixapi.get_menu(today)

        menu_text = format_menu(menu)
        embed = discord.Embed(title="Viikon ruokalista", description=menu_text)

        if today.month == 2 and today.day == 14:
            embed.set_footer(
                text="P.S. Minä rakastan sinua!!! 😍"
            )

        await interaction.followup.send(embed=embed)

    async def priimus_get_week(self, interaction: discord.Interaction):
        await interaction.response.defer()

        

intents = discord.Intents.default()
intents.message_content = True

load_dotenv()

TOKEN = os.getenv("DISCORD_TOKEN")

if TOKEN == None:
    raise ValueError()

async def load_cogs_from_folder(bot: commands.Bot, folder_name="assets/cogs"):
    for filename in [file for file in os.listdir(folder_name) if file.endswith(".py")]:
        cog_name: str = filename[:-3]

        logger.info("loading cog")

        module_path = folder_name.replace("/", ".").replace("\\", ".") + f".{cog_name}"

        try:
            await bot.load_extension(module_path)

        except Exception as e:
            logger.error(f"hey {cog_name} {e}")


bot = MyClient(intents=intents)
bot.run(TOKEN)

