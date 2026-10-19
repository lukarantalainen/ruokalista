import { Collection } from "discord.js";
import type { Command } from "./command.js";
import type { Lyseo } from "./types.ts";

declare module "discord.js" {
  interface Client {
    buttons: Collection<string, Button>;
    commands: Collection<string, Command>;
    lyseo: Lyseo;
  }
}
