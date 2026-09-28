import { Modal, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';
import { Button } from './Button';

export type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ visible, title, description, confirmLabel, cancelLabel, destructive = false, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.dialog} accessibilityViewIsModal>
          <AppText variant="subtitle" weight="700">{title}</AppText>
          {description ? <AppText tone="muted">{description}</AppText> : null}
          <View style={styles.actions}>
            <Button title={cancelLabel} variant="ghost" onPress={onCancel} />
            <Button title={confirmLabel} variant={destructive ? 'danger' : 'primary'} onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({ backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.overlay, padding: spacing.lg }, dialog: { width: '100%', maxWidth: 420, borderRadius: radius.xl, padding: spacing.xl, backgroundColor: colors.surface, gap: spacing.lg }, actions: { flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'wrap', gap: spacing.sm } });
