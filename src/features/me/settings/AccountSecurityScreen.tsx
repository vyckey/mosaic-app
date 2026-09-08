import { useState } from 'react';
import { Switch, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

import {
  MosaicCard,
  MosaicList,
  MosaicListRow,
  MosaicText,
} from '@/components/mosaic';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n/useI18n';

import { SettingsPageShell } from './components/SettingsPageShell';

export function AccountSecurityScreen() {
  const { t } = useI18n();
  const theme = useTheme();
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  return (
    <SettingsPageShell title={t('settings.accountSecurity')}>
      <MosaicCard>
        <MosaicList>
          <MosaicListRow
            title={t('settings.changePassword')}
            onPress={() => {}}
          />
          <MosaicListRow
            title={t('settings.phone')}
            trailing={
              <View className="shrink-0 flex-row items-center gap-1">
                <MosaicText variant="caption" tone="text-muted">
                  {t('settings.notBound')}
                </MosaicText>
                <Icon as={ChevronRight} size="sm" className="text-text-subtle" />
              </View>
            }
            onPress={() => router.push('/login')}
          />
          <MosaicListRow
            title={t('settings.email')}
            trailing={
              <View className="shrink-0 flex-row items-center gap-1">
                <MosaicText variant="caption" tone="text-muted">
                  {t('settings.notBound')}
                </MosaicText>
                <Icon as={ChevronRight} size="sm" className="text-text-subtle" />
              </View>
            }
            onPress={() => router.push('/login')}
          />
          <MosaicListRow
            title={t('settings.biometricLock')}
            chevron={false}
            trailing={
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ true: theme.colors.primary }}
              />
            }
          />
        </MosaicList>
      </MosaicCard>
    </SettingsPageShell>
  );
}
