import random
from typing import TypedDict

import discord
import discord.ext
import discord.ext.commands
from discord import app_commands
from discord.ext import commands


# Name according to your cog (e.g a random number generator -> RandomNumber)
class Example(commands.Cog):
    # __init__ method is required with these exact parameters
    def __init__(
        self, bot: discord.ext.commands.Bot
    ):  # type hinting (aka : discord.ext.commands.Bot) isn't necessary, but provides better intellisense in code editors
        self.bot: discord.ext.commands.Bot = bot

    # a basic ping slash command which utilizes embeds
    @commands.hybrid_command()
    async def ping(self, ctx: commands.Context):

        example_embed = discord.Embed(
            title="Pong!!",
            description="The Beretta fires fast and won't make you feel any better!",
            color=discord.Color.blue(),
        )
        example_embed.set_footer(
            text=f"Requested by {ctx.author.name}",
            icon_url=ctx.author.display_avatar,
        )

        await ctx.send(embed=example_embed)



async def setup(bot):
    await bot.add_cog(Example(bot))
