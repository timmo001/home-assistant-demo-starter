import type { DemoConfig } from "./types";

export const demoConfigs: (() => Promise<DemoConfig>)[] = [
  () => import("./starter").then((module) => module.demoStarter),
];

export const selectedDemoConfigIndex = 0;

export const selectedDemoConfig = demoConfigs[selectedDemoConfigIndex]();
