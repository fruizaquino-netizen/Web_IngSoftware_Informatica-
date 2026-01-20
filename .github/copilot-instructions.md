# AI Coding Guidelines for SitioWebCarrera

## Architecture Overview
This is an Angular 21 standalone SPA for Universidad del Istmo's career website. Key components:
- **App Root**: Contains shared navbar and router-outlet in `src/app/app.html`
- **Pages**: Feature-specific components in `src/app/pages/` (e.g., `inicio-pages.component.ts`)
- **Shared Components**: Reusable UI in `src/app/shared/components/` (e.g., `navbar-shared.component.ts`)
- **Routing**: Defined in `src/app/app.routes.ts` with direct component imports (no lazy loading)

## Component Patterns
- Use standalone components with explicit imports
- Naming: `[feature]-pages.component.ts` for pages, `[feature]-shared.component.ts` for shared
- Template/style URLs use relative paths: `templateUrl: './component.html'`
- Minimal logic in components; prefer signals for reactive state (e.g., `signal('value')`)

## Navigation & Routing
- Routes map to page components (e.g., `path: 'quienesSomos', component: QuienesSomosPageComponent`)
- Navbar uses `RouterLink` with `[class.active-link]="isActive('/path')"` for highlighting
- Active link detection via `this.router.url === path` in navbar component

## Styling & Assets
- Bootstrap 5 integrated via CDN in `angular.json` scripts/styles
- Global styles in `src/styles.css`
- Images in `src/assets/img/` served at `/assets/img/`
- Prettier config: 100 char width, single quotes, Angular HTML parser

## Development Workflow
- **Serve**: `npm start` (ng serve) on http://localhost:4200
- **Build**: `npm run build` (ng build) outputs to `dist/`
- **Test**: `npm test` runs Vitest (not Karma) for unit tests
- **Watch**: `npm run watch` for development builds

## Code Quality
- TypeScript strict mode enabled with Angular compiler strict options
- No implicit returns, overrides, or index signature access
- Target ES2022, module preservation for tree-shaking

## Key Files
- `src/app/app.routes.ts`: Route definitions and component imports
- `src/app/shared/components/navbar/`: Navigation logic and Bootstrap menu
- `src/app/pages/*/`: Page-specific components with static content</content>
<parameter name="filePath">c:\Users\Yaaiiir\SitioWebCarrera\.github\copilot-instructions.md