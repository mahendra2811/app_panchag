import { X } from 'lucide-react-native';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppText, IconButton } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';
import { LocationPicker } from './LocationPicker';

export function LocationPickerModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView style={styles.layer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} accessibilityRole="button" accessibilityLabel={t('close')} onPress={onClose} />
        <View style={[styles.panel, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <AppText variant="title" weight="700">{t('location')}</AppText>
            <IconButton label={t('close')} icon={<X size={22} color={colors.primary} />} onPress={onClose} />
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            {visible ? <LocationPicker onSelected={onClose} /> : null}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  layer: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: colors.overlay },
  panel: { height: '82%', backgroundColor: colors.background, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, overflow: 'hidden' },
  handle: { width: 42, height: 5, borderRadius: radius.pill, backgroundColor: colors.borderStrong, alignSelf: 'center', marginTop: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: spacing.lg, paddingRight: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xxl },
});
