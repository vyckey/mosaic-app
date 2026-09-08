# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v58.0.0/ before writing any code.

---

## Architecture Overview

Mosaic is a React Native / Expo app with a layered component architecture. Understanding the layering is essential — each layer has a strict responsibility and dependencies flow downward only.

### Layer Hierarchy (bottom → top)

```
design/          → Raw color palette (immutable constants)
  ↓
theme/           → Design tokens: colors, typography, spacing, radius, shadows (light + dark)
  ↓
components/ui/   → Gluestack UI primitives (generic, theme-aware, no business logic)
  ↓
components/mosaic/ → Custom design system components (built on theme + gluestack, app-specific patterns)
  ↓
features/        → Feature screens & business logic (today, timeline, diary, create, moment, me, chat)
  ↓
app/             → Expo Router file-based routing (wires features into navigation)
```

### Layer Responsibilities

#### 1. `src/design/` — Color Palette
- Raw hex color constants only
- No tokens, no themes — just the palette
- Referenced by `theme/` to build semantic tokens

#### 2. `src/theme/` — Design Tokens
- **Types** (`types.ts`): `Theme`, `ThemeColors`, `ThemeTypography`, `ThemeSpacing`, `ThemeRadius`, `ThemeShadows`
- **Tokens**: `colors.ts` (semantic color mapping), `typography.ts`, `spacing.ts`, `radius.ts`
- **Themes**: `light.ts`, `dark.ts` — full `Theme` objects
- **Hooks**: `useTheme()` returns the current `Theme` based on color scheme
- All components consume tokens from `useTheme()` — never hardcode colors/spacing/typography

#### 3. `src/components/ui/` — Gluestack UI Primitives
- Generic, reusable UI building blocks: `Button`, `Card`, `Calendar`, `Icon`, `Modal`, `Select`, `Avatar`, `Menu`, `Text`, `Collapsible`
- Theme-aware via `gluestack-ui-provider/`
- No business logic, no feature knowledge
- Config in `gluestack-ui-provider/config.tsx`

#### 4. `src/components/mosaic/` — Design System Components
- App-specific composite components built on `theme/` + `components/ui/`
- 26 components: `MosaicButton`, `MosaicCard`, `MosaicText`, `MosaicChip`, `MosaicInput`, `MosaicTextArea`, `MosaicTagBar`, `MosaicSheet`, `MosaicScreen`, `MosaicScreenHeader`, `MosaicSectionHeader`, `MosaicList`, `MosaicListRow`, `MosaicSearchBar`, `MosaicInputBar`, `MosaicPressable`, `MosaicProgress`, `MosaicStat`, `MosaicBarChart`, `MosaicIcon`, `MosaicIconBadge`, `MosaicIconButton`, `MosaicChipGroup`, `MosaicDivider`, `MosaicSection`
- All consume `useTheme()` for tokens
- Export barrel: `components/mosaic/index.tsx`

#### 5. `src/features/` — Feature Modules
- Each feature is a self-contained module with its own screen, components, types, and mock data
- Features: `today/`, `timeline/`, `diary/`, `create/`, `moment/`, `me/`, `chat/`
- Features compose `mosaic/` components — never use `ui/` directly in features
- Business logic, data fetching, and feature-specific types live here

#### 6. `src/app/` — Expo Router
- File-based routing: `(tabs)/` for tab navigation, individual files for modal/stack screens
- `_layout.tsx` wraps the app with `I18nProvider` and `GluestackUIProvider`
- Routes: `/today`, `/timeline`, `/chat`, `/me` (tabs), `/create`, `/diary`, `/moment`, `/login` (stack)

### Cross-Cutting Concerns

| Concern | Location | Notes |
|---------|----------|-------|
| i18n | `src/i18n/` | `i18n-js` + React Context. Hook: `useI18n()` → `{ locale, setLocale, t }`. Locales: `en`, `zh-CN` |
| Theme | `src/theme/` + `src/hooks/use-theme.ts` | `useTheme()` returns full `Theme` object |
| Color Scheme | `src/hooks/use-color-scheme.ts` | Handles light/dark/system |
| Constants | `src/constants/` | Layout constants |

### File Structure

```
src/
├── app/                    # Expo Router routes
│   ├── _layout.tsx         # Root layout (providers)
│   ├── (tabs)/             # Tab navigation
│   │   ├── _layout.tsx     # Tab bar config
│   │   ├── today.tsx
│   │   ├── timeline.tsx
│   │   ├── chat.tsx
│   │   └── me.tsx
│   ├── create.tsx          # Modal/stack screens
│   ├── diary.tsx
│   ├── moment.tsx
│   └── login.tsx
├── components/
│   ├── mosaic/             # Design system (26 components)
│   │   ├── index.tsx       # Barrel export
│   │   ├── MosaicButton.tsx
│   │   ├── MosaicCard.tsx
│   │   ├── MosaicText.tsx
│   │   └── ...
│   ├── ui/                 # Gluestack primitives
│   │   ├── gluestack-ui-provider/
│   │   ├── button/
│   │   ├── card/
│   │   ├── calendar/
│   │   ├── icon/
│   │   ├── modal/
│   │   └── ...
│   ├── app-tabs/           # Tab bar components
│   └── ...
├── design/                 # Raw color palette
├── theme/                  # Design tokens + themes
│   ├── types.ts            # Theme type definitions
│   ├── light.ts            # Light theme
│   ├── dark.ts             # Dark theme
│   ├── colors.ts           # Semantic color mapping
│   ├── typography.ts       # Font tokens
│   ├── spacing.ts          # Spacing tokens
│   └── radius.ts           # Radius tokens
├── features/               # Feature modules
│   ├── today/
│   ├── timeline/
│   ├── diary/
│   ├── create/
│   ├── moment/
│   ├── me/
│   └── chat/
├── hooks/                  # Shared hooks
│   ├── use-theme.ts
│   └── use-color-scheme.ts
├── i18n/                   # Internationalization
│   ├── index.ts            # i18n-js instance
│   ├── context.tsx         # I18nProvider
│   ├── useI18n.ts          # useI18n() hook
│   └── locales/
│       ├── en.ts
│       └── zh-CN.ts
└── constants/              # App constants
```

### Key Conventions

- **Styling**: Tailwind CSS via `className` (NativeWind). Design tokens via `useTheme()` for dynamic values (shadows, colors that need JS access)
- **Components**: Always use `mosaic/` components in features. Only use `ui/` primitives inside `mosaic/` components
- **Theming**: Never hardcode colors. Use `useTheme()` or Tailwind classes mapped to theme tokens
- **i18n**: All user-facing strings via `t()` from `useI18n()`. Translation keys in `src/i18n/locales/`
- **Types**: Feature-specific types in `features/<name>/types.ts`. Shared types in `components/mosaic/` or `theme/`
- **Comments**: Always write code comments (inline comments and JSDoc/doc blocks) in English
