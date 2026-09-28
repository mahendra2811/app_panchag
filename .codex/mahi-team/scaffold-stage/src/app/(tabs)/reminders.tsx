import { StyleSheet, Text, View } from 'react-native';

export default function RemindersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reminders</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF8EC' },
  title: { fontSize: 24, fontWeight: '700', color: '#2B2118' },
});
