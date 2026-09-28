import { useTranslation } from 'react-i18next';
import { AppText, Card, SectionHeader } from '@/components/ui';
import { Page } from '@/features/common/Page';
import { spacing } from '@/theme';

const PANCHANG_TS_MIT_NOTICE = `MIT License

Copyright (c) 2026 Ishank

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

export default function LicensesScreen() {
  const { t } = useTranslation();
  return (
    <Page title={t('licences')}>
      <Card style={{ gap: spacing.sm }}>
        <SectionHeader title={t('licencePanchang')} />
        <AppText variant="small" selectable>{PANCHANG_TS_MIT_NOTICE}</AppText>
      </Card>
      <Card style={{ gap: spacing.sm }}>
        <SectionHeader title={t('licenceLibraries')} />
        <AppText variant="small" tone="muted">Expo · React Native · React · i18next · Zustand · Lucide</AppText>
      </Card>
    </Page>
  );
}
