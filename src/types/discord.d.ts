import { Collection } from "discord.js";
import type { Command } from "./command.js";

declare module "discord.js" {
  interface Client {
    buttons: Collection<string, Button>;
    commands: Collection<string, Command>;
  }
}
