import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';

export function Divider() { return <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.line} />; }
const styles = StyleSheet.create({ line: { height: 1, backgroundColor: colors.border } });
