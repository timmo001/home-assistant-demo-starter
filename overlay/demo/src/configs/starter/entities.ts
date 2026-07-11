import type { DemoConfig } from "../types";

export const demoEntitiesStarter: DemoConfig["entities"] = (localize) => [
  {
    entity_id: "media_player.living_room_speaker",
    state: "playing",
    attributes: {
      device_class: "speaker",
      volume_level: 0.35,
      is_volume_muted: false,
      media_content_type: "music",
      media_title: "Sample Track",
      media_artist: "Sample Artist",
      media_album_name: "Sample Album",
      friendly_name: localize("ui.components.media-browser.media_player"),
      entity_picture: "/assets/starter/sample-album.svg",
      supported_features: 64063,
    },
  },
];
