import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FestivalCard } from '@/components/festivals';
import { PanchangRouteShell, formatPanchangDate, resolvePanchangDate } from '@/components/panchang';
import { AppText, Button, Card, SectionHeader, StatusState } from '@/components/ui';
import { Page } from '@/features/common/Page';
import { usePanchangProfile } from '@/features/panchang/usePanchang';
import type { FestivalRegion } from '@/services/panchang';
import { usePreferences } from '@/store/preferences';

const VALID_REGIONS: readonly FestivalRegion[] = [
  'all', 'andhra-pradesh', 'assam', 'bihar', 'goa', 'gujarat', 'haryana', 'himachal-pradesh',
  'jharkhand', 'karnataka', 'kerala', 'madhya-pradesh', 'maharashtra', 'odisha', 'punjab',
  'rajasthan', 'tamil-nadu', 'telangana', 'uttar-pradesh', 'uttarakhand', 'west-bengal',
];

export default function FestivalDetailScreen() {
  const params = useLocalSearchParams<{ eventId?: string; date?: string; region?: string }>();
  const date = resolvePanchangDate(params.date);
  const eventId = typeof params.eventId === 'string' ? params.eventId : '';
  const { t } = useTranslation();
  const router = useRouter();
  const baseProfile = usePanchangProfile();
  const regionParam = typeof params.region === 'string' ? params.region : undefined;
  const validRegion = !regionParam || VALID_REGIONS.includes(regionParam as FestivalRegion);
  const profileOverride = useMemo(() => baseProfile && regionParam && validRegion ? { ...baseProfile, region: regionParam as FestivalRegion } : undefined, [baseProfile, regionParam, validRegion]);
  const language = usePreferences((state) => state.language);
  const devanagariDigits = usePreferences((state) => state.devanagariDigits);
  if (!validRegion) return <Page title={t('festival')}><StatusState title={t('notSupported')} /></Page>;
  return (
    <PanchangRouteShell date={date} title={t('festival')} showDateChooser={false} profileOverride={profileOverride}>
      {(day) => {
        const event = day.observances.find((entry) => entry.id === eventId);
        if (!event) return <StatusState title={t('noFestival')} description={t('sourceHint')} />;
        return (
          <>
            <FestivalCard
              title={event.name}
              dateLabel={formatPanchangDate(date, language, devanagariDigits)}
              categoryLabel={t(event.category, { defaultValue: event.category })}
            />
            <Card>
              <SectionHeader title={t('details')} />
              <AppText tone="muted">{t('festivalDescriptionUnavailable')}</AppText>
            </Card>
            <Card>
              <SectionHeader title={t('time')} />
              <AppText tone="muted">{t('festivalTimingUnavailable')}</AppText>
            </Card>
            <Button title={t('addReminder')} onPress={() => router.push({ pathname: '/reminders/create', params: { date } })} fullWidth />
          </>
        );
      }}
    </PanchangRouteShell>
  );
}
