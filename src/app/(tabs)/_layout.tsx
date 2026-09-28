import { Tabs } from 'expo-router';
import { Bell, CalendarDays, House, Menu } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#A83E0C',
        tabBarInactiveTintColor: '#78685A',
        tabBarStyle: { backgroundColor: '#FFFCF6', borderTopColor: '#EADCC7', height: 68, paddingBottom: 7 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}>
      <Tabs.Screen name="index" options={{ title: t('home'), tabBarIcon: ({ color, size }) => <House color={color} size={size} /> }} />
      <Tabs.Screen name="calendar" options={{ title: t('calendar'), tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} /> }} />
      <Tabs.Screen name="reminders" options={{ title: t('reminders'), tabBarIcon: ({ color, size }) => <Bell color={color} size={size} /> }} />
      <Tabs.Screen name="more" options={{ title: t('more'), tabBarIcon: ({ color, size }) => <Menu color={color} size={size} /> }} />
    </Tabs>
  );
}
