import { TabList, TabTrigger } from 'expo-router/ui';

import { useI18n } from '@/i18n/useI18n';

import { AppTab } from './AppTab';
import { CreateButton } from './CreateButton';

export function TabBar() {
  const { t } = useI18n();

  return (
    <TabList
      className="
        h-[76px]
        flex-row
        items-center
        border-t
        border-border
        bg-background
        px-2
        pb-2
        pt-1
      "
    >
      <TabTrigger name="index" href="/" asChild>
        <AppTab name="today" label={t('tab.today')} />
      </TabTrigger>

      <TabTrigger name="records" href="/records" asChild>
        <AppTab name="records" label={t('tab.records')} />
      </TabTrigger>

      <CreateButton />

      <TabTrigger name="chat" href="/chat" asChild>
        <AppTab name="chat" label={t('tab.chat')} />
      </TabTrigger>

      <TabTrigger name="me" href="/me" asChild>
        <AppTab name="me" label={t('tab.me')} />
      </TabTrigger>
    </TabList>
  );
}
