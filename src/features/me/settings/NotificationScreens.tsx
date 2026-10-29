import { router } from 'expo-router';
import { Linking } from 'react-native';

import { MosaicListRow } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';
import {
  countEnabled,
  useSettingsStore,
  type LifeEventAdvance,
  type NotificationPrivacyLevel,
  type ReminderDays,
} from '@/stores';

import { SettingsPageShell } from './components/SettingsPageShell';
import {
  SettingsChoiceRow,
  SettingsSwitchRow,
} from './components/SettingsRows';
import { SettingsSection } from './components/SettingsSection';

const TIMES = ['07:00', '08:00', '09:00', '10:00', '12:00', '18:00', '20:00', '21:00', '22:00'];

export function NotificationsScreen() {
  const { t } = useI18n();
  const notifications = useSettingsStore((state) => state.notifications);
  const setNotifications = useSettingsStore(
    (state) => state.setNotifications,
  );

  const otherCount = countEnabled(notifications.others);
  const privacyLabel = {
    full: t('settings.notifications.privacyFull'),
    title: t('settings.notifications.privacyTitle'),
    hidden: t('settings.notifications.privacyHidden'),
  }[notifications.privacy.level];

  const dayLabel = (days: ReminderDays) =>
    ({
      daily: t('settings.notifications.daysDaily'),
      weekdays: t('settings.notifications.daysWeekdays'),
      weekend: t('settings.notifications.daysWeekend'),
    })[days];

  return (
    <SettingsPageShell title={t('settings.notifications.title')}>
      <SettingsSection description={t('settings.notifications.masterHint')}>
        <MosaicListRow
          title={t('settings.notifications.permission')}
          value={t('settings.notifications.permissionGranted')}
          onPress={() => Linking.openSettings()}
        />
      </SettingsSection>

      <SettingsSection>
        <SettingsSwitchRow
          title={t('settings.notifications.dailyQuestion')}
          value={notifications.dailyQuestion.enabled}
          onValueChange={(enabled) =>
            setNotifications({
              dailyQuestion: { ...notifications.dailyQuestion, enabled },
            })
          }
        />
        <MosaicListRow
          title={t('settings.notifications.reminderTime')}
          value={t('settings.notifications.timeSummary', {
            time: notifications.dailyQuestion.time,
            days: dayLabel(notifications.dailyQuestion.days),
          })}
          onPress={() => router.push('/settings/notifications/daily-question')}
        />
        <SettingsSwitchRow
          title={t('settings.notifications.onThisDay')}
          value={notifications.onThisDay.enabled}
          onValueChange={(enabled) =>
            setNotifications({
              onThisDay: { ...notifications.onThisDay, enabled },
            })
          }
        />
        <MosaicListRow
          title={t('settings.notifications.reminderTime')}
          value={t('settings.notifications.timeSummary', {
            time: notifications.onThisDay.time,
            days: dayLabel(notifications.onThisDay.days),
          })}
          onPress={() => router.push('/settings/notifications/on-this-day')}
        />
        <MosaicListRow
          title={t('settings.notifications.lifeEvents')}
          value={t('settings.notifications.lifeEventsValue')}
          onPress={() => router.push('/settings/notifications/life-events')}
        />
        <MosaicListRow
          title={t('settings.notifications.others')}
          value={t('settings.notifications.othersCount', {
            enabled: otherCount,
            total: Object.keys(notifications.others).length,
          })}
          onPress={() => router.push('/settings/notifications/others')}
        />
      </SettingsSection>

      <SettingsSection>
        <SettingsSwitchRow
          title={t('settings.notifications.dnd')}
          value={notifications.dnd.enabled}
          onValueChange={(enabled) =>
            setNotifications({ dnd: { ...notifications.dnd, enabled } })
          }
        />
        <MosaicListRow
          title={t('settings.notifications.dndSchedule')}
          value={t('settings.notifications.dndValue', {
            start: notifications.dnd.start,
            end: notifications.dnd.end,
          })}
          onPress={() => router.push('/settings/notifications/dnd')}
        />
        <MosaicListRow
          title={t('settings.notifications.privacy')}
          subtitle={t('settings.notifications.privacyHint')}
          value={privacyLabel}
          onPress={() => router.push('/settings/notifications/privacy')}
        />
      </SettingsSection>
    </SettingsPageShell>
  );
}

interface ReminderDetailProps {
  title: string;
  kind: 'dailyQuestion' | 'onThisDay';
}

function ReminderDetailScreen({ title, kind }: ReminderDetailProps) {
  const { t } = useI18n();
  const notifications = useSettingsStore((state) => state.notifications);
  const setNotifications = useSettingsStore(
    (state) => state.setNotifications,
  );
  const reminder = notifications[kind];

  return (
    <SettingsPageShell title={title}>
      <SettingsSection>
        <SettingsSwitchRow
          title={title}
          value={reminder.enabled}
          onValueChange={(enabled) =>
            setNotifications({ [kind]: { ...reminder, enabled } })
          }
        />
        <SettingsChoiceRow
          title={t('settings.notifications.reminderTime')}
          value={reminder.time}
          options={TIMES.map((time) => ({ value: time, label: time }))}
          onChange={(time) =>
            setNotifications({ [kind]: { ...reminder, time } })
          }
        />
        <SettingsChoiceRow<ReminderDays>
          title={t('settings.notifications.reminderDays')}
          value={
            {
              daily: t('settings.notifications.daysDaily'),
              weekdays: t('settings.notifications.daysWeekdays'),
              weekend: t('settings.notifications.daysWeekend'),
            }[reminder.days]
          }
          options={[
            {
              value: 'daily',
              label: t('settings.notifications.daysDaily'),
            },
            {
              value: 'weekdays',
              label: t('settings.notifications.daysWeekdays'),
            },
            {
              value: 'weekend',
              label: t('settings.notifications.daysWeekend'),
            },
          ]}
          onChange={(days) =>
            setNotifications({ [kind]: { ...reminder, days } })
          }
        />
      </SettingsSection>
    </SettingsPageShell>
  );
}

export function DailyQuestionNotificationScreen() {
  const { t } = useI18n();
  return (
    <ReminderDetailScreen
      title={t('settings.notifications.dailyQuestion')}
      kind="dailyQuestion"
    />
  );
}

export function OnThisDayNotificationScreen() {
  const { t } = useI18n();
  return (
    <ReminderDetailScreen
      title={t('settings.notifications.onThisDay')}
      kind="onThisDay"
    />
  );
}

export function LifeEventsNotificationScreen() {
  const { t } = useI18n();
  const lifeEvents = useSettingsStore(
    (state) => state.notifications.lifeEvents,
  );
  const setNotifications = useSettingsStore(
    (state) => state.setNotifications,
  );

  return (
    <SettingsPageShell title={t('settings.notifications.lifeEvents')}>
      <SettingsSection>
        <SettingsSwitchRow
          title={t('settings.notifications.lifeEventsValue')}
          value={lifeEvents.enabled}
          onValueChange={(enabled) =>
            setNotifications({ lifeEvents: { ...lifeEvents, enabled } })
          }
        />
        <SettingsChoiceRow<LifeEventAdvance>
          title={t('settings.notifications.advance')}
          value={
            {
              sameDay: t('settings.notifications.advanceSameDay'),
              oneDay: t('settings.notifications.advanceOneDay'),
              threeDays: t('settings.notifications.advanceThreeDays'),
              oneWeek: t('settings.notifications.advanceOneWeek'),
            }[lifeEvents.advance]
          }
          options={[
            {
              value: 'sameDay',
              label: t('settings.notifications.advanceSameDay'),
            },
            {
              value: 'oneDay',
              label: t('settings.notifications.advanceOneDay'),
            },
            {
              value: 'threeDays',
              label: t('settings.notifications.advanceThreeDays'),
            },
            {
              value: 'oneWeek',
              label: t('settings.notifications.advanceOneWeek'),
            },
          ]}
          onChange={(advance) =>
            setNotifications({ lifeEvents: { ...lifeEvents, advance } })
          }
        />
      </SettingsSection>
    </SettingsPageShell>
  );
}

export function OtherNotificationsScreen() {
  const { t } = useI18n();
  const others = useSettingsStore((state) => state.notifications.others);
  const setNotifications = useSettingsStore(
    (state) => state.setNotifications,
  );

  const rows: {
    key: keyof typeof others;
    labelKey: string;
  }[] = [
    {
      key: 'aiInsight',
      labelKey: 'settings.notifications.othersAiInsight',
    },
    { key: 'goals', labelKey: 'settings.notifications.othersGoals' },
    { key: 'habits', labelKey: 'settings.notifications.othersHabits' },
    {
      key: 'announcements',
      labelKey: 'settings.notifications.othersAnnouncements',
    },
  ];

  return (
    <SettingsPageShell title={t('settings.notifications.others')}>
      <SettingsSection>
        {rows.map((row) => (
          <SettingsSwitchRow
            key={row.key}
            title={t(row.labelKey)}
            value={others[row.key]}
            onValueChange={(enabled) =>
              setNotifications({ others: { ...others, [row.key]: enabled } })
            }
          />
        ))}
      </SettingsSection>
    </SettingsPageShell>
  );
}

export function DndNotificationScreen() {
  const { t } = useI18n();
  const dnd = useSettingsStore((state) => state.notifications.dnd);
  const setNotifications = useSettingsStore(
    (state) => state.setNotifications,
  );

  return (
    <SettingsPageShell title={t('settings.notifications.dnd')}>
      <SettingsSection>
        <SettingsSwitchRow
          title={t('settings.notifications.dnd')}
          value={dnd.enabled}
          onValueChange={(enabled) =>
            setNotifications({ dnd: { ...dnd, enabled } })
          }
        />
        <SettingsChoiceRow
          title={t('settings.notifications.dndStart')}
          value={dnd.start}
          options={TIMES.map((time) => ({ value: time, label: time }))}
          onChange={(start) => setNotifications({ dnd: { ...dnd, start } })}
        />
        <SettingsChoiceRow
          title={t('settings.notifications.dndEnd')}
          value={dnd.end}
          options={TIMES.map((time) => ({ value: time, label: time }))}
          onChange={(end) => setNotifications({ dnd: { ...dnd, end } })}
        />
        <SettingsSwitchRow
          title={t('settings.notifications.dndAllowImportant')}
          value={dnd.allowImportant}
          onValueChange={(allowImportant) =>
            setNotifications({ dnd: { ...dnd, allowImportant } })
          }
        />
      </SettingsSection>
    </SettingsPageShell>
  );
}

export function NotificationPrivacyScreen() {
  const { t } = useI18n();
  const privacy = useSettingsStore((state) => state.notifications.privacy);
  const setNotifications = useSettingsStore(
    (state) => state.setNotifications,
  );

  return (
    <SettingsPageShell
      title={t('settings.notifications.privacy')}
      subtitle={t('settings.notifications.privacyHint')}
    >
      <SettingsSection>
        <SettingsChoiceRow<NotificationPrivacyLevel>
          title={t('settings.notifications.privacyLevel')}
          value={
            {
              full: t('settings.notifications.privacyFull'),
              title: t('settings.notifications.privacyTitle'),
              hidden: t('settings.notifications.privacyHidden'),
            }[privacy.level]
          }
          options={[
            {
              value: 'full',
              label: t('settings.notifications.privacyFull'),
            },
            {
              value: 'title',
              label: t('settings.notifications.privacyTitle'),
            },
            {
              value: 'hidden',
              label: t('settings.notifications.privacyHidden'),
            },
          ]}
          onChange={(level) =>
            setNotifications({ privacy: { ...privacy, level } })
          }
        />
      </SettingsSection>

      <SettingsSection>
        <SettingsSwitchRow
          title={t('settings.notifications.hideContent')}
          value={privacy.hideContent}
          onValueChange={(hideContent) =>
            setNotifications({ privacy: { ...privacy, hideContent } })
          }
        />
        <SettingsSwitchRow
          title={t('settings.notifications.hideAiInsight')}
          value={privacy.hideAiInsight}
          onValueChange={(hideAiInsight) =>
            setNotifications({ privacy: { ...privacy, hideAiInsight } })
          }
        />
      </SettingsSection>
    </SettingsPageShell>
  );
}
