import { router } from 'expo-router';
import { useState } from 'react';

import {
  MosaicListRow,
  MosaicText,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';
import { countEnabled, useSettingsStore, type SyncNetwork } from '@/stores';

import { SettingsConfirmDialog } from './components/SettingsConfirmDialog';
import { SettingsPageShell } from './components/SettingsPageShell';
import {
  SettingsChoiceRow,
  SettingsSwitchRow,
} from './components/SettingsRows';
import { SettingsSection } from './components/SettingsSection';

export function SourcesScreen() {
  const { t } = useI18n();
  const sources = useSettingsStore((state) => state.sources);

  const connectionCount = countEnabled(sources.connections);

  return (
    <SettingsPageShell title={t('settings.sources.title')}>
      <SettingsSection>
        <MosaicListRow
          title={t('settings.sources.weather')}
          value={
            sources.weather.connected
              ? t('settings.sources.connected')
              : t('settings.sources.notConnected')
          }
          onPress={() => router.push('/settings/sources/weather')}
        />
        <MosaicListRow
          title={t('settings.sources.connectable')}
          value={t('settings.sources.connectedCount', {
            count: connectionCount,
          })}
          onPress={() => router.push('/settings/sources/connections')}
        />
        <MosaicListRow
          title={t('settings.sources.autoSync')}
          value={
            sources.autoSync.network === 'wifi'
              ? t('settings.sources.networkValueWifi')
              : t('settings.sources.networkValueAny')
          }
          onPress={() => router.push('/settings/sources/auto-sync')}
        />
      </SettingsSection>
    </SettingsPageShell>
  );
}

export function WeatherSourceScreen() {
  const { t } = useI18n();
  const weather = useSettingsStore((state) => state.sources.weather);
  const sources = useSettingsStore((state) => state.sources);
  const setSources = useSettingsStore((state) => state.setSources);

  const [disconnectVisible, setDisconnectVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);

  return (
    <SettingsPageShell title={t('settings.sources.weather')}>
      <SettingsSection>
        <SettingsSwitchRow
          title={t('settings.sources.weather')}
          subtitle={
            weather.connected
              ? t('settings.sources.connected')
              : t('settings.sources.notConnected')
          }
          value={weather.connected}
          onValueChange={(connected) =>
            setSources({ weather: { ...weather, connected } })
          }
        />
        <SettingsSwitchRow
          title={t('settings.sources.weatherAutoSync')}
          value={weather.autoSync}
          disabled={!weather.connected}
          onValueChange={(autoSync) =>
            setSources({ weather: { ...weather, autoSync } })
          }
        />
        <MosaicListRow
          title={t('settings.sources.lastSync')}
          value={t('settings.sources.lastSyncValue')}
          chevron={false}
        />
        <MosaicListRow
          title={t('settings.sources.syncError')}
          value={t('settings.sources.syncErrorNone')}
          chevron={false}
        />
      </SettingsSection>

      <SettingsSection>
        <MosaicListRow
          title={t('settings.sources.disconnect')}
          tone="danger"
          chevron={false}
          onPress={() => setDisconnectVisible(true)}
        />
        <MosaicListRow
          title={t('settings.sources.deleteImported')}
          tone="danger"
          chevron={false}
          onPress={() => setDeleteVisible(true)}
        />
      </SettingsSection>

      <SettingsConfirmDialog
        visible={disconnectVisible}
        title={t('settings.sources.disconnect')}
        message={t('settings.sources.disconnectConfirm')}
        danger
        onConfirm={() => {
          setSources({
            weather: { ...sources.weather, connected: false },
          });
          setDisconnectVisible(false);
        }}
        onClose={() => setDisconnectVisible(false)}
      />

      <SettingsConfirmDialog
        visible={deleteVisible}
        title={t('settings.sources.deleteImported')}
        message={t('settings.sources.deleteImportedConfirm')}
        danger
        onConfirm={() => setDeleteVisible(false)}
        onClose={() => setDeleteVisible(false)}
      />
    </SettingsPageShell>
  );
}

export function ConnectionsScreen() {
  const { t } = useI18n();
  const connections = useSettingsStore((state) => state.sources.connections);
  const sources = useSettingsStore((state) => state.sources);
  const setSources = useSettingsStore((state) => state.setSources);

  const rows = [
    { key: 'health', label: t('settings.sources.health') },
    { key: 'location', label: t('settings.sources.location') },
    { key: 'music', label: t('settings.sources.music') },
    { key: 'reading', label: t('settings.sources.reading') },
  ] as const;

  return (
    <SettingsPageShell title={t('settings.sources.connectable')}>
      <SettingsSection>
        {rows.map((row) => (
          <SettingsSwitchRow
            key={row.key}
            title={row.label}
            subtitle={
              connections[row.key]
                ? t('settings.sources.connected')
                : t('settings.sources.notConnected')
            }
            value={connections[row.key]}
            onValueChange={(value) =>
              setSources({
                connections: { ...sources.connections, [row.key]: value },
              })
            }
          />
        ))}
      </SettingsSection>
    </SettingsPageShell>
  );
}

export function AutoSyncScreen() {
  const { t } = useI18n();
  const autoSync = useSettingsStore((state) => state.sources.autoSync);
  const sources = useSettingsStore((state) => state.sources);
  const setSources = useSettingsStore((state) => state.setSources);

  return (
    <SettingsPageShell title={t('settings.sources.autoSync')}>
      <SettingsSection>
        <SettingsChoiceRow<SyncNetwork>
          title={t('settings.sources.network')}
          value={
            autoSync.network === 'wifi'
              ? t('settings.sources.networkWifi')
              : t('settings.sources.networkAny')
          }
          options={[
            { value: 'wifi', label: t('settings.sources.networkWifi') },
            { value: 'any', label: t('settings.sources.networkAny') },
          ]}
          onChange={(network) =>
            setSources({ autoSync: { ...sources.autoSync, network } })
          }
        />
        <SettingsSwitchRow
          title={t('settings.sources.backgroundSync')}
          value={autoSync.background}
          onValueChange={(background) =>
            setSources({ autoSync: { ...sources.autoSync, background } })
          }
        />
        <SettingsSwitchRow
          title={t('settings.sources.retry')}
          value={autoSync.retry}
          onValueChange={(retry) =>
            setSources({ autoSync: { ...sources.autoSync, retry } })
          }
        />
      </SettingsSection>

      <SettingsSection title={t('settings.sources.recentSync')}>
        <MosaicListRow
          title={t('settings.sources.weather')}
          subtitle={t('settings.sources.lastSyncValue')}
          trailing={
            <MosaicText variant="caption" tone="success">
              {t('settings.sources.syncDone')}
            </MosaicText>
          }
          chevron={false}
        />
        <MosaicListRow
          title={t('settings.sources.location')}
          subtitle={t('settings.sources.lastSyncValue')}
          trailing={
            <MosaicText variant="caption" tone="success">
              {t('settings.sources.syncDone')}
            </MosaicText>
          }
          chevron={false}
        />
      </SettingsSection>
    </SettingsPageShell>
  );
}
