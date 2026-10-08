import fs from "node:fs"
import path from "node:path"
import { Client, GatewayIntentBits, Collection, ButtonBuilder } from "discord.js";
import dotenv from "dotenv";
import type { ClientEvent } from "./types/client-event.js";
import type { Button } from "./types/button.js";

dotenv.config()

const token = process.env.DISCORD_TOKEN

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.buttons = new Collection();
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

loadButtons();

client.login(token);

async function loadButtons() {

  const foldersPath = path.join(import.meta.dirname, "buttons");
  const buttonFolders = fs.readdirSync(foldersPath);

  for (const folder of buttonFolders) {
    const buttonsPath = path.join(foldersPath, folder);
    const buttonFiles = fs.readdirSync(buttonsPath);
    
    for (const file of buttonFiles) {
      const filePath = path.join(buttonsPath, file);
      const button: Button = await import(filePath);
      

      if ("name" in button && "execute" in button) {
        client.buttons.set(button.name, button);
      } else {
        console.log(`[WARNING] The button at ${filePath} is missing a required "name" or "execute" property.`);
      }
    }
  }
}
