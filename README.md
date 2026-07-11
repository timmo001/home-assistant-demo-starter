# Home Assistant demo starter

A static Home Assistant frontend demo with mocked entities and no Home Assistant server. It builds on the official [`home-assistant/frontend`](https://github.com/home-assistant/frontend) demo and renders a focused sections dashboard containing a heading card and an image tile card.

Licensed under the Apache License 2.0. The pinned Home Assistant frontend source retains its own licence and notices under `vendor/frontend`.

## Requirements

- Git
- Node.js matching `vendor/frontend/.nvmrc`
- Yarn
- `tar`

## Setup

Clone with the frontend submodule:

```bash
git clone --recurse-submodules <repository-url>
cd home-assistant-demo-starter
yarn prepare:demo
```

For an existing clone without submodules:

```bash
git submodule update --init --recursive
```

## Development

Start the frontend demo at <http://localhost:8090>:

```bash
yarn dev
```

The upstream development server also supports background controls:

```bash
yarn dev --background
yarn dev --status
yarn dev --logs --follow
yarn dev --stop
```

Build the static demo into `dist/`:

```bash
yarn build
```

Run the frontend lint suite:

```bash
yarn lint
```

Install Chromium once, then run the desktop and mobile smoke tests:

```bash
yarn playwright:install
yarn test
```

## Customisation

Files under `overlay/` replace files in an ignored working copy of the frontend submodule:

- `overlay/demo/src/configs/starter/entities.ts` defines mocked entities.
- `overlay/demo/src/configs/starter/lovelace.ts` defines the dashboard.
- `overlay/demo/src/configs/demo-configs.ts` selects the starter dashboard only.
- `overlay/demo/src/stubs/lovelace.ts` removes the upstream dashboard switcher.
- `overlay/test/e2e/demo.spec.ts` verifies the assembled demo.

The build uses Home Assistant's existing image at `demo/public/assets/sections/images/media_player_family_room.jpg`. Add further static assets beneath `overlay/demo/public/assets/` and reference them from mocked entity attributes or dashboard cards.

The assembly script exports the pinned frontend revision into the ignored `work/frontend` directory, applies `overlay/`, and runs the upstream Yarn build there. It never modifies `vendor/frontend`.

## Updating Home Assistant frontend

Renovate is configured to update the `vendor/frontend` submodule from its `dev` branch. To update it manually:

```bash
git -C vendor/frontend fetch origin dev
git -C vendor/frontend checkout origin/dev
yarn ci
```

Review and stage the updated submodule revision only after the complete check passes.

## Validation

GitHub Actions checks repository Markdown, YAML, workflow syntax, and Renovate configuration. It then assembles the demo and runs Home Assistant frontend's ESLint, Prettier, TypeScript, and Lit checks, creates a production build, and runs Playwright in desktop and mobile Chromium.

Hassfest is intentionally not used because it validates Home Assistant integration manifests, not frontend demos.
