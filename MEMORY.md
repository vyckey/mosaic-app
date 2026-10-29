# Memory

## NativeWind v5 + TextInput 样式问题

**项目使用 NativeWind v5.0.0-preview.4（预览版），对 Tailwind CSS v4 的 `@theme` 自定义工具类支持不完整。**

### 问题
- `className="text-title text-text"` 在 `<TextInput>` 上不生效（font-size、line-height、font-weight 均不应用）
- 在 `<Text>` 组件上正常工作
- 原因：NativeWind 预览版对 TextInput 的样式处理有 bug

### 解决方案
**TextInput 必须使用显式 `style` prop 设置字体样式，不能依赖 Tailwind 类名。**

```tsx
// ❌ 不生效
<TextInput className="text-title text-text" />

// ✅ 正确做法
<TextInput
  className="... text-text"
  style={{ fontSize: 20, lineHeight: 28, fontWeight: '600', padding: 0 }}
/>
```

### 注意事项
- TextInput 有默认 padding，需要 `padding: 0` 避免文字被裁剪
- 行高需要与容器高度匹配：`lineHeight: 28` 需要至少 `h-12`（48px）
- `MosaicText` 和 `MosaicInput` 已经用了 workaround（`leading-none` 覆盖行高、style prop 设置颜色），不要直接复用它们的 className 模式到 TextInput 上

## React Compiler 会缓存 `t()` 的翻译结果

**`app.json` 开启了 `experiments.reactCompiler`，组件里的 `t('key')` 会被编译期 memo。**

### 问题
- memo 的依赖是 `t` 的函数身份；`useCallback([], ...)` 让 `t` 永远稳定，切换语言后缓存的字符串不会失效
- 表现：语言切换后，列表行（依赖 `languagePreference` 等其它 state）会刷新，但页面标题、已挂载页面的文案保持旧语言
- 只在 React 重渲染时才会暴露，重启/重新进入页面后文案又正常

### 解决方案
让 `t` 真正依赖当前语言，并显式用它解析：

```tsx
const t = useCallback(
  (key: string, options?: Record<string, unknown>) =>
    i18n.t(key, { ...options, locale }), // i18n-js 的 lookup 支持 options.locale
  [locale],
);
```

### 注意
- `void locale;` 之类的“假装依赖”会被编译器 DCE 掉，等于没加依赖
- 新文案函数/标题的缓存只要依赖 `t`，就会随着语言切换自动失效

## Android 底部 Sheet 里的输入框会被键盘挡住

**RN `Modal` + `KeyboardAvoidingView` 在 Android 上不会把底部 sheet 顶起来。**

- 现象：点开带 `autoFocus` 输入框的 `MosaicSheet` 后，键盘覆盖输入区域，看不到正在输入的内容
- 原因：键盘避让只对同一 window 内的 view 生效，`Modal` 是独立 window；`statusBarTranslucent` 也不能解决底部 sheet 的位移
- 结论：需要键盘的短表单不要放进 `MosaicSheet`，改用独立的整屏页面
  - 参考实现：`src/features/me/settings/components/SettingsTextForm.tsx`
  - 路由示例：`/settings/profile/edit`、`/settings/ai/memory-edit`
- 只读选择/展示型 sheet（时间、主题、语言）不受影响

## NativeWind：CSS 变量颜色不支持透明度修饰符

**`bg-danger/60` 这类「变量色 + 透明度」在 NativeWind 原生端解析失败，样式会被丢弃。**

- 现象：`@gluestack-ui/button` 的 destructive 基础样式含 `dark:bg-destructive/60`，深色模式下按钮背景变透明，只剩下标签颜色
- 原因：Tailwind 对变量色使用 `color-mix()` 计算透明度，NativeWind 原生端不支持，最终没有背景色
- 解决方案：在组件层显式给出不带 `/xx` 的颜色类覆盖，如 `bg-danger dark:bg-danger`
  - 参考：`src/components/mosaic/MosaicButton.tsx` 的 `destructive` 配置
- 排查技巧：如果某个元素在浅色正常、深色“消失”，先检查基础样式里的 `dark:*-<color>/<alpha>`

## MosaicTextArea 的 containerClassName 不能画边框/背景

**`MosaicTextArea` 内部会给 gluestack `Textarea` 传 `style={{ borderWidth: 0, backgroundColor: 'transparent' }}`，className 里的边框和背景会被这个 style 覆盖。**

- 现象：`containerClassName="rounded-stat border border-border bg-surface p-3"` 在页面上看不出任何卡片效果，只剩输入区本身
- 需要带边框/底色的多行输入时，把它包一层容器，例如：
  ```tsx
  <View className="rounded-card border border-border bg-surface p-[18px]">
    <MosaicTextArea value={value} onChangeText={setValue} />
  </View>
  ```
- `containerClassName` 只适合控制布局（`mt-5`、`flex-1`）

