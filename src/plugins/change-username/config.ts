export const configList = [
  {
    key: "name",
    type: "string",
    default: "DesModder ♥",
  },
] as const;

export interface Config {
  name: string;
}
