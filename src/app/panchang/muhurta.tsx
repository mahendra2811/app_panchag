import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui';
import { PanchangRouteShell, PanchangSection, TimeRangeRow, formatPanchangInstant, resolvePanchangDate } from '@/components/panchang';
import { usePreferences } from '@/store/preferences';
import type { PanchangPeriod } from '@/services/panchang';

const NAMED = ['abhijit', 'brahma', 'amritKala', 'vijaya', 'godhuli', 'nishita'] as const;
const INauspicious = ['rahuKalam', 'gulikaKalam', 'yamaganda', 'durMuhurta', 'varjyam'] as const;

export default function MuhurtaScreen() {
  const params = useLocalSearchParams<{ date?: string }>();
  const date = resolvePanchangDate(params.date);
  const { t } = useTranslation();
  const language = usePreferences((state) => state.language);
  const devanagariDigits = usePreferences((state) => state.devanagariDigits);
  const render = (periods: PanchangPeriod[]) => periods.map((period) => (
    <TimeRangeRow
      key={period.id}
      label={period.name}
      start={formatPanchangInstant(period.startsAt, language, devanagariDigits, true)}
      end={formatPanchangInstant(period.endsAt, language, devanagariDigits, true)}
      unavailableLabel={t('dataUnavailable')}
    />
  ));
  return (
    <PanchangRouteShell date={date} title={t('muhurta')}>
      {(day) => {
        const named = NAMED.flatMap((key) => day.namedPeriods[key] ?? []);
        const inauspicious = INauspicious.flatMap((key) => day.namedPeriods[key] ?? []);
        return (
          <>
            <PanchangSection title={t('muhurta')}>
              {named.length > 0 ? render(named) : <AppText tone="muted">{t('notSupported')}</AppText>}
            </PanchangSection>
            <PanchangSection title={t('inauspicious')} initiallyExpanded={false}>
              {inauspicious.length > 0 ? render(inauspicious) : <AppText tone="muted">{t('notSupported')}</AppText>}
            </PanchangSection>
            <AppText variant="small" tone="muted">{t('sourceHint')}</AppText>
          </>
        );
      }}
    </PanchangRouteShell>
  );
}
