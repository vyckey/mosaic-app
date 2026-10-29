import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { View } from 'react-native';

import { MosaicIcon, MosaicPressable, MosaicText } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import type { LifeEventYearGroup } from '../format';
import type { LifeEvent } from '../types';
import { LifeEventItem } from './LifeEventItem';

export interface LifeEventsTimelineProps {
  groups: LifeEventYearGroup[];
  /** Years whose events are folded away */
  collapsedYears: ReadonlySet<number>;
  onToggleYear: (year: number) => void;
  onEventPress: (event: LifeEvent) => void;
  onPhotoPress: (photos: string[], index: number) => void;
}

/**
 * Year-grouped timeline. The year is the only separator — no containers around
 * groups — and tapping it folds the events of that year.
 */
export function LifeEventsTimeline({
  groups,
  collapsedYears,
  onToggleYear,
  onEventPress,
  onPhotoPress,
}: LifeEventsTimelineProps) {
  const { t } = useI18n();

  return (
    <View>
      {groups.map((group, groupIndex) => {
        const collapsed = collapsedYears.has(group.year);

        return (
          <View key={group.year} className={groupIndex > 0 ? 'mt-8' : ''}>
            <MosaicPressable
              onPress={() => onToggleYear(group.year)}
              accessibilityLabel={String(group.year)}
              className="flex-row items-center gap-2"
            >
              <MosaicText
                variant="display"
                tone="text-muted"
                weight="700"
                style={{ fontSize: 26, lineHeight: 32 }}
              >
                {String(group.year)}
              </MosaicText>

              <MosaicIcon
                as={collapsed ? ChevronRight : ChevronDown}
                size="xs"
                tone="text-muted"
              />

              {collapsed && (
                <MosaicText variant="tiny" tone="text-subtle">
                  {t('lifeEvents.collapsedCount', {
                    count: group.events.length,
                  })}
                </MosaicText>
              )}
            </MosaicPressable>

            {!collapsed && (
              <View className="mt-4">
                {group.events.map((event, eventIndex) => (
                  <LifeEventItem
                    key={event.id}
                    event={event}
                    isLast={eventIndex === group.events.length - 1}
                    onPress={() => onEventPress(event)}
                    onPhotoPress={onPhotoPress}
                  />
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
