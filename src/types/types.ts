export enum Day {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday, 
  None
}

export class MenuItem {
  mealtype: string = "None";
  mealname: string = "None";

  constructor(mealtype: string, mealname: string) {
    this.mealtype = mealtype;
    this.mealname = mealname;
  }
}

export class MenuDay {
  day: Day = Day.None;
  items: Array<MenuItem> = [];

  constructor(day: number) {
    this.day = day;
  }

  public push(item: MenuItem): void {
    this.items.push(item);
  }
}
