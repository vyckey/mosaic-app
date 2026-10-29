import { useState } from 'react';
import {
  ScrollView,
  useWindowDimensions,
  type DimensionValue,
} from 'react-native';

import {
  EMOTION_EMOJIS,
  getEmotionLabel,
  type EmojiValue,
} from '@/constants/emojis';
import { useI18n } from '@/i18n/useI18n';

import { EmojiChip } from './EmojiChip';
import { MosaicDialog } from './MosaicDialog';

export interface MosaicEmojiPickerModalProps {
  visible: boolean;
  /** Committed emoji; marks the matching chip and seeds the draft. */
  value?: string | null;
  /**
   * Receives the draft when the footer's Ok is pressed, label included so the
   * caller can render the trigger without re-reading the emoji catalog.
   */
  onChange: (selection: EmojiValue | null) => void;
  /** Dismisses the dialog — Cancel, the backdrop and Android back all use it. */
  onClose: () => void;
  /** Dialog title; defaults to the localized "Emoji". */
  title?: string;
  /** Width cap, passed straight to `MosaicDialog`. Defaults to `'84%'`. */
  maxWidth?: DimensionValue;
}

/**
 * Emoji chooser dialog only: it owns the catalog, the grid, the draft
 * selection and the footer. The trigger (the emoji / placeholder the user
 * taps) lives with the screen, which also decides when the dialog opens.
 *
 * Picking a chip edits a draft; only Ok commits it through `onChange`, so
 * Cancel or a tap outside leaves the previous value untouched.
 */
export function MosaicEmojiPickerModal({
  visible,
  value,
  onChange,
  onClose,
  title,
  maxWidth = '84%',
}: MosaicEmojiPickerModalProps) {
  const { locale, t } = useI18n();
  const { height } = useWindowDimensions();

  const items = EMOTION_EMOJIS.map((item) => ({
    emoji: item.emoji,
    label: getEmotionLabel(item, locale),
  }));

  const [draft, setDraft] = useState<string | null>(value ?? null);
  const [wasVisible, setWasVisible] = useState(visible);

  // Re-snapshot on every open. Adjusting state during render is React's
  // recommended alternative to an effect here: the dialog's parent flips
  // `visible`, and the draft must follow before the grid paints.
  if (visible !== wasVisible) {
    setWasVisible(visible);

    if (visible) {
      setDraft(value ?? null);
    }
  }

  const handleConfirm = () => {
    onChange(items.find((item) => item.emoji === draft) ?? null);
    onClose();
  };

  return (
    <MosaicDialog
      visible={visible}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={title ?? t('moment.emoji')}
      maxWidth={maxWidth}
    >
      <ScrollView
        style={{ maxHeight: height * 0.4 }}
        contentContainerClassName="flex-row flex-wrap justify-between gap-1"
        showsVerticalScrollIndicator
      >
        {items.map((item) => (
          <EmojiChip
            key={item.emoji}
            item={item}
            active={draft === item.emoji}
            onPress={() =>
              setDraft((prev) => (prev === item.emoji ? null : item.emoji))
            }
          />
        ))}
      </ScrollView>
    </MosaicDialog>
  );
}
