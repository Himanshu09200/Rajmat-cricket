import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0B1120', '#121D33']}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.emptyState}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="clipboard-text-clock-outline" size={48} color="rgba(245,166,35,0.3)" />
        </View>
        <Text style={styles.emptyTitle}>No Match History</Text>
        <Text style={styles.emptySubtitle}>Completed matches will be shown here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(245,166,35,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.1)',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  emptySubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.2)',
  },
});
