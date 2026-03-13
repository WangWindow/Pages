# Pages workspace instructions

## Tooling baseline

- Use `oxlint` for code linting and `oxfmt` for formatting.
- Do not introduce Biome config or Biome scripts.
- Keep `lint-staged` tasks aligned with `oxlint --fix` and `oxfmt`.

## Quality workflow

- Local quick check: `bun run lint` + `bun run format:check`.
- Full verification: `bun run quality`.
- Before creating PRs, run: `bun run quality`.

## File and code style

- Follow `.editorconfig` and `.oxfmtrc.json`.
- Prefer safe auto-fixes first (`bun run lint:fix`).
- Use dangerous fixes only when requested (`bun run lint:fix:unsafe`).
