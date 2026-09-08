# Mosaic UI Architecture

## 1. 概述

Mosaic 使用：

- React Native
- Gluestack UI
- TypeScript

UI 架构采用 **Design Tokens → Mosaic Components → Feature Components → Screens** 的分层方式。

核心原则：

> **Gluestack UI 提供基础 UI 能力，Mosaic Design System 定义产品视觉语言，业务组件负责表达业务语义，Screen 负责组合。**

Mosaic 的视觉目标是：

- 柔和
- 松弛
- 温暖
- 舒适
- 有生活感
- 低视觉压力

因此 UI 不应该呈现传统 SaaS、后台管理系统或强科技产品的视觉特征。

---

# 2. 架构总览

```text
                    ┌─────────────────────┐
                    │    Design Tokens    │
                    │                     │
                    │ colors              │
                    │ typography          │
                    │ spacing             │
                    │ radii               │
                    │ shadows             │
                    └──────────┬──────────┘
                               │
                               ↓
                    ┌─────────────────────┐
                    │   Gluestack Theme   │
                    │      / Config       │
                    └──────────┬──────────┘
                               │
                               ↓
                    ┌─────────────────────┐
                    │ Mosaic Components   │
                    │                     │
                    │ MosaicButton        │
                    │ MosaicInput         │
                    │ MosaicCard          │
                    │ MosaicAvatar        │
                    │ MosaicBadge         │
                    │ MosaicModal         │
                    └──────────┬──────────┘
                               │
                               ↓
                    ┌─────────────────────┐
                    │ Feature Components  │
                    │                     │
                    │ RecordCard          │
                    │ RecordList          │
                    │ ProfileHeader       │
                    │ ...                 │
                    └──────────┬──────────┘
                               │
                               ↓
                    ┌─────────────────────┐
                    │       Screens       │
                    │                     │
                    │ LoginScreen         │
                    │ HomeScreen          │
                    │ RecordScreen        │
                    │ ProfileScreen       │
                    └─────────────────────┘
```

依赖方向必须保持：

```text
Screens
   ↓
Feature Components
   ↓
Mosaic Components
   ↓
Gluestack UI
   ↓
React Native
```

Design Tokens 作为基础设计资源，被 Gluestack Theme 和 Mosaic Components 使用。

---

# 3. 目录结构

推荐目录：

```text
src/
├── design/
│   ├── colors.ts
│   ├── spacing.ts
│   ├── radii.ts
│   ├── typography.ts
│   ├── shadows.ts
│   └── theme.ts
│
├── components/
│   ├── Button/
│   │   ├── MosaicButton.tsx
│   │   └── index.ts
│   │
│   ├── Input/
│   │   ├── MosaicInput.tsx
│   │   └── index.ts
│   │
│   ├── Card/
│   │   ├── MosaicCard.tsx
│   │   └── index.ts
│   │
│   ├── Avatar/
│   ├── Badge/
│   ├── Modal/
│   ├── Toast/
│   └── index.ts
│
├── features/
│   ├── record/
│   │   ├── components/
│   │   │   ├── RecordCard.tsx
│   │   │   └── RecordList.tsx
│   │   └── ...
│   │
│   ├── auth/
│   ├── profile/
│   └── ...
│
├── screens/
│   ├── Auth/
│   │   ├── LoginScreen.tsx
│   │   └── ...
│   │
│   ├── Home/
│   ├── Record/
│   └── Profile/
│
└── app/
    ├── App.tsx
    └── navigation/
```

---

# 4. Design Tokens

`design/` 是整个 UI 系统的视觉基础。

它回答的是：

> Mosaic 应该长什么样？

而不是：

> 某个页面应该怎么实现？

---

## 4.1 Colors

推荐使用语义化命名，而不是颜色等级命名。

推荐：

```ts
export const colors = {
  background: '#FAF9F6',
  surface: '#FFFFFF',
  surfaceSecondary: '#F3F1EB',

  primary: '#7C927B',
  primarySoft: '#E7EDE4',

  text: '#383833',
  textSecondary: '#85847C',
  textMuted: '#AAA89F',

  border: '#E7E4DC',

  accent: '#D6A477',

  error: '#C97970',
  errorSoft: '#F7EAE7',
} as const;
```

避免：

```ts
green500;
green600;
gray100;
gray200;
blue500;
```

原因是颜色是视觉实现，而 `primary`、`textSecondary` 等是产品语义。

例如未来品牌色从绿色调整为蓝灰色：

```ts
primary: '#718797';
```

业务代码不需要改变。

---

# 5. Spacing

```ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;
```

Mosaic 应该使用充足的留白。

推荐：

```text
Screen padding      20~24
Item spacing        16~24
Section spacing     32~48
```

视觉上应该优先使用 spacing 建立层级，而不是大量 Divider 和 Border。

---

# 6. Radius

Mosaic 的视觉语言偏柔和，因此圆角应该比传统企业 UI 更明显。

```ts
export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;
```

推荐：

```text
Input       12~14
Button      14~20
Card        18~24
Modal       24
Avatar      full
Badge       full
```

---

# 7. Typography

字体层级应该保持克制。

```ts
export const typography = {
  display: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '600',
  },

  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600',
  },

  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },

  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },

  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },

  small: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
} as const;
```

避免页面中过度使用：

```text
font-weight: 700
font-weight: 800
```

Mosaic 更强调内容本身，而不是通过粗体制造视觉冲击。

---

# 8. Gluestack Theme

Design Tokens 应该映射到 Gluestack 的 theme/config。

逻辑关系：

```text
design/colors.ts
        ↓
design/theme.ts
        ↓
Gluestack config
        ↓
Mosaic Components
```

例如：

```ts
export const theme = {
  colors: {
    background: colors.background,
    surface: colors.surface,
    surfaceSecondary: colors.surfaceSecondary,

    primary: colors.primary,
    primarySoft: colors.primarySoft,

    text: colors.text,
    textSecondary: colors.textSecondary,
    textMuted: colors.textMuted,

    border: colors.border,

    error: colors.error,
    errorSoft: colors.errorSoft,
  },

  spacing,

  radii,
};
```

具体 Gluestack 配置 API 应以项目当前使用的 Gluestack UI 版本为准。

---

# 9. Mosaic Components

`components/` 是产品级 UI 组件。

它回答：

> Mosaic 中的 Button、Input、Card 应该怎么表现？

Mosaic Components 可以基于 Gluestack 组件实现。

例如：

```text
MosaicButton
      ↓
Gluestack Button
      ↓
React Native
```

---

## 9.1 为什么需要 Mosaic Components

不要让 Screen 直接写：

```tsx
<Button
  bg="$primary"
  borderRadius="$xl"
  height={52}
  px="$5"
>
```

否则视觉规则会逐渐散落到业务代码。

应该：

```tsx
<MosaicButton>Continue</MosaicButton>
```

这样：

```text
Screen
  ↓
MosaicButton
  ↓
Gluestack Button
```

UI 风格集中管理。

---

# 10. Button

Mosaic Button 应该具有以下特征：

```text
高度：48~52
圆角：14~20
低饱和 primary
弱 pressed 状态
弱 disabled 状态
无明显阴影
```

支持：

```ts
type MosaicButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  onPress?: () => void;
  disabled?: boolean;
};
```

例如：

```tsx
<MosaicButton>
  Continue
</MosaicButton>

<MosaicButton variant="secondary">
  Cancel
</MosaicButton>

<MosaicButton variant="ghost">
  Skip
</MosaicButton>
```

---

# 11. Input

Input 应该弱化传统表单的「系统感」。

推荐：

```text
background: surfaceSecondary
border: subtle
radius: 12~14
height: 48~52
focus: primary
```

例如：

```tsx
<MosaicInput value={email} onChangeText={setEmail} placeholder="Email" />
```

Screen 不应该关心：

```text
borderColor
backgroundColor
focusColor
borderRadius
```

这些属于 MosaicInput。

---

# 12. Card

Card 是 Mosaic 中需要谨慎使用的组件。

不要默认：

```text
白色
1px border
明显 shadow
```

优先：

```text
surfaceSecondary
或
surface + subtle border
```

例如：

```tsx
<MosaicCard>
  <Text>...</Text>
</MosaicCard>
```

同时避免为了分组而滥用 Card。

很多场景应该使用：

```text
spacing
```

而不是：

```text
Card
```

---

# 13. Modal / BottomSheet

Modal 和 BottomSheet 应该保持轻盈。

推荐：

```text
radius: 24
overlay: low opacity
shadow: subtle
padding: generous
```

BottomSheet 可以使用明显的顶部圆角和 drag indicator：

```text
╭────────────────────────╮
│          ───           │
│                        │
│        Content         │
│                        │
╰────────────────────────╯
```

---

# 14. Badge / Tag

Badge 使用低饱和背景。

例如：

```text
Travel
Food
Thought
People
Work
```

可以分别使用：

```text
sage
peach
lavender
sand
warm gray
```

但颜色必须保持低饱和，不能变成传统 UI 的高亮标签。

---

# 15. Icon

Icon 应该：

- 以线性 icon 为主
- 线条圆润
- 低对比度
- 避免大量实心 icon
- active 状态使用 primary

默认 icon 不应该成为视觉焦点。

---

# 16. Divider

Mosaic 应该尽量减少 Divider。

优先：

```text
spacing
```

而不是：

```text
border
```

例如：

```text
Title

        24px

Content

        32px

Next Section
```

而不是：

```text
Title
──────────────
Content
──────────────
Next Section
```

---

# 17. Feature Components

Feature Components 表达业务概念。

例如：

```text
RecordCard
RecordList
ProfileHeader
PostPreview
MemoryItem
```

它们不应该自己重新定义视觉系统。

例如：

```tsx
function RecordCard({ record }) {
  return (
    <MosaicCard>
      <Text>{record.title}</Text>
      <Text>{record.content}</Text>
    </MosaicCard>
  );
}
```

依赖关系：

```text
RecordCard
    ↓
MosaicCard
    ↓
Gluestack
```

而不是：

```text
RecordCard
    ↓
直接写大量颜色 / radius / shadow
```

---

# 18. Screens

Screen 负责：

- 页面布局
- 数据获取
- 状态管理
- Feature Component 组合
- 页面级交互

Screen 不负责定义产品视觉规范。

例如：

```tsx
export function LoginScreen() {
  const [email, setEmail] = useState('');

  return (
    <VStack flex={1} bg="$background" px="$6" justifyContent="center" gap="$5">
      <VStack gap="$2">
        <Text color="$text" fontSize="$3xl" fontWeight="$semibold">
          Welcome back
        </Text>

        <Text color="$textSecondary" fontSize="$md">
          Continue your journey at your own pace.
        </Text>
      </VStack>

      <VStack gap="$4">
        <MosaicInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
        />

        <MosaicButton>Continue</MosaicButton>
      </VStack>
    </VStack>
  );
}
```

这里 Screen 可以直接使用 Gluestack 的布局组件：

```text
VStack
HStack
Box
Center
ScrollView
```

但具有产品视觉含义的组件优先使用 Mosaic Components。

---

# 19. 不需要包装所有 Gluestack 组件

不要创建：

```text
MosaicBox
MosaicVStack
MosaicHStack
MosaicText
MosaicScrollView
```

这样会导致 Mosaic 最终变成一个重复实现的 UI Framework。

推荐：

### 直接使用 Gluestack

```text
Box
VStack
HStack
Center
ScrollView
```

### 包装成 Mosaic Component

```text
Button
Input
Card
Avatar
Badge
Modal
Toast
```

判断标准：

> **如果组件具有明确的 Mosaic 品牌视觉，就包装。**

如果只是布局工具，就直接使用 Gluestack。

---

# 20. UI Component 分层规则

可以按照下面的规则判断一个组件应该放在哪里。

### Design

如果它回答：

> “应该是什么视觉？”

放：

```text
design/
```

例如：

```text
colors
spacing
radii
typography
shadows
```

---

### Mosaic Components

如果它回答：

> “Mosaic 的这个通用 UI 元素应该怎么表现？”

放：

```text
components/
```

例如：

```text
MosaicButton
MosaicInput
MosaicCard
MosaicAvatar
```

---

### Feature Components

如果它回答：

> “这个业务对象应该怎么展示？”

放：

```text
features/*/components/
```

例如：

```text
RecordCard
RecordList
ProfileHeader
```

---

### Screen

如果它回答：

> “这个页面如何组合？”

放：

```text
screens/
```

---

# 21. 依赖规则

推荐严格遵循：

```text
design
   ↑
components
   ↑
features
   ↑
screens
```

也就是：

```text
Screens
  can use Features
  can use Mosaic Components
  can use Gluestack layout primitives

Feature Components
  can use Mosaic Components
  can use Gluestack primitives

Mosaic Components
  can use Design Tokens
  can use Gluestack

Design
  must not depend on business
```

禁止：

```text
design → feature
design → screen

MosaicButton → Record
MosaicCard → User
MosaicInput → LoginScreen
```

基础 UI 层不能依赖业务。

---

# 22. 视觉设计原则

Mosaic 的 UI 应始终遵循以下原则。

## 22.1 低饱和

避免：

```text
Bright Blue
Bright Red
Bright Green
Pure Black
```

优先：

```text
sage
cream
sand
peach
warm gray
muted lavender
```

---

## 22.2 低对比度

不要让：

```text
border
shadow
icon
secondary text
```

产生强烈视觉冲击。

---

## 22.3 留白优先

当两个内容需要分隔时：

```text
spacing > divider
```

当一个区域需要强调时：

```text
background tone > heavy border
```

---

## 22.4 阴影克制

Mosaic 不应该大量使用：

```text
large shadow
high elevation
floating card
```

更倾向：

```text
subtle border
soft background
spacing
```

---

## 22.5 圆角统一

推荐：

```text
small       8
medium      12
large       16
button      14~20
card        18~24
modal       24
pill        full
```

避免页面中同时出现大量不同的 radius。

---

# 23. 一个完整的数据流

以 Login 为例：

```text
colors.ts
   │
   ↓
theme.ts
   │
   ↓
Gluestack Config
   │
   ├───────────────┐
   ↓               ↓
MosaicInput    MosaicButton
   │               │
   ↓               ↓
Gluestack       Gluestack
   │               │
   └───────┬───────┘
           ↓
      LoginScreen
```

如果未来把品牌主色从：

```text
#7C927B
```

调整成：

```text
#718797
```

只需要修改：

```text
design/colors.ts
```

如果 Button 的圆角从：

```text
16
```

调整成：

```text
20
```

只需要修改：

```text
components/Button/MosaicButton.tsx
```

LoginScreen 不需要修改。

---

# 24. Architecture Goal

最终目标不是建立一个庞大的 UI Framework。

而是建立一个稳定的视觉边界：

```text
             Business
                │
                ↓
          Feature Components
                │
                ↓
        ┌──────────────────┐
        │ Mosaic UI System  │
        │                  │
        │ Button           │
        │ Input            │
        │ Card             │
        │ Avatar           │
        │ Badge            │
        │ Modal            │
        └────────┬─────────┘
                 │
                 ↓
          Design Tokens
                 │
                 ↓
            Gluestack
                 │
                 ↓
          React Native
```

Mosaic 的业务代码只需要表达：

> **我要什么。**

而 Mosaic UI System 负责决定：

> **它应该长什么样。**

这样可以在不修改业务逻辑的情况下持续演进视觉设计，同时避免 Gluestack 的默认视觉风格渗透到整个产品。

# 25. Theme Architecture

Mosaic 的主题系统建立在 **Semantic Design Tokens** 之上。

主题系统负责解决两个问题：

1. 产品视觉主题是什么？
2. 当前主题处于 Light 还是 Dark 模式？

推荐结构：

```text
Theme
  │
  ├── Light
  │
  └── Dark
       │
       ↓
Semantic Tokens
       │
       ↓
Mosaic Components
       │
       ↓
Screens
```

组件不应该判断当前是 Light 还是 Dark。

组件只使用语义 Token：

```tsx
bg = '$background';
color = '$text';
borderColor = '$border';
```

而不是：

```tsx
bg={isDark ? '#1A1A18' : '#FAF9F6'}
```

---

# 26. Theme 与 Dark Mode 的职责

### Theme

Theme 定义产品的视觉语言。

例如：

```text
Mosaic
├── colors
├── typography
├── spacing
├── radii
└── shadows
```

### Color Mode

Color Mode 定义同一套视觉语言在不同明暗环境下的表现：

```text
Light
Dark
```

因此：

```text
Mosaic Theme
     │
     ├── Light
     │
     └── Dark
```

而不是建立两个完全独立的主题：

```text
Light Theme
Dark Theme
```

后者容易导致两套设计系统逐渐分叉。

---

# 27. Semantic Colors

主题颜色必须使用**语义名称**。

推荐：

```ts
background;
surface;
surfaceSecondary;

text;
textSecondary;
textMuted;

primary;
primarySoft;

accent;

border;

error;
errorSoft;
```

不要在业务代码中直接使用：

```ts
'#FAF9F6';
'#383833';
'#7C927B';
```

也不要使用：

```ts
green500;
gray900;
gray200;
```

颜色值属于 Theme，组件和业务只依赖语义。

---

# 28. Light Theme

Mosaic Light Mode 是默认主题。

```ts
export const lightColors = {
  background: '#FAF9F6',

  surface: '#FFFFFF',
  surfaceSecondary: '#F3F1EB',

  primary: '#7C927B',
  primarySoft: '#E7EDE4',

  text: '#383833',
  textSecondary: '#85847C',
  textMuted: '#AAA89F',

  border: '#E7E4DC',

  accent: '#D6A477',

  error: '#C97970',
  errorSoft: '#F7EAE7',
} as const;
```

视觉目标：

> 温暖、自然、轻盈、舒适。

页面背景不建议使用纯白：

```text
推荐：
#FAF9F6
```

而不是：

```text
#FFFFFF
```

纯白主要用于 Surface。

---

# 29. Dark Theme

Dark Mode 不是简单地把 Light Mode 的颜色取反。

禁止：

```text
Light:
#FFFFFF

Dark:
#000000
```

也不要简单执行：

```text
invert(color)
```

Dark Mode 应该重新定义一组语义颜色。

例如：

```ts
export const darkColors = {
  background: '#191A17',

  surface: '#22231F',
  surfaceSecondary: '#2A2B26',

  primary: '#9CAF97',
  primarySoft: '#344032',

  text: '#F1F0E9',
  textSecondary: '#B8B7AE',
  textMuted: '#85847C',

  border: '#383933',

  accent: '#D7A77F',

  error: '#D58A82',
  errorSoft: '#422D2A',
} as const;
```

Dark Mode 的核心原则：

> **不是黑，而是深。**

Mosaic 应该保持温暖的深色，而不是典型的：

```text
#000000
#111111
#222222
```

科技产品式 Dark Mode。

---

# 30. Light / Dark Token 对照

推荐维护明确的语义映射：

| Semantic Token   | Light     | Dark      |
| ---------------- | --------- | --------- |
| background       | `#FAF9F6` | `#191A17` |
| surface          | `#FFFFFF` | `#22231F` |
| surfaceSecondary | `#F3F1EB` | `#2A2B26` |
| primary          | `#7C927B` | `#9CAF97` |
| primarySoft      | `#E7EDE4` | `#344032` |
| text             | `#383833` | `#F1F0E9` |
| textSecondary    | `#85847C` | `#B8B7AE` |
| textMuted        | `#AAA89F` | `#85847C` |
| border           | `#E7E4DC` | `#383933` |
| accent           | `#D6A477` | `#D7A77F` |
| error            | `#C97970` | `#D58A82` |
| errorSoft        | `#F7EAE7` | `#422D2A` |

这些值不是业务常量，而是主题实现细节。

---

# 31. Theme Token 文件结构

推荐：

```text
design/
├── colors/
│   ├── light.ts
│   ├── dark.ts
│   └── index.ts
│
├── spacing.ts
├── radii.ts
├── typography.ts
├── shadows.ts
└── theme.ts
```

例如：

```ts
// colors/index.ts

export { lightColors } from './light';

export { darkColors } from './dark';
```

然后：

```ts
// theme.ts

import { lightColors } from './colors/light';
import { darkColors } from './colors/dark';

export const themes = {
  light: lightColors,
  dark: darkColors,
};
```

---

# 32. Components 不允许感知 Dark Mode

这是最重要的约定之一。

错误：

```tsx
const isDark = colorMode === 'dark';

return <Box bg={isDark ? '#22231F' : '#FFFFFF'} />;
```

正确：

```tsx
return <Box bg="$surface">...</Box>;
```

组件只知道：

```text
surface
```

不知道：

```text
#FFFFFF
#22231F
```

主题系统负责：

```text
surface
   │
   ├── Light → #FFFFFF
   │
   └── Dark  → #22231F
```

---

# 33. Screen 同样不应该判断颜色模式

错误：

```tsx
const background = isDark ? '#191A17' : '#FAF9F6';
```

正确：

```tsx
<VStack
  flex={1}
  bg="$background"
>
```

如果业务确实需要知道当前模式，例如需要切换某个完全不同的图片资源，可以读取 color mode。

但：

> **不要为了设置颜色而读取 color mode。**

---

# 34. Dark Mode 下的 Surface 层级

Dark Mode 中不能依赖简单的「白色越多越靠上」。

推荐使用不同深度的暖灰：

```text
Background
    ↓
#191A17

Surface
    ↓
#22231F

Surface Secondary
    ↓
#2A2B26
```

形成：

```text
┌──────────────────────────────┐
│ Background                   │
│                              │
│   ┌──────────────────────┐   │
│   │ Surface              │   │
│   │                      │   │
│   │   ┌──────────────┐   │   │
│   │   │ Secondary    │   │   │
│   │   └──────────────┘   │   │
│   └──────────────────────┘   │
│                              │
└──────────────────────────────┘
```

而不是：

```text
#000
#111
#222
#333
#444
```

大量灰阶会让 Mosaic 看起来像开发者工具。

---

# 35. Border 与 Shadow

Dark Mode 中尤其需要克制 Shadow。

Light：

```text
border: subtle
shadow: very subtle
```

Dark：

```text
border: subtle
shadow: minimal
```

不要依赖：

```text
large black shadow
```

因为深色背景下通常不会产生良好的视觉层次。

Dark Mode 更推荐：

> **Surface contrast + subtle border**

而不是：

> **Shadow + elevation**

---

# 36. Primary Color

Primary 不应该简单复用 Light Mode 的颜色。

例如 Light：

```ts
primary: '#7C927B';
```

Dark：

```ts
primary: '#9CAF97';
```

原因是 Dark Mode 中相同的深色绿色会降低可读性。

因此需要：

```text
Light Primary
      ↓
较深、较稳

Dark Primary
      ↓
稍亮、稍柔
```

但仍然保持低饱和。

---

# 37. Text Contrast

Dark Mode 不推荐纯白：

```ts
color: '#FFFFFF';
```

推荐：

```ts
text: '#F1F0E9';
```

Secondary：

```ts
textSecondary: '#B8B7AE';
```

Muted：

```ts
textMuted: '#85847C';
```

这样可以避免纯白文字在深色背景上产生过强的视觉刺激。

---

# 38. Theme Provider

应用根节点负责提供主题。

概念结构：

```tsx
<App>
  <ThemeProvider>
    <Navigation />
  </ThemeProvider>
</App>
```

主题状态应该位于应用级，而不是每个 Screen 自己维护。

例如：

```text
App
 │
 ├── ThemeProvider
 │      │
 │      ├── Light
 │      └── Dark
 │
 └── Navigation
        │
        ├── HomeScreen
        ├── RecordScreen
        └── ProfileScreen
```

---

# 39. Color Mode 设置

建议支持三种模式：

```text
system
light
dark
```

默认：

```text
system
```

即：

> 默认跟随系统。

用户可以在设置中选择：

```text
Appearance

○ System
○ Light
○ Dark
```

---

# 40. 持久化

用户主动选择：

```text
Light
```

或：

```text
Dark
```

时，应持久化该选择。

推荐：

```text
Theme Preference
        │
        ├── system
        ├── light
        └── dark
```

不要只保存：

```text
isDark: true
```

因为：

```text
isDark = false
```

无法区分：

```text
用户选择 Light
```

和：

```text
用户选择 System，而系统当前是 Light
```

---

# 41. Theme Resolution

最终的主题由：

```text
User Preference
       +
System Appearance
       ↓
Resolved Color Mode
```

决定。

例如：

```text
Preference = system
System = dark
       ↓
Resolved = dark
```

或者：

```text
Preference = light
System = dark
       ↓
Resolved = light
```

因此：

```text
Preference
```

和：

```text
Resolved Theme
```

必须是两个概念。

---

# 42. 组件开发约定

每个 Mosaic Component 必须优先使用 Semantic Tokens。

例如：

```tsx
export function MosaicCard({ children }: { children: React.ReactNode }) {
  return (
    <Box
      bg="$surface"
      borderWidth={1}
      borderColor="$border"
      borderRadius="$2xl"
      p="$5"
    >
      {children}
    </Box>
  );
}
```

禁止：

```tsx
<Box bg="#FFFFFF" borderColor="#E7E4DC" />
```

也禁止：

```tsx
<Box bg={isDark ? '#22231F' : '#FFFFFF'} />
```

---

# 43. 业务组件开发约定

Feature Component 同样使用 Semantic Tokens。

正确：

```tsx
function RecordCard({ record }) {
  return (
    <MosaicCard>
      <Text color="$text">{record.title}</Text>

      <Text color="$textSecondary">{record.content}</Text>
    </MosaicCard>
  );
}
```

不要：

```tsx
<Text color="#383833">
```

更不要：

```tsx
<Text
  color={isDark ? '#F1F0E9' : '#383833'}
>
```

---

# 44. Images 与 Dark Mode

图片是 Theme 系统中比较特殊的一类。

不要为了 Dark Mode 对普通用户图片进行自动反色。

对于产品自己的插画、背景图、Logo 等，可以根据 Theme 提供不同资源：

```text
assets/
├── illustration/
│   ├── welcome-light.png
│   └── welcome-dark.png
│
└── logo/
    ├── logo-light.png
    └── logo-dark.png
```

只有真正需要不同视觉表现的资源才创建两套。

---

# 45. Icon 与 Dark Mode

Icon 默认使用语义颜色：

```tsx
<Icon color="$textSecondary" />
```

Active：

```tsx
<Icon color="$primary" />
```

不要：

```tsx
<Icon color="#77766F" />
```

Icon 应自动随着 Theme 改变。

---

# 46. Accessibility

Theme 不应该只追求视觉上的柔和。

必须保证：

- 正文具有足够的对比度
- Button 状态可识别
- Error 状态不能只依赖颜色
- Focus 状态必须明显
- Disabled 状态不能与普通状态完全混淆

尤其是：

> **柔和 ≠ 低可读性。**

Mosaic 可以低饱和，但不能低可访问性。

---

# 47. Theme Evolution

未来如果 Mosaic 增加其他视觉主题，例如：

```text
Mosaic
├── default
│   ├── light
│   └── dark
│
├── paper
│   ├── light
│   └── dark
│
└── ...
```

组件不需要改变。

仍然只使用：

```text
background
surface
text
primary
border
...
```

变化发生在 Theme 层：

```text
Theme
  ↓
Semantic Tokens
  ↓
Components
```

而不是：

```text
Theme
  ↓
修改每个 Screen
```

---

# 48. 最终约定

Mosaic UI Theme 遵循以下规则：

### 1. Semantic First

所有 UI 颜色必须优先使用语义 Token。

```text
primary
surface
text
border
```

而不是具体颜色值。

### 2. Components Don't Know Color Mode

组件不应该根据 Light / Dark 分支设置颜色。

```tsx
bg = '$surface';
```

而不是：

```tsx
isDark ? darkColor : lightColor;
```

### 3. Dark Mode Is Designed, Not Inverted

Dark Mode 是独立设计的语义颜色集合，不是 Light Mode 的颜色反转。

### 4. System Is The Default

默认：

```text
system
```

用户主动选择 Light / Dark 后持久化。

### 5. Theme Preference ≠ Resolved Theme

保存：

```text
system | light | dark
```

而不是只保存：

```text
isDark
```

### 6. Warm Dark Mode

Mosaic Dark Mode 使用：

> **warm dark / soft dark**

而不是纯黑或高对比度科技风 Dark Mode。

### 7. Visual Consistency

Light / Dark 必须保持相同的：

```text
spacing
radii
typography
component structure
interaction behavior
```

变化主要发生在：

```text
colors
contrast
surface elevation
shadow
assets
```

最终目标是：

```text
                    Mosaic Theme
                         │
                ┌────────┴────────┐
                │                 │
              Light              Dark
                │                 │
                └────────┬────────┘
                         ↓
                Semantic Tokens
                         ↓
                Mosaic Components
                         ↓
                Feature Components
                         ↓
                     Screens
```

**主题负责视觉，组件负责表现，业务负责语义，页面负责组合。**

这四层之间不应该互相越界。
