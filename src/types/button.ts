import { ButtonBuilder } from "discord.js";
import { formatDate } from "../utils.js";

export interface ButtonInterface {
  name: string;
  execute: (...args: any) => Promise<void>;  
}

export class Button extends ButtonBuilder {
  name: string;
  constructor(name: string) {
    super();
    this.name = name;
    this.setCustomId(name);
  };

  setDate(date: Date): Button {
    const dateStr = formatDate(date);
    const id = `${this.name}:${dateStr}`;
    this.setCustomId(id);
    return this;
  }

  incrementDay(): Button {
    let date = new Date();
    if (date.getDay() < 4) {
      date.setDate(date.getDate() + 1);
    }

    const dateStr = formatDate(date);
    const id = `${this.name}:${dateStr}`;
    this.setCustomId(id);
    return this;
  }

  decrementDay(): Button {
    let date = new Date();
    if (0 < date.getDay()) {
      date.setDate(date.getDate() + 1);
    }

    const dateStr = formatDate(date);
    const id = `${this.name}:${dateStr}`;
    this.setCustomId(id);
    return this;
  }
}
