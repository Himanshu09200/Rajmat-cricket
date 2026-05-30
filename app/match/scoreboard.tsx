import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, DataTable } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMatchStore, getDeliveryLabel } from '../../store/useMatchStore';

export default function ScoreboardScreen() {
  const router = useRouter();
  const { deliveries, battingTeam, bowlingTeam, runs, wickets, overs, balls, totalOvers } = useMatchStore();

  const totalBalls = overs * 6 + balls;
  const crr = totalBalls > 0 ? ((runs / totalBalls) * 6).toFixed(2) : '0.00';

  // Group by overs
  const overMap: Record<number, typeof deliveries> = {};
  deliveries.forEach((d) => {
    if (!overMap[d.overIndex]) overMap[d.overIndex] = [];
    overMap[d.overIndex].push(d);
  });

  const getBallColor = (label: string) => {
    switch (label) {
      case 'W': return '#FF4757';
      case 'WD': return '#FECA57';
      case 'NB': return '#FF6B6B';
      case '4': return '#4AC29A';
      case '6': return '#6C8AFF';
      case '0': return 'rgba(255,255,255,0.08)';
      default: return 'rgba(255,255,255,0.12)';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0B1120', '#121D33']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SCOREBOARD</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Score Summary */}
        <View style={styles.summaryCard}>
          <LinearGradient
            colors={['rgba(245,166,35,0.08)', 'rgba(245,166,35,0.01)']}
            style={StyleSheet.absoluteFillObject}
          />
          <Text style={styles.teamName}>{battingTeam}</Text>
          <View style={styles.scoreRow}>
            <Text style={styles.bigScore}>{runs}/{wickets}</Text>
            <View style={styles.summaryRight}>
              <Text style={styles.summaryOvers}>{overs}.{balls} / {totalOvers} ov</Text>
              <Text style={styles.summaryCrr}>CRR: {crr}</Text>
            </View>
          </View>
        </View>

        {/* Over by Over */}
        <Text style={styles.sectionTitle}>OVER BY OVER</Text>
        {Object.keys(overMap).length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No deliveries yet</Text>
          </View>
        ) : (
          Object.entries(overMap).map(([overIdx, dels]) => {
            const overRuns = dels.reduce((sum, d) => sum + d.runs + d.extras, 0);
            return (
              <View key={overIdx} style={styles.overRow}>
                <View style={styles.overIndexBox}>
                  <Text style={styles.overIndexText}>{parseInt(overIdx) + 1}</Text>
                </View>
                <View style={styles.overBalls}>
                  {dels.map((d, i) => {
                    const label = getDeliveryLabel(d);
                    return (
                      <View
                        key={i}
                        style={[styles.ballCircle, { backgroundColor: getBallColor(label) }]}
                      >
                        <Text style={styles.ballText}>{label}</Text>
                      </View>
                    );
                  })}
                </View>
                <Text style={styles.overRunsText}>{overRuns}</Text>
              </View>
            );
          })
        )}

        {/* Ball by Ball Table */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>BALL BY BALL</Text>
        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { flex: 1 }]}>Over</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>Runs</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>Type</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>Extras</Text>
          </View>
          {deliveries.map((d) => {
            const label = getDeliveryLabel(d);
            return (
              <View key={d.id} style={styles.tableRow}>
                <Text style={[styles.tableCellVal, { flex: 1 }]}>{d.overIndex}.{d.ballIndex}</Text>
                <Text style={[styles.tableCellVal, { flex: 1 }]}>{d.runs}</Text>
                <Text style={[styles.tableCellVal, { flex: 1.5, color: d.isWicket ? '#FF4757' : 'rgba(255,255,255,0.6)' }]}>
                  {d.isWicket ? `W (${d.wicketType || 'out'})` : label}
                </Text>
                <Text style={[styles.tableCellVal, { flex: 1 }]}>{d.extras > 0 ? d.extras : '-'}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245,166,35,0.1)',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  // Summary
  summaryCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.12)',
    padding: 20,
    marginBottom: 24,
    overflow: 'hidden',
  },
  teamName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F5A623',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bigScore: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  summaryOvers: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
  },
  summaryCrr: {
    fontSize: 13,
    color: '#F5A623',
    fontWeight: '700',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 2,
    marginBottom: 12,
  },
  // Over by over
  overRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
    gap: 10,
  },
  overIndexBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(245,166,35,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overIndexText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F5A623',
  },
  overBalls: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  ballCircle: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  ballText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  overRunsText: {
    fontSize: 14,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.5)',
    minWidth: 24,
    textAlign: 'right',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.2)',
  },
  // Table
  tableCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  tableCell: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  tableCellVal: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
});
