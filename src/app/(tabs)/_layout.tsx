import { Tabs } from 'expo-router';
import { Bell, CalendarDays, House, Menu } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '@/theme';

export default function TabLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      safeAreaInsets={{ bottom: 0, left: 0, right: 0 }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#A83E0C',
        tabBarInactiveTintColor: '#78685A',
        sceneStyle: { backgroundColor: colors.background },
        tabBarHideOnKeyboard: true,
        // Keep the bar in normal layout flow so screen content ends above it.
        // The system inset is outside the rounded surface, followed by a visible gap.
        tabBarStyle: {
          backgroundColor: colors.surfaceWarm,
          borderColor: colors.border,
          borderWidth: 1,
          borderTopWidth: 1,
          borderRadius: radius.xl,
          height: 68,
          paddingTop: spacing.sm,
          paddingBottom: spacing.sm,
          marginLeft: insets.left + spacing.lg,
          marginRight: insets.right + spacing.lg,
          marginTop: spacing.sm,
          marginBottom: insets.bottom + spacing.md,
          elevation: 4,
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: t('calendar'),
          tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: t('reminders'),
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: t('more'),
          tabBarIcon: ({ color, size }) => <Menu color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
