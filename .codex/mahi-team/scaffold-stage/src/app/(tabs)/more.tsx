import { StyleSheet, Text, View } from 'react-native';

export default function MoreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>More</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF8EC' },
  title: { fontSize: 24, fontWeight: '700', color: '#2B2118' },
});
