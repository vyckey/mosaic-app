import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { MosaicButton, MosaicListRow } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';
import { useAiMemoryStore, useDataStore } from '@/stores';

import { SettingsConfirmDialog } from './components/SettingsConfirmDialog';
import { SettingsInfoDialog } from './components/SettingsInfoDialog';
import { SettingsPageShell } from './components/SettingsPageShell';
import {
  SettingsChoiceRow,
  SettingsSwitchRow,
} from './components/SettingsRows';
import { SettingsSection } from './components/SettingsSection';

type ExportRange = 'all' | 'period' | 'type';
type ExportFormat = 'json' | 'markdown' | 'pdf';
type BackupFrequency = 'daily' | 'weekly' | 'monthly';
type DeleteAction = 'cache' | 'records' | 'category' | 'ai' | 'all' | 'account';

export function DataScreen() {
  const { t } = useI18n();
  const exportedAt = useDataStore((state) => state.exportedAt);
  const lastBackupAt = useDataStore((state) => state.lastBackupAt);

  return (
    <SettingsPageShell title={t('settings.data.title')}>
      <SettingsSection>
        <MosaicListRow
          title={t('settings.data.storage')}
          value={t('settings.data.storageValue')}
          onPress={() => router.push('/settings/data/storage')}
        />
        <MosaicListRow
          title={t('settings.data.export')}
          value={
            exportedAt
              ? t('settings.data.exportDoneValue')
              : t('settings.data.exportValue')
          }
          onPress={() => router.push('/settings/data/export')}
        />
        <MosaicListRow
          title={t('settings.data.backup')}
          value={t('settings.data.backupValue', { time: lastBackupAt })}
          onPress={() => router.push('/settings/data/backup')}
        />
      </SettingsSection>

      <SettingsSection>
        <MosaicListRow
          title={t('settings.data.delete')}
          subtitle={t('settings.data.deleteHint')}
          onPress={() => router.push('/settings/data/delete')}
        />
      </SettingsSection>
    </SettingsPageShell>
  );
}

export function StorageScreen() {
  const { t } = useI18n();
  const cacheMb = useDataStore((state) => state.cacheMb);
  const clearCache = useDataStore((state) => state.clearCache);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [cleanedVisible, setCleanedVisible] = useState(false);

  const rows = [
    { key: 'images', label: t('settings.data.storageImages'), value: '1.8 GB' },
    { key: 'videos', label: t('settings.data.storageVideos'), value: '320 MB' },
    { key: 'audio', label: t('settings.data.storageAudio'), value: '60 MB' },
    {
      key: 'cache',
      label: t('settings.data.storageCache'),
      value: `${cacheMb} MB`,
    },
  ];

  return (
    <SettingsPageShell title={t('settings.data.storage')}>
      <SettingsSection
        description={t('settings.data.storageUsed', {
          size: t('settings.data.storageValue'),
        })}
      >
        {rows.map((row) => (
          <MosaicListRow
            key={row.key}
            title={row.label}
            value={row.value}
            chevron={false}
          />
        ))}
      </SettingsSection>

      <MosaicButton
        variant="secondary"
        size="lg"
        disabled={cacheMb === 0}
        onPress={() => setConfirmVisible(true)}
      >
        {t('settings.data.cleanCache')}
      </MosaicButton>

      <SettingsConfirmDialog
        visible={confirmVisible}
        title={t('settings.data.cleanCache')}
        message={t('settings.data.cleanCacheConfirm')}
        confirmLabel={t('settings.data.cleanCache')}
        onConfirm={() => {
          clearCache();
          setConfirmVisible(false);
          setCleanedVisible(true);
        }}
        onClose={() => setConfirmVisible(false)}
      />

      <SettingsInfoDialog
        visible={cleanedVisible}
        title={t('settings.data.cleanCache')}
        message={t('settings.data.cacheCleaned')}
        onClose={() => setCleanedVisible(false)}
      />
    </SettingsPageShell>
  );
}

export function ExportDataScreen() {
  const { t } = useI18n();
  const markExported = useDataStore((state) => state.markExported);
  const [range, setRange] = useState<ExportRange>('all');
  const [format, setFormat] = useState<ExportFormat>('json');
  const [includeMedia, setIncludeMedia] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [doneVisible, setDoneVisible] = useState(false);
  const [downloadVisible, setDownloadVisible] = useState(false);

  const startExport = () => {
    setExporting(true);
    // Simulated export job; replace with the real exporter once the backend
    // endpoint exists.
    setTimeout(() => {
      setExporting(false);
      markExported();
      setDoneVisible(true);
    }, 900);
  };

  return (
    <SettingsPageShell
      title={t('settings.data.export')}
      subtitle={t('settings.data.exportHint')}
    >
      <SettingsSection>
        <SettingsChoiceRow<ExportRange>
          title={t('settings.data.exportRange')}
          value={
            {
              all: t('settings.data.exportAll'),
              period: t('settings.data.exportPeriod'),
              type: t('settings.data.exportType'),
            }[range]
          }
          options={[
            { value: 'all', label: t('settings.data.exportAll') },
            { value: 'period', label: t('settings.data.exportPeriod') },
            { value: 'type', label: t('settings.data.exportType') },
          ]}
          onChange={setRange}
        />
        <SettingsChoiceRow<ExportFormat>
          title={t('settings.data.exportFormat')}
          value={
            {
              json: t('settings.data.exportFormatJson'),
              markdown: t('settings.data.exportFormatMarkdown'),
              pdf: t('settings.data.exportFormatPdf'),
            }[format]
          }
          options={[
            { value: 'json', label: t('settings.data.exportFormatJson') },
            {
              value: 'markdown',
              label: t('settings.data.exportFormatMarkdown'),
            },
            { value: 'pdf', label: t('settings.data.exportFormatPdf') },
          ]}
          onChange={setFormat}
        />
      </SettingsSection>

      <SettingsSection>
        <SettingsSwitchRow
          title={t('settings.data.exportMedia')}
          value={includeMedia}
          onValueChange={setIncludeMedia}
        />
      </SettingsSection>

      <MosaicButton
        size="lg"
        disabled={exporting}
        onPress={startExport}
      >
        {exporting
          ? t('settings.data.exportPreparing')
          : t('settings.data.exportStart')}
      </MosaicButton>

      <SettingsSection>
        <MosaicListRow
          title={t('settings.data.exportDownload')}
          subtitle={t('settings.data.exportHint')}
          onPress={() => setDownloadVisible(true)}
        />
      </SettingsSection>

      <SettingsInfoDialog
        visible={doneVisible}
        title={t('settings.data.exportDone')}
        message={t('settings.data.exportHint')}
        onClose={() => setDoneVisible(false)}
      />

      <SettingsInfoDialog
        visible={downloadVisible}
        title={t('settings.data.exportDownload')}
        message={t('settings.data.exportHint')}
        onClose={() => setDownloadVisible(false)}
      />
    </SettingsPageShell>
  );
}

export function BackupScreen() {
  const { t } = useI18n();
  const lastBackupAt = useDataStore((state) => state.lastBackupAt);
  const markBackedUp = useDataStore((state) => state.markBackedUp);
  const [autoBackup, setAutoBackup] = useState(true);
  const [frequency, setFrequency] =
    useState<BackupFrequency>('weekly');
  const [backupVisible, setBackupVisible] = useState(false);

  const handleBackup = () => {
    markBackedUp();
    setBackupVisible(true);
  };

  return (
    <SettingsPageShell title={t('settings.data.backup')}>
      <SettingsSection>
        <SettingsSwitchRow
          title={t('settings.data.backupAuto')}
          value={autoBackup}
          onValueChange={setAutoBackup}
        />
        <SettingsChoiceRow<BackupFrequency>
          title={t('settings.data.backupFrequency')}
          value={
            {
              daily: t('settings.data.backupDaily'),
              weekly: t('settings.data.backupWeekly'),
              monthly: t('settings.data.backupMonthly'),
            }[frequency]
          }
          disabled={!autoBackup}
          options={[
            { value: 'daily', label: t('settings.data.backupDaily') },
            { value: 'weekly', label: t('settings.data.backupWeekly') },
            { value: 'monthly', label: t('settings.data.backupMonthly') },
          ]}
          onChange={setFrequency}
        />
        <MosaicListRow
          title={t('settings.data.lastBackup')}
          value={lastBackupAt}
          chevron={false}
        />
      </SettingsSection>

      <View className="gap-3">
        <MosaicButton size="lg" onPress={handleBackup}>
          {t('settings.data.backupNow')}
        </MosaicButton>
        <MosaicListRow
          title={t('settings.data.backupRestore')}
          value={t('settings.data.backupRestoreSoon')}
          disabled
          chevron={false}
        />
      </View>

      <SettingsInfoDialog
        visible={backupVisible}
        title={t('settings.data.backupNow')}
        message={t('settings.data.backupDone')}
        onClose={() => setBackupVisible(false)}
      />
    </SettingsPageShell>
  );
}

const DELETE_ROWS: { key: DeleteAction; labelKey: string }[] = [
  { key: 'cache', labelKey: 'settings.data.deleteCache' },
  { key: 'records', labelKey: 'settings.data.deleteRecords' },
  { key: 'category', labelKey: 'settings.data.deleteCategory' },
  { key: 'ai', labelKey: 'settings.data.deleteAiMemory' },
  { key: 'all', labelKey: 'settings.data.deleteAll' },
  { key: 'account', labelKey: 'settings.data.deleteAccount' },
];

export function DataDeletionScreen() {
  const { t } = useI18n();
  const clearCache = useDataStore((state) => state.clearCache);
  const clearMemories = useAiMemoryStore((state) => state.clearMemories);
  const [action, setAction] = useState<DeleteAction | null>(null);
  const [doneVisible, setDoneVisible] = useState(false);

  const performDelete = () => {
    switch (action) {
      case 'cache':
        clearCache();
        break;
      case 'ai':
        clearMemories();
        break;
      case 'account':
        setAction(null);
        router.push('/settings/security/delete-account');
        return;
      default:
        // Record/category/all deletions need the data layer; the UI already
        // confirms the intent so this is the hook point for it.
        console.log('[settings] delete data:', action);
    }
    setAction(null);
    setDoneVisible(true);
  };

  const actionLabel = action
    ? t(DELETE_ROWS.find((row) => row.key === action)?.labelKey ?? '')
    : '';

  return (
    <SettingsPageShell title={t('settings.data.delete')}>
      <SettingsSection>
        {DELETE_ROWS.map((row) => (
          <MosaicListRow
            key={row.key}
            title={t(row.labelKey)}
            tone={row.key === 'all' || row.key === 'account' ? 'danger' : 'default'}
            chevron={false}
            onPress={() => setAction(row.key)}
          />
        ))}
      </SettingsSection>

      <SettingsConfirmDialog
        visible={action !== null}
        title={t('settings.data.deleteConfirmTitle')}
        message={`${actionLabel}\n${t('settings.data.deleteConfirmMessage')}`}
        confirmLabel={t('common.delete')}
        danger
        onConfirm={performDelete}
        onClose={() => setAction(null)}
      />

      <SettingsInfoDialog
        visible={doneVisible}
        title={t('settings.data.delete')}
        message={t('settings.data.deleteDone')}
        onClose={() => setDoneVisible(false)}
      />
    </SettingsPageShell>
  );
}
