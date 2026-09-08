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
