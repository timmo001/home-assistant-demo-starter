import { spawn, spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "vendor/frontend");
const overlay = join(root, "overlay");
const workRoot = join(root, "work");
const work = join(workRoot, "frontend");
const nextWork = join(workRoot, "frontend-next");
const frontendPackage = join(source, "package.json");
const yarnRelease = ".yarn/releases/yarn-4.17.0.cjs";

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const run = (command, args, options = {}) =>
  new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? root,
      env: { ...process.env, ...options.env },
      stdio: "inherit",
    });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`${command} exited after receiving ${signal}`));
      } else if (code === 0) {
        resolvePromise();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
  });

const runYarn = (...args) =>
  run(process.execPath, [join(work, yarnRelease), ...args], {
    cwd: work,
    env: {
      SKIP_FETCH_NIGHTLY_TRANSLATIONS:
        process.env.SKIP_FETCH_NIGHTLY_TRANSLATIONS ?? "true",
    },
  });

const runYarnInCi = (...args) =>
  run(process.execPath, [join(work, yarnRelease), ...args], {
    cwd: work,
    env: {
      CI: "true",
      SKIP_FETCH_NIGHTLY_TRANSLATIONS: "true",
    },
  });

const preserve = (path) => {
  const currentPath = join(work, path);
  if (!existsSync(currentPath)) {
    return;
  }
  const nextPath = join(nextWork, path);
  mkdirSync(dirname(nextPath), { recursive: true });
  rmSync(nextPath, { recursive: true, force: true });
  renameSync(currentPath, nextPath);
};

const prepare = async () => {
  if (!existsSync(frontendPackage)) {
    fail(
      "The frontend submodule is missing. Run: git submodule update --init --recursive"
    );
  }

  rmSync(nextWork, { recursive: true, force: true });
  mkdirSync(nextWork, { recursive: true });

  const archive = spawnSync(
    "git",
    ["-C", source, "archive", "--format=tar", "HEAD"],
    { maxBuffer: 512 * 1024 * 1024 }
  );
  if (archive.status !== 0) {
    fail(archive.stderr.toString());
  }
  const extract = spawnSync("tar", ["-xf", "-", "-C", nextWork], {
    input: archive.stdout,
    maxBuffer: 512 * 1024 * 1024,
  });
  if (extract.status !== 0) {
    fail(extract.stderr.toString());
  }

  cpSync(overlay, nextWork, { recursive: true, force: true });
  preserve("node_modules");
  preserve(".yarn/cache");
  preserve(".yarn/install-state.gz");
  rmSync(work, { recursive: true, force: true });
  renameSync(nextWork, work);

  await runYarn("install", "--immutable");
};

const buildResources = () =>
  runYarn(
    "gulp",
    "gen-icons-json",
    "build-translations",
    "build-locale-data",
    "gather-gallery-pages"
  );

const lint = async () => {
  await runYarn("dedupe", "--check");
  await runYarn("lint:eslint", "--quiet");
  await runYarn("lint:types");
  await runYarn("lint:lit", "--quiet");
  await runYarn("lint:prettier");
};

const build = async () => {
  await runYarn("gulp", "build-demo");
  rmSync(join(root, "dist"), { recursive: true, force: true });
  cpSync(join(work, "demo/dist"), join(root, "dist"), { recursive: true });
};

const test = () => runYarnInCi("test:e2e:demo");

const overlayFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? overlayFiles(path) : [path];
  });

const copyFormattedOverlay = () => {
  for (const sourcePath of overlayFiles(overlay)) {
    const path = relative(overlay, sourcePath);
    cpSync(join(work, path), sourcePath, { force: true });
  }
};

const command = process.argv[2];
const args = process.argv.slice(3);

try {
  switch (command) {
    case "prepare":
      await prepare();
      break;
    case "dev": {
      const controlsExistingServer = args.some((arg) =>
        ["--status", "--stop", "--logs"].includes(arg)
      );
      if (!controlsExistingServer || !existsSync(work)) {
        await prepare();
      }
      await runYarn("dev:demo", ...args);
      break;
    }
    case "build":
      await prepare();
      await build();
      break;
    case "lint":
      await prepare();
      await buildResources();
      await lint();
      break;
    case "format":
      await prepare();
      await runYarn(
        "eslint",
        "demo/src/ha-demo.ts",
        "demo/src/configs/demo-configs.ts",
        "demo/src/configs/types.ts",
        "demo/src/configs/starter/**/*.ts",
        "demo/src/stubs/lovelace.ts",
        "test/e2e/demo.spec.ts",
        "test/e2e/playwright.demo.config.ts",
        "--fix"
      );
      await runYarn(
        "prettier",
        "--write",
        "demo/src/ha-demo.ts",
        "demo/src/configs/demo-configs.ts",
        "demo/src/configs/types.ts",
        "demo/src/configs/starter/**/*.ts",
        "demo/src/stubs/lovelace.ts",
        "test/e2e/demo.spec.ts",
        "test/e2e/playwright.demo.config.ts"
      );
      copyFormattedOverlay();
      break;
    case "test":
      await prepare();
      await build();
      await test();
      break;
    case "ci":
      await prepare();
      await buildResources();
      await lint();
      await build();
      await test();
      break;
    case "install-browsers":
      if (!existsSync(work)) {
        await prepare();
      }
      await runYarn(
        "playwright",
        "install",
        ...(process.env.CI ? ["--with-deps"] : []),
        "chromium"
      );
      break;
    default:
      fail(
        "Usage: node scripts/demo.mjs <prepare|dev|build|lint|format|test|ci|install-browsers>"
      );
  }
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
