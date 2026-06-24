# Angular 21 to 22 Upgrade Guide

This guide explains how to upgrade this repo from Angular 21.1.x to Angular 22. It is a repo-specific checklist for planning and executing the upgrade; it does not perform the upgrade itself.

The current setup in this repository is:

- npm-managed dependencies with `packageManager: npm@11.6.2`
- Angular framework packages on `^21.1.0`
- `@angular/cli`, `@angular/build`, and `@angular/ssr` already aligned on 21.1.x
- SSR enabled through the Angular application builder in `angular.json`
- Vitest installed alongside the Angular unit-test builder
- TypeScript pinned to `~5.9.2`

## Before you start

1. Start from a clean working tree.

   ```powershell
   git status --short --branch
   ```

   Do not start the upgrade if `package-lock.json` or any other tracked file already has local changes. Commit, stash, or intentionally discard those changes first on the owner-approved branch.

2. Confirm you are on a feature branch created from `dev`, not `dev`, `main`, or `master`.

   ```powershell
   git branch --show-current
   ```

3. Confirm the local Node.js and npm versions.

   ```powershell
   node --version
   npm --version
   ```

4. Install the current dependencies before running migrations.

   ```powershell
   npm install
   ```

5. Capture the current validation baseline.

   ```powershell
   npm test
   npm run build
   ```

## Compatibility requirements

Angular v22 was released on June 3, 2026. As of June 24, 2026, the latest stable `@angular/core` package is `22.0.2`.

Angular 22 requires these versions:

| Package | Required version |
| --- | --- |
| Node.js | `^22.22.3 || ^24.15.0 || ^26.0.0` |
| TypeScript | `>=6.0.0 <6.1.0` |
| RxJS | `^6.5.3 || ^7.4.0` |

Repo-specific implications:

- This repo currently uses TypeScript `~5.9.2`, so the upgrade needs to move TypeScript to a compatible `6.0.x` release.
- This repo currently uses RxJS `~7.8.0`, which already satisfies Angular 22's RxJS requirement.
- Angular updates only support moving one major version at a time, so 21 to 22 is a supported direct path.

## Step-by-step upgrade process

1. Create an upgrade branch from `dev`.

   ```powershell
   git fetch origin dev
   git switch -c codex/angular-22-upgrade origin/dev
   ```

2. Confirm the working tree is still clean.

   ```powershell
   git status --short
   ```

3. Install dependencies from the existing lockfile.

   ```powershell
   npm install
   ```

4. Run the Angular major-version migration.

   ```powershell
   npx ng update @angular/cli@^22 @angular/core@^22
   ```

   Angular recommends targeting the latest patch within the major version, so this command should take the repo to the latest 22.x release that is currently available.

5. Review Angular-managed package alignment after the migration.

   Verify that these packages are on compatible 22.x versions after `ng update` completes:

   - `@angular/core`
   - `@angular/common`
   - `@angular/compiler`
   - `@angular/compiler-cli`
   - `@angular/forms`
   - `@angular/platform-browser`
   - `@angular/platform-server`
   - `@angular/router`
   - `@angular/cli`
   - `@angular/build`
   - `@angular/ssr`

6. Review the generated dependency changes.

   ```powershell
   git diff
   git status --short
   ```

7. Run the standard repo verification commands.

   ```powershell
   npm test
   npm run build
   ```

8. Smoke-test the SSR output if the build succeeds.

   ```powershell
   npm run serve:ssr:theme-switcher
   ```

   Open the local URL printed by the server and verify that the app renders without server-side errors.

## Post-upgrade verification

Before opening a pull request, confirm all of the following:

- Angular packages in `package.json` are on `22.x`.
- `package-lock.json` reflects the same Angular 22 package set.
- TypeScript is within `>=6.0.0 <6.1.0`.
- `@angular/build` and `@angular/ssr` stayed aligned with the rest of the Angular toolchain.
- `npm test` passes.
- `npm run build` passes with SSR output enabled.
- `npm run serve:ssr:theme-switcher` starts the built app successfully.
- The diff contains only upgrade-related changes.

## Troubleshooting

### Dependency conflicts

If `npm install` or `ng update` reports peer dependency conflicts, identify which package is still pinned to Angular 21 or TypeScript 5 before retrying. Prefer resolving the incompatible package version first instead of bypassing the warning.

Avoid `--force` unless the conflict is fully understood and documented. Forcing an Angular major upgrade through dependency mismatches can leave the repo in a state that installs but does not build or run.

### TypeScript 6 compatibility

Angular 22 requires TypeScript `>=6.0.0 <6.1.0`. If builds or tests fail after the TypeScript bump, inspect the compiler errors first and fix source-level type issues directly before changing compiler settings.

### SSR build issues

This repo uses SSR through the Angular application builder with these relevant settings:

- Builder: `@angular/build:application`
- Browser entry: `src/main.ts`
- Server entry: `src/main.server.ts`
- SSR entry: `src/server.ts`
- Output mode: `server`

If the browser build passes but SSR fails, check `@angular/ssr`, `@angular/build`, and `@angular/platform-server` first. Those packages should move in step with the rest of the Angular stack.

### Migration command failures

If `npx ng update @angular/cli@^22 @angular/core@^22` fails before changing files, fix the reported environment or dependency problem and rerun it.

If it fails after modifying files, inspect the partial diff before retrying. In many cases the cleanest recovery is to discard only the failed migration branch and restart from a fresh branch off `origin/dev`.

## Rollback guidance

If the upgrade attempt becomes hard to repair:

1. Save any useful logs or notes from the failed run.
2. Keep the failure isolated to the upgrade branch.
3. Create a fresh branch from `origin/dev`.
4. Re-run the migration only after the blocker is understood.

Do not try to rollback by changing shared branches directly. Keep all upgrade attempts isolated to feature branches and open a pull request only after the validation steps pass.

## References

- [Angular Update Guide](https://angular.dev/update-guide)
- [Angular `ng update` CLI docs](https://angular.dev/cli/update)
- [Angular version compatibility](https://angular.dev/reference/versions)
- [Angular versioning and releases](https://angular.dev/reference/releases)
- [Angular v22 announcement](https://blog.angular.dev/announcing-angular-v22-c52bb83a4664)
- [`@angular/core` on npm](https://www.npmjs.com/package/@angular/core)
