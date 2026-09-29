import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText, Card } from '@/components/ui';
import { PanchangRouteShell, PanchangSection, TimeRangeRow, formatPanchangInstant, resolvePanchangDate } from '@/components/panchang';
import { MenuRow } from '@/features/common/Page';
import { usePreferences } from '@/store/preferences';
import type { PanchangPeriod } from '@/services/panchang';
import { localizeMasa, localizeTithi } from '@/i18n/panchang';

export default function PanchangScreen() {
  const params = useLocalSearchParams<{ date?: string }>();
  const date = resolvePanchangDate(params.date);
  const router = useRouter();
  const { t } = useTranslation();
  const language = usePreferences((state) => state.language);
  const devanagariDigits = usePreferences((state) => state.devanagariDigits);
  const renderPeriod = (entry: PanchangPeriod) => (
    <TimeRangeRow
      key={`${entry.id}:${entry.startsAt ?? ''}`}
      label={entry.id.startsWith('tithi:') ? localizeTithi(entry.id, entry.paksha ?? null, entry.name, language) : entry.name}
      start={formatPanchangInstant(entry.startsAt, language, devanagariDigits, true)}
      end={formatPanchangInstant(entry.endsAt, language, devanagariDigits, true)}
      unavailableLabel={t('dataUnavailable')}
    />
  );
  return (
    <PanchangRouteShell date={date} title={t('fullPanchang')}>
      {(day) => (
        <>
          <Card>
            <AppText variant="subtitle" weight="700">{localizeMasa(day.summaryAtSunrise.masaId, day.summaryAtSunrise.masaName, language) || t('lunarMonth')}</AppText>
            {day.summaryAtSunrise.tithiName ? <AppText tone="primary" weight="600">{localizeTithi(day.summaryAtSunrise.tithiId, day.summaryAtSunrise.pakshaId, day.summaryAtSunrise.tithiName, language)}</AppText> : null}
            <AppText variant="small" tone="muted">{t(day.profile.monthSystem)} · {t('samvat')} {day.summaryAtSunrise.vikramSamvat ?? '—'}</AppText>
          </Card>
          <PanchangSection title={t('fiveLimbs')}>
            <TimeRangeRow label={t('vara')} value={day.limbs.varaName} />
            {(['tithi', 'nakshatra', 'yoga', 'karana'] as const).map((name) => (
              <PanchangSection key={name} title={t(name)} initiallyExpanded={name === 'tithi'}>
                {day.limbs[name].length > 0 ? day.limbs[name].map(renderPeriod) : <AppText tone="muted">{t('dataUnavailable')}</AppText>}
              </PanchangSection>
            ))}
          </PanchangSection>
          <PanchangSection title={t('astronomy')} initiallyExpanded={false}>
            <TimeRangeRow label={t('sunrise')} value={formatPanchangInstant(day.astronomy.sunrise.instant ?? null, language, devanagariDigits) ?? t('noEvent')} />
            <TimeRangeRow label={t('sunset')} value={formatPanchangInstant(day.astronomy.sunset.instant ?? null, language, devanagariDigits) ?? t('noEvent')} />
            <TimeRangeRow label={t('moonrise')} value={formatPanchangInstant(day.astronomy.moonrise.instant ?? null, language, devanagariDigits) ?? t('noEvent')} />
            <TimeRangeRow label={t('moonset')} value={formatPanchangInstant(day.astronomy.moonset.instant ?? null, language, devanagariDigits) ?? t('noEvent')} />
          </PanchangSection>
          <PanchangSection title={t('rahuKaal')} initiallyExpanded={false}>
            {(day.namedPeriods.rahuKalam ?? []).length > 0 ? day.namedPeriods.rahuKalam!.map(renderPeriod) : <AppText tone="muted">{t('dataUnavailable')}</AppText>}
          </PanchangSection>
          <MenuRow title={t('choghadiya')} onPress={() => router.push({ pathname: '/panchang/choghadiya', params: { date } })} />
          <MenuRow title={t('hora')} onPress={() => router.push({ pathname: '/panchang/hora', params: { date } })} />
          <MenuRow title={t('muhurta')} onPress={() => router.push({ pathname: '/panchang/muhurta', params: { date } })} />
          <MenuRow title={t('astronomy')} onPress={() => router.push({ pathname: '/panchang/astronomy', params: { date } })} />
        </>
      )}
    </PanchangRouteShell>
  );
}
