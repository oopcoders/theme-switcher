# Angular 21 to 22 Upgrade Guide

This guide explains how to upgrade this repo from Angular 21.1.x to Angular 22. It is a planning and execution checklist only; it does not perform the upgrade.

The current app is an npm-based Angular application with SSR enabled, Vitest tests through the Angular builder, TypeScript `~5.9.2`, Angular CLI/build packages aligned on v21, and Angular packages currently on the `21.1.x` line.

## Before you start

1. Start from a clean working tree.

   ```powershell
   git status --short --branch
   ```

   At the time this guide was created, `package-lock.json` was already modified in the local checkout. Do not start the upgrade until existing changes are committed, stashed, or intentionally discarded by their owner.

2. Confirm you are on the intended upgrade branch, not `dev`, `main`, or `master`.

   ```powershell
   git branch --show-current
   ```

3. Confirm Node and npm versions.

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

Angular v22 was announced on June 3, 2026. The latest stable `@angular/core` package observed while creating this guide was `22.0.2`.

Angular 22 requires these runtime and tooling versions:

| Package | Required version |
| --- | --- |
| Node.js | `^22.22.3 || ^24.15.0 || ^26.0.0` |
| TypeScript | `>=6.0.0 <6.1.0` |
| RxJS | `^6.5.3 || ^7.4.0` |

This repo currently uses TypeScript `~5.9.2`, so the Angular migration must update TypeScript to a compatible `6.0.x` version. The current RxJS range, `~7.8.0`, already satisfies Angular 22's RxJS requirement.

## Step-by-step upgrade process

1. Create an upgrade branch from `dev`.

   ```powershell
   git fetch origin dev
   git switch -c codex/angular-22-upgrade origin/dev
   ```

2. Confirm the working tree is clean.

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

   This command should update Angular framework packages, Angular CLI, Angular build tooling, TypeScript, and the package lock through Angular's migration system.

5. Review SSR and build package alignment.

   Check that these packages remain on compatible Angular 22 versions after the migration:

   - `@angular/ssr`
   - `@angular/build`
   - `@angular/cli`
   - `@angular/compiler-cli`
   - Angular framework packages such as `@angular/core`, `@angular/common`, `@angular/router`, `@angular/forms`, `@angular/platform-browser`, and `@angular/platform-server`

6. Review generated changes.

   ```powershell
   git diff
   git status --short
   ```

7. Run tests and the production build.

   ```powershell
   npm test
   npm run build
   ```

8. Smoke-test SSR output if the build succeeds.

   ```powershell
   npm run serve:ssr:theme-switcher
   ```

   Open the local URL printed by the server and verify the app renders without server-side errors.

## Post-upgrade verification

After the migration, verify these items before opening a pull request:

- `package.json` Angular packages are on the `22.x` line.
- `package-lock.json` reflects the same Angular 22 package set.
- TypeScript is `>=6.0.0 <6.1.0`.
- RxJS remains compatible with Angular 22.
- `npm test` passes.
- `npm run build` passes with SSR enabled.
- The SSR server starts and serves the built app.
- No unrelated formatting or feature changes are included in the diff.

## Troubleshooting

### Dependency conflicts

If npm reports peer dependency conflicts, read the conflict carefully and identify which package is still pinned to an Angular 21 or TypeScript 5 range. Prefer updating the conflicting package to a compatible release before retrying the migration.

Avoid `--force` unless the conflict is understood and documented. Forcing past peer dependency errors can leave the repo with a package set that installs but fails at build or runtime.

### TypeScript 6 compatibility

Angular 22 requires TypeScript `>=6.0.0 <6.1.0`. If tests or builds fail after the TypeScript update, inspect the compiler diagnostics first. Fix source-level type errors directly instead of relaxing compiler options unless the Angular migration guide explicitly recommends a configuration change.

### SSR build issues

This app uses the Angular application builder with server output:

- Builder: `@angular/build:application`
- Server entry: `src/main.server.ts`
- SSR entry: `src/server.ts`
- Output mode: `server`

If the browser build succeeds but SSR fails, check `@angular/ssr`, `@angular/build`, and `@angular/platform-server` versions first. They should move together with the rest of the Angular packages.

### Migration command fails

If `npx ng update @angular/cli@^22 @angular/core@^22` fails before changing files, fix the reported environment or dependency issue and rerun it.

If it fails after modifying files, inspect the partial diff before retrying. Depending on the failure, either continue from the partial migration state or reset only the migration branch and rerun from a clean branch.

## Rollback guidance

If the upgrade branch becomes hard to repair, rollback is straightforward because the upgrade should be isolated from `dev`.

1. Preserve useful logs or notes from the failed attempt.
2. Delete the failed upgrade branch if it has no useful commits.
3. Create a fresh branch from `origin/dev`.
4. Re-run the migration after resolving the blocker that caused the failure.

Do not rollback by changing shared branches directly. Keep all upgrade attempts in feature branches and open a pull request only after tests and builds pass.

## References

- [Angular Update Guide](https://angular.dev/update-guide)
- [Angular `ng update` CLI docs](https://angular.dev/cli/update)
- [Angular version compatibility](https://angular.dev/reference/versions)
- [Angular versioning and releases](https://angular.dev/reference/releases)
- [Angular v22 announcement](https://blog.angular.dev/announcing-angular-v22-c52bb83a4664)
- [`@angular/core` on npm](https://www.npmjs.com/package/@angular/core)
