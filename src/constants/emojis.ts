export type EmotionLocale = 'en' | 'zh-CN';

export interface EmotionDefinition {
  emoji: string;
  label: Record<EmotionLocale, string>;
}

export const EMOTION_EMOJIS: EmotionDefinition[] = [
  { emoji: '😊', label: { en: 'Happy', 'zh-CN': '开心' } },
  { emoji: '🥰', label: { en: 'In Love', 'zh-CN': '喜欢' } },
  { emoji: '😂', label: { en: 'Laughing', 'zh-CN': '大笑' } },
  { emoji: '🤩', label: { en: 'Amazed', 'zh-CN': '惊喜' } },
  { emoji: '😮', label: { en: 'Surprised', 'zh-CN': '惊讶' } },
  { emoji: '😢', label: { en: 'Sad', 'zh-CN': '难过' } },
  { emoji: '😡', label: { en: 'Angry', 'zh-CN': '生气' } },
  { emoji: '😴', label: { en: 'Sleepy', 'zh-CN': '困困' } },
  { emoji: '🤔', label: { en: 'Thinking', 'zh-CN': '思考' } },
  { emoji: '🥳', label: { en: 'Celebrating', 'zh-CN': '庆祝' } },
  { emoji: '😌', label: { en: 'Calm', 'zh-CN': '平静' } },
  { emoji: '😅', label: { en: 'Awkward', 'zh-CN': '尴尬' } },
  { emoji: '😔', label: { en: 'Down', 'zh-CN': '低落' } },
  { emoji: '😤', label: { en: 'Frustrated', 'zh-CN': '郁闷' } },
  { emoji: '😭', label: { en: 'Crying', 'zh-CN': '大哭' } },
  { emoji: '🥱', label: { en: 'Tired', 'zh-CN': '疲惫' } },
  { emoji: '😰', label: { en: 'Nervous', 'zh-CN': '紧张' } },
  { emoji: '😵', label: { en: 'Dizzy', 'zh-CN': '晕眩' } },
  { emoji: '🤑', label: { en: 'Rich', 'zh-CN': '发财' } },
  { emoji: '🥶', label: { en: 'Cold', 'zh-CN': '寒冷' } },
];

export function getEmotionLabel(
  emotion: EmotionDefinition,
  locale: string,
): string {
  return emotion.label[locale as EmotionLocale] ?? emotion.label.en;
}
