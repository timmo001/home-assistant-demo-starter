import type { DemoConfig } from "../types";

export const demoLovelaceStarter: DemoConfig["lovelace"] = (localize) => ({
  title: "Home Assistant Demo",
  views: [
    {
      type: "sections",
      title: "Demo",
      path: "home",
      icon: "mdi:home-assistant",
      sections: [
        {
          cards: [
            {
              type: "heading",
              heading: localize(
                "ui.panel.page-demo.config.sections.titles.living_room"
              ),
              icon: "mdi:sofa",
            },
            {
              type: "tile",
              entity: "media_player.living_room_speaker",
              show_entity_picture: true,
            },
          ],
        },
      ],
    },
  ],
});
