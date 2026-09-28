import fs from "node:fs"
import path from "node:path"
import { Client, Events, GatewayIntentBits, Collection, MessageFlags } from "discord.js";
import type { Interaction } from "discord.js";
import dotenv from "dotenv";
import type { ClientEvent } from "./types/client-event.js";

dotenv.config()

const token = process.env.DISCORD_TOKEN

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const foldersPath = path.join(import.meta.dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

const eventsPath = path.join(import.meta.dirname, "events");
const eventFiles = fs.readdirSync(eventsPath);

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event: ClientEvent = await import(filePath);

	if (event.once) {
		client.once(event.name, (...args: any[]) => event.execute(...args));
	} else {
		client.on(event.name, (...args: any[]) => event.execute(...args));
	}
}

client.login(token);
