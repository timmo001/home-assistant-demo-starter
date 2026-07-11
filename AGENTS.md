# Home Assistant Demo Starter

This repository builds a static Home Assistant frontend demo with mocked data. It does not run or connect to Home Assistant Core.

## Architecture

- `vendor/frontend/` is the pinned official Home Assistant frontend Git submodule.
- `overlay/` contains the maintained dashboard, mocked entities, Lovelace stub, and browser tests.
- `scripts/demo.mjs` exports the submodule into `work/frontend/`, applies the overlay, and runs the upstream toolchain.
- `dist/` contains the generated static site.
- `work/`, `.work/`, `dist/`, and `node_modules/` are generated or cached and must not be committed.

Do not edit `vendor/frontend/`, `work/frontend/`, or `dist/` directly. Make demo changes under `overlay/`.

## Commands

Run commands from the repository root.

```bash
git submodule update --init --recursive
yarn prepare:demo
yarn dev
yarn build
yarn lint
yarn playwright:install
yarn test
yarn renovate:validate
```

`yarn dev` serves the demo at <http://localhost:8090>. It supports `--background`, `--status`, `--logs --follow`, and `--stop`.

## Editing

- Dashboard configuration: `overlay/demo/src/configs/starter/lovelace.ts`
- Mocked entities: `overlay/demo/src/configs/starter/entities.ts`
- Demo selection: `overlay/demo/src/configs/demo-configs.ts`
- Lovelace API mock: `overlay/demo/src/stubs/lovelace.ts`
- Browser test: `overlay/test/e2e/demo.spec.ts`

Follow Home Assistant frontend conventions for TypeScript, Lit, Lovelace configuration, localisation, and formatting. Avoid `any`, unsafe assertions, and direct edits to generated output.

## Validation

For dashboard or entity changes, run:

```bash
yarn lint
yarn build
yarn test
```

The production build is large and may take several minutes. Playwright covers desktop Chromium and a Pixel 7 viewport.

Hassfest is not applicable because this repository contains no Home Assistant integration manifests.

## Dependencies

Renovate updates GitHub Actions and the `vendor/frontend` submodule. A frontend submodule update must pass the full lint, build, and browser test sequence before it is accepted.
