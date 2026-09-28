import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui';
import { PanchangRouteShell, PanchangSection, TimeRangeRow, formatPanchangInstant, resolvePanchangDate } from '@/components/panchang';
import { usePreferences } from '@/store/preferences';
import type { PanchangPeriod } from '@/services/panchang';

export default function ChoghadiyaScreen() {
  const params = useLocalSearchParams<{ date?: string }>();
  const date = resolvePanchangDate(params.date);
  const { t } = useTranslation();
  const language = usePreferences((state) => state.language);
  const devanagariDigits = usePreferences((state) => state.devanagariDigits);
  const render = (periods: PanchangPeriod[]) => periods.length > 0 ? periods.map((period) => (
    <TimeRangeRow
      key={period.id}
      label={`${period.name}${period.quality ? ` · ${t(period.quality)}` : ''}`}
      start={formatPanchangInstant(period.startsAt, language, devanagariDigits, true)}
      end={formatPanchangInstant(period.endsAt, language, devanagariDigits, true)}
      unavailableLabel={t('dataUnavailable')}
    />
  )) : <AppText tone="muted">{t('notSupported')}</AppText>;
  return (
    <PanchangRouteShell date={date} title={t('choghadiya')}>
      {(day) => (
        <>
          <PanchangSection title={t('dayPeriods')}>
            {render(day.namedPeriods.choghadiyaDay ?? [])}
          </PanchangSection>
          <PanchangSection title={t('nightPeriods')}>
            {render(day.namedPeriods.choghadiyaNight ?? [])}
          </PanchangSection>
        </>
      )}
    </PanchangRouteShell>
  );
}
