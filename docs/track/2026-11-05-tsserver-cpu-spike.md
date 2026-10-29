# tsserver CPU 100% 问题跟踪

- 日期:2026-11-05
- 现象:VS Code 的 TypeScript Server 进程(`Code Helper (Plugin)` / `tsserver.js`)单核 CPU 持续 98%+,内存占用约 1.8G
- 结论:并非项目整体过大,而是 tsserver 对单个文件反复执行耗时 ~100 秒的语义检查,根因是 nativewind `styled()` 的类型推断爆炸

---

## 1. 现象

```text
19984  98.9  4.7 2002656208 795952  ??  R  11:26PM  5:14.06 ... tsserver.js ...
```

- 进程 23:26 启动,CPU 长时间贴近 100%
- 物理内存 footprint 1.8G,峰值 2.1G(tsserver 上限 3072MB)
- 编辑 `src/features/me/life-events/LifeEventDetailScreen.tsx` 时最明显

---

## 2. Root Cause

因果链:

1. **每次按键** VS Code 都给 tsserver 发送 `updateOpen` + `geterr`,触发目标文件的完整 `semanticDiag`(全量语义检查,不是增量)。
2. 该文件通过 `@/components/mosaic` 桶导出,把 `components/ui/*` 全部拉进检查图。
3. 这些 UI 组件里的 **nativewind `styled()`** 被传入 Reanimated / React Native 组件,其 props 是巨大的交叉类型;TypeScript 泛型推断展开成超深联合类型(源码中已有 `TS2589` / `TS2590` / `@ts-expect-error` 痕迹)。
4. tsserver 每次编辑都会创建新 program(日志中 `Different program with same set of files`),**checker 缓存全部失效**,热点表达式被反复重算。
5. 叠加 1.8G 堆带来的 GC 抖动(`CppHeap::CollectGarbage`),单次检查从约 19 秒放大到 100 秒以上。
6. 文件内还有一段粘贴来的 `DateTimePicker` 代码,引用了未定义的 `date` / `setDate`(真实报错,与性能无关)。

> 一句话:**一个被反复类型检查的 UI 桶导出 + nativewind `styled()` 的深类型推断 = 每次按键 100 秒的 CPU。**

---

## 3. 分析过程

### 3.1 进程采样

```bash
ps aux | grep tsserver
sample 19984 3 -file /tmp/tsserver-sample.txt
```

- 两次采样主线程都落在 V8 JIT 代码中持续分配数组 / 字符串,并伴随 `CppHeap::CollectGarbage`
- 说明 CPU 消耗在 JS 层的大量类型对象分配,而非 I/O 或死锁

### 3.2 读取 tsserver 日志

日志路径来自进程启动参数:

```text
~/Library/Application Support/Code/logs/<session>/window1/exthost/
  vscode.typescript-language-features/tsserver-log-*/tsserver.log
```

日志中 `requestCompleted.performanceData.diagnosticsDuration` 直接给出每个文件、每种诊断的耗时:

| 文件 | semanticDiag |
|------|--------------|
| `src/features/me/life-events/LifeEventDetailScreen.tsx` | **114,876 ms** |
| `src/features/me/life-events/LifeEventDetailScreen.tsx` | **97,991 ms** |
| `src/components/ui/calendar/index.tsx`(同请求内对照组) | **34 ms** |

全日志共 107 次 `semanticDiag`,只有这 2 次是秒级以上异常值,合计 **213 秒**,与用户编辑该文件的时间窗完全吻合。

### 3.3 类型检查 trace

```bash
npx tsc --noEmit --generateTrace <trace-dir>
```

按事件名聚合 `trace.json`,取最慢的 `checkExpression` / `checkVariableDeclaration`,并用字节偏移换算行号:

| 耗时 | 位置 | 代码 |
|------|------|------|
| 8.20s | `src/components/ui/menu/index.tsx:106` | `styled(AnimatedView, { className: 'style' })` |
| 5.60s | `src/components/ui/modal/index.tsx:19` | `styled(AnimatedPressable, ...)` |
| 5.46s | `src/components/ui/modal/index.tsx:20` | `styled(AnimatedView, ...)` |
| 4.02s | `src/components/ui/liquid-glass/index.tsx:29` | `styled(ExpoGlassView, ...)` |

全量 `tsc` 共 36 秒,其中 `checkExpression` 占 24.6 秒,Top 4 全部是 `styled()` 调用。

### 3.4 隔离验证

用只 include 目标文件的临时 tsconfig 复现:

```bash
npx tsc --noEmit -p <isolate-tsconfig> --generateTrace <dir>
```

- 单文件检查 **18.8 秒**,其中 `ui/menu` 7.2s、`ui/liquid-glass` 4.0s
- 证明慢点确实来自该文件的依赖图,而不是并发 / 机器负载

### 3.5 A/B 量化

对热点 `styled()` 的组件参数做类型宽化后:

```text
基线 tsc --noEmit:      36.0s
宽化后 tsc --noEmit:    12.9s   (约 2.8×)
checkExpression 总计:   24.5s → 5.6s
```

> 注意:宽化 `ui/menu` 会让 `createMenu` 推断成 `trigger` 必填,宽化 `select-actionsheet` 会让 `withStyleContext` 报 TS2590,需要配套显式标注才能落地,因此本次未合并这部分改动。

### 3.6 可复用的排查顺序

1. `ps` 定位 tsserver → `sample` 看主线程栈
2. 读 `tsserver.log` 的 `diagnosticsDuration`,定位文件与诊断类型
3. `tsc --generateTrace` 找最慢表达式
4. 用最小 tsconfig 隔离复现
5. 改动前后各跑一次全量 `tsc` 做 A/B 验证

---

## 4. 本次修改

### 4.1 `MosaicMenu` 改用 `@expo/ui` 原生菜单

不再使用 gluestack 的 Menu,改用 `@expo/ui/community/menu` 的 `MenuView`:

- iOS 使用 SwiftUI `Menu`,Android 使用 Compose `DropdownMenu`
- 保留声明式 API:`<MosaicMenu trigger={...}><MosaicMenuItem/></MosaicMenu>`
- `MosaicMenuItem` 变为纯 descriptor(`id` / label / `icon` / `destructive` / `disabled` / `hidden` / `onPress`),由 `MosaicMenu` 转成原生 `MenuAction[]`
- `id` 为必填且唯一:原生菜单靠 `id` 回传事件,label 会随 i18n 变化,不能作为身份
- 支持 Fragment(`<>...</>`)包装的条件菜单项;任意自定义包装组件不被递归,并在开发期 `console.warn`
- 开发期校验:重复 `id`、占用保留前缀 `__mosaic-menu-`、非法子组件、空菜单
- `icon` 改为 SF Symbol 字符串(iOS 生效;Android 需传 `ImageSource` 才会显示图标)
- `MosaicMenuSeparator` 映射为 iOS 的 inline `Section` 分组(Android Material 菜单无分组线);分组使用 `title: ''`,原生 `SectionView` 以 `!title.isEmpty` 判定无标题,因此不需要 `undefined as unknown as string` 断言
- **web 不再支持**:`MenuView` 在 web 只渲染 trigger,actions 不触发(expo 官方行为)
- **Android trigger 手势**:`MenuView` 会给 children 再包一层 `Pressable`,触发内容里若已有 `Pressable`,内层会抢走 responder 导致菜单打不开。`MosaicMenu` 因此把 trigger 包在 `pointerEvents="none"` 的容器里,把手势交回 `MenuView`(已在 Android 模拟器实测通过)

涉及文件:

```text
src/components/mosaic/MosaicMenu.tsx
src/components/mosaic/MosaicMenuItem.tsx
src/components/mosaic/MosaicMenuSeparator.tsx
src/components/mosaic/__tests__/MosaicMenu-test.tsx
```

### 4.2 `LifeEventDetailScreen`

- menu 调用点改为 `trigger` 节点 + SF Symbol(`pencil` / `doc.on.doc` / `trash`)
- 移除不再使用的 lucide 图标导入
- 修复 `date` / `setDate` 未定义:补充 `useState`;`onChange` 参数改名,避免遮蔽外层 `event`

### 4.3 已还原的实验

`ui/menu`、`ui/modal`、`ui/liquid-glass`、`ui/select/select-actionsheet` 的类型宽化实验全部还原,避免引入新的类型错误。

---

## 5. 验证

```bash
npx tsc --noEmit
npx jest src/components/mosaic
```

- 新代码 0 报错
- `MosaicMenu` 测试 10/10 通过(含 Fragment、重复 id、保留前缀、非法子组件、空菜单、trigger 触摸穿透)
- Android 模拟器实测:点击「…」菜单弹出,Edit / Duplicate / Delete 回调正常;iOS 侧此前已正常
- 剩余 6 条报错均为改造前已存在:
  - `ui/menu`: `TS2589`、`opacity` 不存在于 `TransformsConfig`
  - `ui/modal`: `TS2589`、`opacity` 不存在于 `TransformsConfig`
  - `ui/select/select-actionsheet`: `styled(VirtualizedList)` 重载不匹配
  - `ui/avatar`: 无用 `@ts-expect-error`

---

## 6. 后续可选项

1. 继续治理 tsserver CPU:`ui/menu` / `ui/modal` / `select-actionsheet` 三处 `styled()` 需要"参数宽化 + 对 `createMenu` / `withStyleContext` 结果显式标注"的组合方案。
2. 修复上面 6 条存量类型错误,尤其是两处 `opacity` 与 `VirtualizedList` 重载。
3. 由于 `tsconfig.include` 覆盖全部源码,`ui/menu` 仍会被 `tsc` 检查(`calendar` 还在引用),全量检查时间不会因本次菜单改造明显下降;本次收益主要在运行时依赖图与编辑时的检查成本。
4. 若后续不再需要 gluestack 菜单,可把 `ui/calendar` 的菜单选择迁到 `MosaicSelect`,再删除 `ui/menu`,彻底移除该热点。
