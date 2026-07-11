import type { DemoConfig } from "../types";
import { demoEntitiesStarter } from "./entities";
import { demoLovelaceStarter } from "./lovelace";

export const demoStarter: DemoConfig = {
  authorName: "Home Assistant",
  authorUrl: "https://github.com/home-assistant/frontend",
  name: "Starter demo",
  lovelace: demoLovelaceStarter,
  entities: demoEntitiesStarter,
  theme: () => ({}),
};
