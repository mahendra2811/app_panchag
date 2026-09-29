import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, Button, Card, LoadingState, StatusState } from '@/components/ui';
import { parseCivilDate, todayInTimezone } from '@/domain/calendar';
import { Page } from '@/features/common/Page';
import { usePanchangDay } from '@/features/panchang/usePanchang';
import { localizeDigits } from '@/i18n';
import { intlLocale, type AppLanguage } from '@/i18n/languages';
import { loadPanchangDay, type PanchangDay, type PanchangLoadResult, type PanchangProfile } from '@/services/panchang';
import { usePreferences } from '@/store/preferences';
import { spacing } from '@/theme';
import { PanchangDateChooser } from './PanchangDateChooser';

export function resolvePanchangDate(param: string | string[] | undefined): string {
  if (typeof param === 'string') return param;
  if (Array.isArray(param)) return param[0] ?? '';
  return todayInTimezone();
}

export function formatPanchangDate(date: string, language: AppLanguage, devanagariDigits = false): string {
  const parts = parseCivilDate(date);
  if (!parts) return date;
  const instant = new Date(0);
  instant.setUTCFullYear(parts.year, parts.month - 1, parts.day);
  instant.setUTCHours(12, 0, 0, 0);
  const label = new Intl.DateTimeFormat(intlLocale(language), { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(instant);
  return localizeDigits(label, language, devanagariDigits);
}

export function formatPanchangInstant(instant: string | null, language: AppLanguage, devanagariDigits = false, withDate = false): string | undefined {
  if (!instant) return undefined;
  const value = new Date(instant);
  if (!Number.isFinite(value.getTime())) return undefined;
  const label = new Intl.DateTimeFormat(intlLocale(language), {
    ...(withDate ? { day: 'numeric' as const, month: 'short' as const } : {}),
    hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
  }).format(value);
  return localizeDigits(label, language, devanagariDigits);
}

export type PanchangRouteShellProps = {
  date: string;
  title: string;
  children: (day: PanchangDay) => ReactNode;
  showDateChooser?: boolean;
  profileOverride?: PanchangProfile;
};

type DayViewState = ReturnType<typeof usePanchangDay>;

export function PanchangRouteShell(props: PanchangRouteShellProps) {
  return props.profileOverride ? <OverrideProfileShell {...props} profileOverride={props.profileOverride} /> : <SavedProfileShell {...props} />;
}

function SavedProfileShell(props: PanchangRouteShellProps) {
  const state = usePanchangDay(props.date);
  return <ShellContent {...props} state={state} />;
}

function OverrideProfileShell(props: PanchangRouteShellProps & { profileOverride: PanchangProfile }) {
  const language = usePreferences((state) => state.language);
  const [result, setResult] = useState<PanchangLoadResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    let cancelled = false;
    setResult(null);
    setLoading(true);
    void loadPanchangDay(props.date, props.profileOverride, language).then((next) => {
      if (!cancelled) { setResult(next); setLoading(false); }
    }).catch(() => { if (!cancelled) { setResult({ status: 'not_supported', day: null, reason: 'Calculation failed' }); setLoading(false); } });
    return () => { cancelled = true; };
  }, [props.date, props.profileOverride, language, revision]);
  const state: DayViewState = { profile: props.profileOverride, result, day: result?.status === 'available' ? result.day : null, loading, reload };
  return <ShellContent {...props} state={state} />;
}

function ShellContent({ date, title, children, showDateChooser = true, state }: PanchangRouteShellProps & { state: DayViewState }) {
  const router = useRouter();
  const { t } = useTranslation();
  const language = usePreferences((state) => state.language);
  const devanagariDigits = usePreferences((state) => state.devanagariDigits);
  const { profile, day, result, loading, reload } = state;
  const dateLabel = formatPanchangDate(date, language, devanagariDigits);
  const visibleDay = day && profile && day.date === date && day.profile.cityId === profile.cityId && day.profile.monthSystem === profile.monthSystem && day.profile.region === profile.region ? day : null;
  return (
    <Page title={title} subtitle={dateLabel}>
      {showDateChooser ? (
        <PanchangDateChooser
          date={date}
          label={t('date')}
          todayLabel={t('today')}
          onSelect={(next) => router.setParams({ date: next })}
          onToday={() => router.setParams({ date: todayInTimezone() })}
        />
      ) : null}
      {!profile ? <StatusState title={t('locationNeeded')} actionLabel={t('selectCity')} onAction={() => router.push('/settings/location')} /> : null}
      {profile && loading ? <LoadingState label={t('loading')} /> : null}
      {profile && !loading && result && result.status !== 'available' ? (
        <StatusState
          title={result.status === 'outside_coverage' ? t('outsideCoverage') : result.status === 'not_supported' ? t('notSupported') : result.status === 'invalid' ? t('invalidDate') : t('dataUnavailable')}
          description={t('sourceHint')}
          actionLabel={t('retry')}
          onAction={reload}
        />
      ) : null}
      {visibleDay ? (
        <>
          <Card style={styles.sourceCard}>
            <AppText variant="body" weight="700">{t('calculated', { city: visibleDay.cityName })}</AppText>
            <AppText variant="small" tone="muted">{t(visibleDay.profile.monthSystem)} · {visibleDay.timezone}</AppText>
            {visibleDay.provenance.coordinateStatus === 'postal_district_approximation' ? <AppText variant="small" tone="muted">{t('districtApproximation')}</AppText> : null}
            <AppText variant="caption" tone="muted">{t('sourceHint')}</AppText>
          </Card>
          <View style={styles.sections}>{children(visibleDay)}</View>
        </>
      ) : null}
      {profile && !loading && !result ? <Button title={t('retry')} onPress={reload} variant="secondary" /> : null}
    </Page>
  );
}

const styles = StyleSheet.create({ sourceCard: { gap: spacing.xs }, sections: { gap: spacing.md } });
