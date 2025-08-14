# Project Architecture

## Top-level folders

| Path | Purpose |
|------|---------|
| `src/features/` | Dossier par fonctionnalité métier (domain-driven) |
| `src/shared/`   | Design-system : composants UI réutilisables |
| `src/lib/`      | Fonctions utilitaires pures, helpers globaux |
| `src/styles/`   | Styles globaux / tokens Tailwind |
| `src/hooks/`    | (à créer) Hooks réutilisables non liés à une feature |

## Aliases

* `@/` ➜ `src/`

Ex. `import { QuoteForm } from '@/features/lead'`.

## Barrel files

Chaque dossier expose un `index.ts` pour importer facilement :
```ts
import { Button, Toast } from '@/shared/components';
```

## Pre-commit quality gate

* Husky + lint-staged exécutent `prettier` puis `eslint --fix` sur les fichiers modifiés.

## Build / tooling

* Vite 6 + React 18 + TypeScript strict
* Tailwind 3.4 pour le style

---

Gardez cette structure lorsque vous ajoutez de nouvelles features pour assurer la cohérence du codebase. 