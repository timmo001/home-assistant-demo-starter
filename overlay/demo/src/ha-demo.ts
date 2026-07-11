import { customElement } from "lit/decorators";
import { isNavigationClick } from "../../src/common/dom/is-navigation-click";
import { navigate } from "../../src/common/navigate";
import type { MockHomeAssistant } from "../../src/fake_data/provide_hass";
import { provideHass } from "../../src/fake_data/provide_hass";
import { HomeAssistantAppEl } from "../../src/layouts/home-assistant";
import type { HomeAssistant } from "../../src/types";
import { selectedDemoConfig } from "./configs/demo-configs";
import { mockAreaRegistry } from "./stubs/area_registry";
import { mockAuth } from "./stubs/auth";
import { demoDevices } from "./stubs/devices";
import { mockDeviceRegistry } from "./stubs/device_registry";
import { mockEnergy } from "./stubs/energy";
import { energyEntities } from "./stubs/entities";
import { mockEntityRegistry } from "./stubs/entity_registry";
import { mockEvents } from "./stubs/events";
import { mockFloorRegistry } from "./stubs/floor_registry";
import { mockFrontend } from "./stubs/frontend";
import { mockIntegration } from "./stubs/integration";
import { mockLabelRegistry } from "./stubs/label_registry";
import { mockIcons } from "./stubs/icons";
import { mockHistory } from "./stubs/history";
import { mockLovelace } from "./stubs/lovelace";
import { mockMediaPlayer } from "./stubs/media_player";
import { mockPersistentNotification } from "./stubs/persistent_notification";
import { mockRecorder } from "./stubs/recorder";
import { mockSensor } from "./stubs/sensor";
import { mockSystemLog } from "./stubs/system_log";
import { mockTemplate } from "./stubs/template";
import { mockTodo } from "./stubs/todo";
import { mockTranslations } from "./stubs/translations";
import "./cloud/cloud-demo-controls";

const CONFIG_PANEL_COMMANDS = [
  "cloud/",
  "webhook/list",
  "validate_config",
  "config_entries/",
  "device_automation/",
  "entity/source",
  "blueprint/",
  "homeassistant/expose",
  "zone/list",
  "person/list",
  "network/url",
  "application_credentials/",
  "system_health/",
  "backup/",
  "automation/config",
  "script/config",
  "config/automation/config",
  "config/script/config",
  "config/scene/config",
  "search/related",
  "tag/list",
  "assist_pipeline/",
];

@customElement("ha-demo")
export class HaDemo extends HomeAssistantAppEl {
  protected async _initializeHass() {
    const config = await selectedDemoConfig;
    const initial: Partial<MockHomeAssistant> = {
      panelUrl: (this as any)._panelUrl,
      selectedTheme:
        typeof config.theme === "function"
          ? { theme: "default" }
          : config.theme,
      updateHass: (hassUpdate: Partial<HomeAssistant>) =>
        this._updateHass(hassUpdate),
    };

    const hass = provideHass(this, initial, true, false);

    hass.updateHass({
      config: {
        ...hass.config,
        components: [...(hass.config?.components ?? []), "backup", "webhook"],
      },
    });

    if (!document.querySelector("cloud-demo-controls")) {
      document.body.appendChild(document.createElement("cloud-demo-controls"));
    }
    const localizePromise =
      // @ts-ignore
      this._loadFragmentTranslations(hass.language, "page-demo").then(
        () => this.hass!.localize
      );

    mockLovelace(hass, localizePromise);
    mockAuth(hass);
    mockTranslations(hass);
    mockHistory(hass);
    mockRecorder(hass);
    mockTodo(hass);
    mockSensor(hass);
    mockSystemLog(hass);
    mockTemplate(hass);
    mockEvents(hass);
    mockMediaPlayer(hass);
    mockFrontend(hass);
    mockIcons(hass);
    mockEnergy(hass);
    mockPersistentNotification(hass);
    mockIntegration(hass);
    hass.mockLazyLoad(
      (command) => CONFIG_PANEL_COMMANDS.some((p) => command.startsWith(p)),
      () =>
        import("./stubs/config-panel").then((mod) => mod.mockConfigPanel(hass))
    );
    mockAreaRegistry(hass);
    mockDeviceRegistry(hass, demoDevices);
    mockFloorRegistry(hass);
    mockLabelRegistry(hass);
    mockEntityRegistry(hass, [
      {
        config_entry_id: "co2signal",
        config_subentry_id: null,
        device_id: "co2signal",
        area_id: null,
        disabled_by: null,
        entity_id: "sensor.co2_intensity",
        id: "sensor.co2_intensity",
        name: null,
        icon: null,
        labels: [],
        categories: {},
        platform: "co2signal",
        hidden_by: null,
        entity_category: null,
        has_entity_name: false,
        unique_id: "co2_intensity",
        options: null,
        created_at: 0,
        modified_at: 0,
      },
      {
        config_entry_id: "co2signal",
        config_subentry_id: null,
        device_id: "co2signal",
        area_id: null,
        disabled_by: null,
        entity_id: "sensor.grid_fossil_fuel_percentage",
        id: "sensor.co2_intensity",
        name: null,
        icon: null,
        labels: [],
        categories: {},
        platform: "co2signal",
        hidden_by: null,
        entity_category: null,
        has_entity_name: false,
        unique_id: "grid_fossil_fuel_percentage",
        options: null,
        created_at: 0,
        modified_at: 0,
      },
    ]);

    hass.addEntities(energyEntities());
    localizePromise.then((localize) => {
      hass.addEntities(config.entities(localize));
      if (typeof config.theme === "function") {
        hass.mockTheme(config.theme());
      }
    });

    document.body.addEventListener(
      "click",
      (e) => {
        const href = isNavigationClick(e);

        if (!href) {
          return;
        }

        e.preventDefault();
        navigate(href);
      },
      { capture: true }
    );

    (this as any).hassConnected();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-demo": HaDemo;
  }
}
