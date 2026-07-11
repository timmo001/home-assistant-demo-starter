import type { LocalizeFunc } from "../../../src/common/translations/localize";
import type { LovelaceInfo } from "../../../src/data/lovelace/resource";
import type { MockHomeAssistant } from "../../../src/fake_data/provide_hass";
import { selectedDemoConfig } from "../configs/demo-configs";
import { mapEntities } from "./entities";

export const mockLovelace = (
  hass: MockHomeAssistant,
  localizePromise: Promise<LocalizeFunc>
) => {
  hass.mockWS("lovelace/config", ({ url_path }) => {
    if (url_path === "map") {
      hass.addEntities(mapEntities());
      return {
        strategy: {
          type: "map",
        },
      };
    }
    return Promise.all([selectedDemoConfig, localizePromise]).then(
      ([config, localize]) => config.lovelace(localize)
    );
  });

  hass.mockWS("lovelace/info", () =>
    Promise.resolve({ resource_mode: "storage" } as LovelaceInfo)
  );
  hass.mockWS("lovelace/config/save", () => Promise.resolve());
  hass.mockWS("lovelace/resources", () => Promise.resolve([]));
  hass.mockWS("lovelace/dashboards/list", () => Promise.resolve([]));
};
