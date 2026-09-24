/**
 * The one place the bank file locations are written down.
 *
 * They were previously duplicated in `vite.config.ts` and
 * `scripts/validate-content.ts`. Renaming the fixture directory failed loudly in
 * both, but renaming or moving the *real* bank and updating only the Vite config
 * did not: the validator's `existsSync` check would go false, the provenance
 * rules would report themselves skipped, and the script would exit zero. From
 * increment 8 that would ship unchecked questions past a green gate.
 *
 * These are relative fragments rather than resolved absolute paths on purpose.
 * Vite bundles its config before executing it, so `import.meta.dirname` inside a
 * module the config imports cannot be trusted to point at the repository root.
 * Each consumer resolves these against a root it knows for itself.
 *
 * One duplicate remains and cannot be removed: `tsconfig.app.json` maps `@bank`
 * to the fixture bank for the compiler, and a JSON config cannot import this.
 * Renaming the fixture directory means editing here and there.
 */

export const fixtureBankRelativePath = 'src/content/fixtures/index.ts'

export const realBankRelativePath = 'src/content/rounds/index.ts'
