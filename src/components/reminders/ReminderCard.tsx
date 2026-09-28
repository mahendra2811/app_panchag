import { Bell, BellOff, Check, Repeat } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Card } from '@/components/ui';
import { colors, minimumTouchTarget, radius, spacing } from '@/theme';

export type ReminderCardProps = {
  title: string;
  dueLabel: string;
  categoryLabel?: string;
  notes?: string;
  completed?: boolean;
  notificationEnabled?: boolean;
  recurrenceLabel?: string;
  onPress?: () => void;
  onToggleComplete?: () => void;
  completeActionLabel?: string;
  undoActionLabel?: string;
};

export function ReminderCard({ title, dueLabel, categoryLabel, notes, completed = false, notificationEnabled, recurrenceLabel, onPress, onToggleComplete, completeActionLabel, undoActionLabel }: ReminderCardProps) {
  return (
    <Card padded={false} style={completed ? styles.completed : undefined}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={[title, dueLabel, categoryLabel].filter(Boolean).join(', ')}
          onPress={onPress}
          disabled={!onPress}
          style={styles.content}
        >
          <View style={styles.titleRow}>
            <AppText variant="body" weight="700" style={[styles.title, completed && styles.strike]}>{title}</AppText>
            {notificationEnabled === true ? <Bell size={16} color={colors.primary} /> : notificationEnabled === false ? <BellOff size={16} color={colors.muted} /> : null}
          </View>
          <AppText variant="small" tone="muted">{dueLabel}</AppText>
          {categoryLabel ? <AppText variant="caption" tone="primary" weight="600">{categoryLabel}</AppText> : null}
          {notes ? <AppText variant="small" tone="muted" numberOfLines={2}>{notes}</AppText> : null}
          {recurrenceLabel ? <View style={styles.repeat}><Repeat size={14} color={colors.muted} /><AppText variant="caption" tone="muted">{recurrenceLabel}</AppText></View> : null}
        </Pressable>
        {onToggleComplete ? (
          <Pressable
            accessibilityRole="checkbox"
            accessibilityLabel={completed ? undoActionLabel ?? title : completeActionLabel ?? title}
            accessibilityState={{ checked: completed }}
            onPress={onToggleComplete}
            style={[styles.checkbox, completed && styles.checked]}
          >
            {completed ? <Check size={20} color={colors.surface} /> : null}
          </Pressable>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  completed: { opacity: 0.72 },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.sm },
  content: { flex: 1, minHeight: minimumTouchTarget, justifyContent: 'center', gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { flex: 1 },
  strike: { textDecorationLine: 'line-through' },
  repeat: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  checkbox: { width: minimumTouchTarget, height: minimumTouchTarget, borderWidth: 2, borderColor: colors.primary, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  checked: { backgroundColor: colors.primary },
});
