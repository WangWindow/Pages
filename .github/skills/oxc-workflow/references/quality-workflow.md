# Oxc quality workflow reference

## Canonical scripts

- `bun run lint`: run `oxlint` checks
- `bun run lint:fix`: apply safe fixes
- `bun run lint:fix:unsafe`: apply suggestions and dangerous fixes only when explicitly requested
- `bun run format`: run `oxfmt` write mode
- `bun run format:check`: verify formatting in CI/local checks
- `bun run quality`: lint + format check + astro check + build

## CI order

1. Install dependencies with lockfile
2. Run lint
3. Run format check
4. Run type check
5. Run build

## Common migration notes

- Replace tool-specific ignore comments with neutral comments or `oxlint-disable` directives.
- Avoid reintroducing Biome config files.
- Keep ignore patterns aligned across lint/format config and repository conventions.
