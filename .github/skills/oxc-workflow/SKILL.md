---
name: oxc-workflow
description: 'Use when migrating from Biome/ESLint/Prettier to Oxc, maintaining oxlint + oxfmt configs, updating lint-staged/husky/CI, or fixing lint and formatting regressions.'
argument-hint: 'Describe the migration goal, constraints, and target files.'
---

# Oxc Workflow Skill

## When to use

- Migrate quality tooling to `oxlint` and `oxfmt`
- Create or adjust `.oxlintrc.json` and `.oxfmtrc.json`
- Align `package.json` scripts, `lint-staged`, and Husky hooks
- Build CI for lint/format/typecheck/build gates
- Batch-fix violations after a ruleset change

## Procedure

1. Check current scripts and CI entries for legacy tool references.
2. Update `package.json` scripts to include `lint`, `lint:fix`, `lint:fix:unsafe`, `format`, `format:check`, and optional `quality`.
3. Ensure `lint-staged` runs `oxlint --fix` and `oxfmt` for code files.
4. Add/update `.oxlintrc.json` and `.oxfmtrc.json`.
5. Run dependency install and execute lint, format check, type check, and build.
6. Apply safe auto-fixes first, then minimal manual fixes for remaining errors.
7. Keep CI workflow consistent with local commands.

## Validation checklist

- `bun run lint` passes
- `bun run format:check` passes
- `bun run check` passes
- `bun run build` passes
- No remaining `biome` command in tracked config files

## References

- [Oxc Quality Reference](./references/quality-workflow.md)
