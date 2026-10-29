import { View } from 'react-native';

import { MosaicText } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import type { LifeEventStats } from '../types';

export interface LifeEventsOverviewProps {
  stats: LifeEventStats;
}

/**
 * Page intro + horizontal metrics. Deliberately not three separate cards:
 * one typographic block, hairline separators, numbers as the only weight.
 */
export function LifeEventsOverview({ stats }: LifeEventsOverviewProps) {
  const { t } = useI18n();

  const metrics = [
    { key: 'events', value: stats.events, label: t('lifeEvents.stats.events') },
    { key: 'stages', value: stats.stages, label: t('lifeEvents.stats.stages') },
    { key: 'years', value: stats.years, label: t('lifeEvents.stats.years') },
  ];

  return (
    <View>
      <MosaicText variant="display" weight="700">
        {t('lifeEvents.overview.title')}
      </MosaicText>
      <MosaicText variant="caption" tone="text-muted" className="mt-2">
        {t('lifeEvents.overview.subtitle')}
      </MosaicText>

      {/* Hide the numbers entirely until there is something real to count */}
      {stats.events > 0 && (
        <View className="mt-6 flex-row">
          {metrics.map((metric, index) => (
            <View
              key={metric.key}
              className={[
                'min-w-0 flex-1',
                index > 0 && 'ml-5 border-l border-border pl-5',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <MosaicText variant="display" weight="700">
                {String(metric.value)}
              </MosaicText>
              <MosaicText variant="tiny" tone="text-muted" className="mt-1">
                {metric.label}
              </MosaicText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
