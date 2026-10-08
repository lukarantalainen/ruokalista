export interface Button {
  name: string;
  execute: (...args: any) => Promise<void>;  
}
