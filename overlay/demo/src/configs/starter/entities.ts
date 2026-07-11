import type { DemoConfig } from "../types";

export const demoEntitiesStarter: DemoConfig["entities"] = (localize) => [
  {
    entity_id: "media_player.living_room_nest_mini",
    state: "playing",
    attributes: {
      device_class: "speaker",
      volume_level: 0.35,
      is_volume_muted: false,
      media_content_type: "music",
      media_title: "I Wasn't Born To Follow",
      media_artist: "The Byrds",
      media_album_name: "The Notorious Byrd Brothers",
      friendly_name: localize(
        "ui.panel.page-demo.config.sections.entities.media_player.living_room_nest_mini"
      ),
      entity_picture: "/assets/sections/images/media_player_family_room.jpg",
      supported_features: 64063,
    },
  },
];
