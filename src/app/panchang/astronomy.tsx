import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui';
import { PanchangRouteShell, PanchangSection, TimeRangeRow, formatPanchangInstant, resolvePanchangDate } from '@/components/panchang';
import { usePreferences } from '@/store/preferences';
import type { Availability, PanchangDay } from '@/services/panchang';

type AstronomyKey = keyof PanchangDay['astronomy'];

export default function AstronomyScreen() {
  const params = useLocalSearchParams<{ date?: string }>();
  const date = resolvePanchangDate(params.date);
  const { t } = useTranslation();
  const language = usePreferences((state) => state.language);
  const devanagariDigits = usePreferences((state) => state.devanagariDigits);
  const statusLabel = (status: Availability) => status === 'no_event' ? t('noEvent') : status === 'not_supported' ? t('notSupported') : t('dataUnavailable');
  const keys: AstronomyKey[] = ['sunrise', 'sunset', 'nextSunrise', 'moonrise', 'moonset'];
  return (
    <PanchangRouteShell date={date} title={t('astronomy')}>
      {(day) => (
        <>
          <PanchangSection title={t('astronomy')}>
            {keys.map((key) => {
              const entry = day.astronomy[key];
              return <TimeRangeRow key={key} label={t(key)} value={entry.instant ? formatPanchangInstant(entry.instant, language, devanagariDigits, key === 'nextSunrise') : statusLabel(entry.status)} />;
            })}
          </PanchangSection>
          <PanchangSection title={t('details')} initiallyExpanded={false}>
            <TimeRangeRow label={t('moonPhase')} value={t('notSupported')} />
            <TimeRangeRow label={t('sunSign')} value={t('notSupported')} />
            <TimeRangeRow label={t('moonSign')} value={t('notSupported')} />
          </PanchangSection>
          <AppText variant="small" tone="muted">{t('sourceHint')}</AppText>
        </>
      )}
    </PanchangRouteShell>
  );
}
