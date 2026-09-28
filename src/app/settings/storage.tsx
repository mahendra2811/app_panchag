import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppText, Button, Card, ConfirmDialog, SectionHeader } from '@/components/ui';
import { Page } from '@/features/common/Page';
import { clearPanchangCache, getPanchangCacheSize } from '@/services/panchang';
import { spacing } from '@/theme';

export default function StorageSettingsScreen() {
  const { t } = useTranslation();
  const [count, setCount] = useState(getPanchangCacheSize());
  const [confirming, setConfirming] = useState(false);
  const [cleared, setCleared] = useState(false);
  const clear = () => {
    clearPanchangCache();
    setCount(getPanchangCacheSize());
    setCleared(true);
    setConfirming(false);
  };
  return (
    <Page title={t('storage')}>
      <Card style={{ gap: spacing.sm }}>
        <SectionHeader title={t('cacheEntries')} />
        <AppText variant="title" weight="700">{count}</AppText>
        <AppText variant="small" tone="muted">{t('clearCacheHint')}</AppText>
        <Button title={t('clearCache')} onPress={() => setConfirming(true)} variant="secondary" disabled={count === 0} />
        {cleared ? <AppText variant="small" tone="success">{t('cacheCleared')}</AppText> : null}
      </Card>
      <ConfirmDialog
        visible={confirming}
        title={t('clearCache')}
        description={t('clearCacheHint')}
        cancelLabel={t('cancel')}
        confirmLabel={t('clear')}
        onCancel={() => setConfirming(false)}
        onConfirm={clear}
      />
    </Page>
  );
}
