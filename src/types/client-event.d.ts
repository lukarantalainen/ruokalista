import { Events, MessageFlags, type Interaction } from "discord.js";

export interface ClientEvent {
  name: string;
  once: boolean;
  execute: (...args: any) => Promise<void>;
}
