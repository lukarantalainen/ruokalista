import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { loadButtons, loadCommands, loadEvents } from "./loaders.js";

dotenv.config()

const token = process.env.DISCORD_TOKEN

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

loadCommands(client);
loadButtons(client);
loadEvents(client);

client.login(token);
