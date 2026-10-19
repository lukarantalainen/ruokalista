import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { loadButtons, loadCommands, loadEvents } from "./loaders.js";
import { Lyseo } from "./types/types.js";

dotenv.config()

const token = process.env.DISCORD_TOKEN

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.lyseo = new Lyseo();

loadCommands(client);
loadButtons(client);
loadEvents(client);

client.login(token);
