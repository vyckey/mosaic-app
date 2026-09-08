import { TabList, TabTrigger } from 'expo-router/ui';

import { AppTab } from './AppTab';
import { CreateButton } from './CreateButton';

export function TabBar() {
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
        <AppTab name="today" label="今天" />
      </TabTrigger>

      <TabTrigger name="timeline" href="/timeline" asChild>
        <AppTab name="timeline" label="时间线" />
      </TabTrigger>

      <CreateButton />

      <TabTrigger name="chat" href="/chat" asChild>
        <AppTab name="chat" label="对话" />
      </TabTrigger>

      <TabTrigger name="me" href="/me" asChild>
        <AppTab name="me" label="我" />
      </TabTrigger>
    </TabList>
  );
}
