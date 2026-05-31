import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMatchStore, Player, Delivery } from '../../store/useMatchStore';

// ----------------------------------------------------
// HELPER LOGIC FOR STATISTICS
// ----------------------------------------------------

const getBatsmanStats = (player: Player, deliveries: Delivery[], dismissedBatsmen: string[], striker: string, nonStriker: string) => {
  let runs = 0;
  let balls = 0;
  let fours = 0;
  let sixes = 0;
  let outStatus = 'Yet to bat';

  const faced = deliveries.filter((d) => d.strikerName === player.name);
  const isPlaying = striker === player.name || nonStriker === player.name;
  const isDismissed = dismissedBatsmen.includes(player.name);

  if (isPlaying) {
    outStatus = 'not out';
  } else if (isDismissed) {
    const wD = faced.find((d) => d.isWicket);
    if (wD) {
      if (wD.wicketType === 'bowled') outStatus = `b ${wD.bowlerName}`;
      else if (wD.wicketType === 'caught') outStatus = `c Fielder b ${wD.bowlerName}`;
      else if (wD.wicketType === 'lbw') outStatus = `lbw b ${wD.bowlerName}`;
      else if (wD.wicketType === 'stumped') outStatus = `st Wk b ${wD.bowlerName}`;
      else if (wD.wicketType === 'runOut') outStatus = 'run out';
      else if (wD.wicketType === 'hitWicket') outStatus = `hit wicket b ${wD.bowlerName}`;
      else outStatus = 'out';
    } else {
      outStatus = 'run out (non-striker)';
    }
  } else if (faced.length > 0 && !isPlaying && !isDismissed) {
    outStatus = 'retired hurt';
  }

  faced.forEach((d) => {
    if (d.type !== 'wide') balls++;
    runs += d.runs;
    if (d.runs === 4) fours++;
    if (d.runs === 6) sixes++;
  });

  const sr = balls > 0 ? ((runs / balls) * 100).toFixed(1) : '0.0';
  return { runs, balls, fours, sixes, sr, outStatus, facedAny: faced.length > 0 || isPlaying || isDismissed };
};

const getBowlerStats = (player: Player, deliveries: Delivery[], currentBowler: string) => {
  let runsGiven = 0;
  let legalBalls = 0;
  let wickets = 0;

  const bowled = deliveries.filter((d) => d.bowlerName === player.name);
  const oversMap: Record<number, { runs: number; legal: number }> = {};

  bowled.forEach((d) => {
    if (!oversMap[d.overIndex]) oversMap[d.overIndex] = { runs: 0, legal: 0 };
    if (d.type !== 'bye' && d.type !== 'legBye') {
      runsGiven += d.runs + d.extras;
      oversMap[d.overIndex].runs += d.runs + d.extras;
    }
    if (d.type === 'legal' || d.type === 'bye' || d.type === 'legBye') {
      legalBalls++;
      oversMap[d.overIndex].legal++;
    }
    if (d.isWicket && d.wicketType !== 'runOut' && d.wicketType !== 'retiredHurt' && d.wicketType !== 'obstructingField' && d.wicketType !== 'timedOut') {
      wickets++;
    }
  });

  let maidens = 0;
  Object.values(oversMap).forEach((ov) => {
    if (ov.legal === 6 && ov.runs === 0) maidens++;
  });

  const overs = Math.floor(legalBalls / 6);
  const remainder = legalBalls % 6;
  const oversStr = `${overs}.${remainder}`;
  const eco = legalBalls > 0 ? ((runsGiven / legalBalls) * 6).toFixed(1) : '0.0';
  const isCurrentlyBowling = currentBowler === player.name;

  return { overs: oversStr, maidens, runsGiven, wickets, eco, bowledAny: bowled.length > 0 || isCurrentlyBowling };
};

// ----------------------------------------------------
// ANIMATED CHEVRON COMPONENT
// ----------------------------------------------------

const AnimatedChevron = ({ expanded }: { expanded: boolean }) => {
  const rotation = useRef(new Animated.Value(expanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: expanded ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [expanded]);

  const rotateZ = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotateZ }] }}>
      <MaterialCommunityIcons name="chevron-down" size={20} color="#F5A623" />
    </Animated.View>
  );
};

// ----------------------------------------------------
// INNINGS CARD COMPONENT (reusable for both innings)
// ----------------------------------------------------

interface InningsCardProps {
  inningsNumber: 1 | 2;
  battingTeamName: string;
  bowlingTeamName: string;
  battingPlayers: Player[];
  bowlingPlayers: Player[];
  deliveries: Delivery[];
  dismissedBatsmen: string[];
  inningsRuns: number;
  inningsWickets: number;
  inningsOvers: number;
  inningsBalls: number;
  totalOvers: number;
  striker: string;
  nonStriker: string;
  currentBowler: string;
  isLive: boolean;
}

const InningsCard = ({
  inningsNumber, battingTeamName, bowlingTeamName,
  battingPlayers, bowlingPlayers, deliveries, dismissedBatsmen,
  inningsRuns, inningsWickets, inningsOvers, inningsBalls,
  totalOvers, striker, nonStriker, currentBowler, isLive,
}: InningsCardProps) => {
  const totalBalls = inningsOvers * 6 + inningsBalls;
  const crr = totalBalls > 0 ? ((inningsRuns / totalBalls) * 6).toFixed(2) : '0.00';

  return (
    <View style={styles.inningsContent}>
      {/* Mini Score Bar */}
      <View style={styles.miniScoreBar}>
        <View style={styles.miniScoreLeft}>
          <Text style={styles.miniTeamName}>{battingTeamName}</Text>
          {isLive && <View style={styles.liveDot} />}
        </View>
        <View style={styles.miniScoreRight}>
          <Text style={styles.miniScoreText}>{inningsRuns}/{inningsWickets}</Text>
          <Text style={styles.miniOversText}>({inningsOvers}.{inningsBalls} ov)</Text>
          <Text style={styles.miniCrrText}>CRR: {crr}</Text>
        </View>
      </View>

      {/* Batting Table */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>BATTING</Text>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.thStat}>R</Text>
          <Text style={styles.thStat}>B</Text>
          <Text style={styles.thStat}>4s</Text>
          <Text style={styles.thStat}>6s</Text>
          <Text style={[styles.thStat, { width: 36, textAlign: 'right' }]}>SR</Text>
        </View>
      </View>

      <View style={styles.cardContainer}>
        {battingPlayers.map((player, index) => {
          const stats = getBatsmanStats(player, deliveries, dismissedBatsmen, striker, nonStriker);
          const isStriker = striker === player.name;
          const isNonStriker = nonStriker === player.name;
          const isPlaying = isStriker || isNonStriker;

          return (
            <View key={`bat-${player.id}`} style={[
              styles.playerRow,
              index === battingPlayers.length - 1 && { borderBottomWidth: 0 },
              isPlaying && { backgroundColor: 'rgba(255,255,255,0.03)' }
            ]}>
              <View style={styles.playerInfoCol}>
                <View style={styles.avatarContainer}>
                  {player.image ? (
                    <Image source={player.image} style={[styles.avatarImg, player.isCaptain && styles.captainBorder]} />
                  ) : (
                    <View style={[styles.avatarImg, styles.avatarPlaceholder, player.isCaptain && styles.captainBorder]}>
                      <MaterialCommunityIcons name="account" size={20} color="rgba(255,255,255,0.4)" />
                    </View>
                  )}
                  {player.isCaptain && (
                    <View style={styles.captainBadge}>
                      <Text style={styles.captainBadgeText}>C</Text>
                    </View>
                  )}
                </View>
                <View style={{ flex: 1, paddingRight: 4 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.playerName, isPlaying && { color: '#FFF', fontWeight: '800' }]} numberOfLines={1}>
                      {player.name}
                    </Text>
                    {isStriker && <MaterialCommunityIcons name="cricket" size={14} color="#F5A623" style={{ marginLeft: 4 }} />}
                  </View>
                  <Text style={[
                    styles.playerStatus,
                    stats.outStatus === 'not out' && { color: '#4AC29A' },
                    stats.outStatus === 'Yet to bat' && { color: 'rgba(255,255,255,0.3)' }
                  ]} numberOfLines={1}>
                    {stats.outStatus}
                  </Text>
                </View>
              </View>

              {stats.facedAny ? (
                <View style={styles.statsRow}>
                  <Text style={[styles.tdStat, { fontWeight: '800', color: '#FFF' }]}>{stats.runs}</Text>
                  <Text style={styles.tdStat}>{stats.balls}</Text>
                  <Text style={styles.tdStat}>{stats.fours}</Text>
                  <Text style={styles.tdStat}>{stats.sixes}</Text>
                  <Text style={[styles.tdStat, { width: 36, textAlign: 'right' }]}>{stats.sr}</Text>
                </View>
              ) : (
                <View style={styles.statsRow}>
                  <Text style={[styles.tdStat, { width: 140, textAlign: 'right', color: 'rgba(255,255,255,0.2)' }]}>-</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Bowling Table */}
      <View style={[styles.sectionHeaderRow, { marginTop: 20 }]}>
        <Text style={styles.sectionTitle}>BOWLING</Text>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.thStat}>O</Text>
          <Text style={styles.thStat}>M</Text>
          <Text style={styles.thStat}>R</Text>
          <Text style={styles.thStat}>W</Text>
          <Text style={[styles.thStat, { width: 36, textAlign: 'right' }]}>ECO</Text>
        </View>
      </View>

      <View style={styles.cardContainer}>
        {bowlingPlayers.map((player, index) => {
          const stats = getBowlerStats(player, deliveries, currentBowler);
          const isBowlingNow = currentBowler === player.name;

          return (
            <View key={`bowl-${player.id}`} style={[
              styles.playerRow,
              index === bowlingPlayers.length - 1 && { borderBottomWidth: 0 },
              isBowlingNow && { backgroundColor: 'rgba(255,255,255,0.03)' }
            ]}>
              <View style={styles.playerInfoCol}>
                <View style={styles.avatarContainer}>
                  {player.image ? (
                    <Image source={player.image} style={[styles.avatarImg, player.isCaptain && styles.captainBorder]} />
                  ) : (
                    <View style={[styles.avatarImg, styles.avatarPlaceholder, player.isCaptain && styles.captainBorder]}>
                      <MaterialCommunityIcons name="account" size={20} color="rgba(255,255,255,0.4)" />
                    </View>
                  )}
                  {player.isCaptain && (
                    <View style={styles.captainBadge}>
                      <Text style={styles.captainBadgeText}>C</Text>
                    </View>
                  )}
                </View>
                <View style={{ flex: 1, paddingRight: 4 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.playerName, isBowlingNow && { color: '#FFF', fontWeight: '800' }]} numberOfLines={1}>
                      {player.name}
                    </Text>
                    {isBowlingNow && <MaterialCommunityIcons name="cricket" size={14} color="#F5A623" style={{ marginLeft: 4 }} />}
                  </View>
                </View>
              </View>

              {stats.bowledAny ? (
                <View style={styles.statsRow}>
                  <Text style={styles.tdStat}>{stats.overs}</Text>
                  <Text style={styles.tdStat}>{stats.maidens}</Text>
                  <Text style={styles.tdStat}>{stats.runsGiven}</Text>
                  <Text style={[styles.tdStat, { fontWeight: '800', color: stats.wickets > 0 ? '#4AC29A' : 'rgba(255,255,255,0.6)' }]}>{stats.wickets}</Text>
                  <Text style={[styles.tdStat, { width: 36, textAlign: 'right' }]}>{stats.eco}</Text>
                </View>
              ) : (
                <View style={styles.statsRow}>
                  <Text style={[styles.tdStat, { width: 140, textAlign: 'right', color: 'rgba(255,255,255,0.2)' }]}>-</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};


// ====================================================
// MAIN SCOREBOARD SCREEN
// ====================================================

export default function ScoreboardScreen() {
  const router = useRouter();
  const state = useMatchStore();

  const {
    team1, team2, team1Players, team2Players,
    battingTeam, bowlingTeam, runs, wickets, overs, balls, totalOvers,
    deliveries, striker, nonStriker, bowler, dismissedBatsmen,
    matchStatus, targetScore, currentInnings,
    innings1Deliveries, innings1Runs, innings1Wickets, innings1Overs, innings1Balls,
    innings1BattingTeam, innings1BowlingTeam, innings1DismissedBatsmen,
  } = state;

  // Step 2: Single state variable for active innings view
  const [activeInningsView, setActiveInningsView] = useState<1 | 2 | null>(
    // Step 4: Default to the current innings
    currentInnings === 2 ? 2 : 1
  );

  // Toggle logic (Step 3)
  const toggleInnings = (innings: 1 | 2) => {
    setActiveInningsView((prev) => (prev === innings ? null : innings));
  };

  // Determine data for each innings
  const inn1BattingTeamName = currentInnings === 2 ? innings1BattingTeam : battingTeam;
  const inn1BowlingTeamName = currentInnings === 2 ? innings1BowlingTeam : bowlingTeam;
  const inn1BattingPlayers = inn1BattingTeamName === team1 ? team1Players : team2Players;
  const inn1BowlingPlayers = inn1BowlingTeamName === team1 ? team1Players : team2Players;
  const inn1Deliveries = currentInnings === 2 ? innings1Deliveries : deliveries;
  const inn1Dismissed = currentInnings === 2 ? innings1DismissedBatsmen : dismissedBatsmen;
  const inn1Runs = currentInnings === 2 ? innings1Runs : runs;
  const inn1Wickets = currentInnings === 2 ? innings1Wickets : wickets;
  const inn1Overs = currentInnings === 2 ? innings1Overs : overs;
  const inn1Balls = currentInnings === 2 ? innings1Balls : balls;

  // Check if 2nd innings data exists
  const hasSecondInnings = currentInnings === 2;

  // Overall match summary for header
  const totalBalls = overs * 6 + balls;
  const crr = totalBalls > 0 ? ((runs / totalBalls) * 6).toFixed(2) : '0.00';
  const rrr = targetScore > 0 && (totalOvers * 6 - totalBalls) > 0
    ? (((targetScore - runs) / (totalOvers * 6 - totalBalls)) * 6).toFixed(2)
    : '0.00';

  const accentColor = battingTeam === team1 ? '#4AC29A' : '#6C8AFF';
  const bowlColor = bowlingTeam === team1 ? '#4AC29A' : '#6C8AFF';

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0B1120', '#121D33']} style={StyleSheet.absoluteFillObject} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MATCH SCORECARD</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Match Summary Top Bar */}
        <View style={styles.matchSummaryCard}>
          <LinearGradient colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.01)']} style={StyleSheet.absoluteFillObject} />

          <View style={styles.summaryTopRow}>
            <View style={styles.teamLogoBlock}>
              <View style={[styles.teamLogo, { borderColor: accentColor }]}>
                <Text style={styles.teamLogoText}>{battingTeam ? battingTeam.substring(0, 3).toUpperCase() : '---'}</Text>
              </View>
              <Text style={styles.summaryTeamName}>{battingTeam || 'Team A'}</Text>
            </View>

            <View style={styles.scoreBlock}>
              <Text style={styles.mainScore}>{runs}<Text style={styles.mainWickets}>/{wickets}</Text></Text>
              <Text style={styles.mainOvers}>({overs}.{balls} ov)</Text>
            </View>

            <View style={styles.teamLogoBlock}>
              <View style={[styles.teamLogo, { borderColor: bowlColor, opacity: 0.5 }]}>
                <Text style={styles.teamLogoText}>{bowlingTeam ? bowlingTeam.substring(0, 3).toUpperCase() : '---'}</Text>
              </View>
              <Text style={styles.summaryTeamName}>{bowlingTeam || 'Team B'}</Text>
            </View>
          </View>

          <View style={styles.ratesRow}>
            <View style={styles.rateCol}>
              <Text style={styles.rateLabel}>CRR</Text>
              <Text style={styles.rateValue}>{crr}</Text>
            </View>
            {targetScore > 0 && (
              <>
                <View style={styles.rateDivider} />
                <View style={styles.rateCol}>
                  <Text style={styles.rateLabel}>REQ</Text>
                  <Text style={styles.rateValue}>{rrr}</Text>
                </View>
                <View style={styles.rateDivider} />
                <View style={styles.rateCol}>
                  <Text style={styles.rateLabel}>TARGET</Text>
                  <Text style={styles.rateValue}>{targetScore}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* ======================================================== */}
        {/* 1ST INNINGS ACCORDION                                     */}
        {/* ======================================================== */}
        <TouchableOpacity
          style={[
            styles.inningsToggle,
            activeInningsView === 1 && styles.inningsToggleActive,
          ]}
          onPress={() => toggleInnings(1)}
          activeOpacity={0.7}
        >
          <View style={styles.inningsToggleLeft}>
            <View style={[styles.inningsBadge, { backgroundColor: 'rgba(74,194,154,0.15)' }]}>
              <Text style={[styles.inningsBadgeText, { color: '#4AC29A' }]}>1</Text>
            </View>
            <Text style={styles.inningsToggleTitle}>1st Innings</Text>
            <Text style={styles.inningsToggleSub}>
              {inn1BattingTeamName || 'Team A'} — {inn1Runs}/{inn1Wickets} ({inn1Overs}.{inn1Balls} ov)
            </Text>
          </View>
          <AnimatedChevron expanded={activeInningsView === 1} />
        </TouchableOpacity>

        {activeInningsView === 1 && (
          <InningsCard
            inningsNumber={1}
            battingTeamName={inn1BattingTeamName}
            bowlingTeamName={inn1BowlingTeamName}
            battingPlayers={inn1BattingPlayers}
            bowlingPlayers={inn1BowlingPlayers}
            deliveries={inn1Deliveries}
            dismissedBatsmen={inn1Dismissed}
            inningsRuns={inn1Runs}
            inningsWickets={inn1Wickets}
            inningsOvers={inn1Overs}
            inningsBalls={inn1Balls}
            totalOvers={totalOvers}
            striker={currentInnings === 1 ? striker : ''}
            nonStriker={currentInnings === 1 ? nonStriker : ''}
            currentBowler={currentInnings === 1 ? bowler : ''}
            isLive={currentInnings === 1}
          />
        )}

        {/* ======================================================== */}
        {/* 2ND INNINGS ACCORDION                                     */}
        {/* ======================================================== */}
        {hasSecondInnings && (
          <>
            <TouchableOpacity
              style={[
                styles.inningsToggle,
                activeInningsView === 2 && styles.inningsToggleActive,
                { marginTop: 12 },
              ]}
              onPress={() => toggleInnings(2)}
              activeOpacity={0.7}
            >
              <View style={styles.inningsToggleLeft}>
                <View style={[styles.inningsBadge, { backgroundColor: 'rgba(108,138,255,0.15)' }]}>
                  <Text style={[styles.inningsBadgeText, { color: '#6C8AFF' }]}>2</Text>
                </View>
                <Text style={styles.inningsToggleTitle}>2nd Innings</Text>
                <Text style={styles.inningsToggleSub}>
                  {battingTeam || 'Team B'} — {runs}/{wickets} ({overs}.{balls} ov)
                </Text>
              </View>
              <AnimatedChevron expanded={activeInningsView === 2} />
            </TouchableOpacity>

            {activeInningsView === 2 && (
              <InningsCard
                inningsNumber={2}
                battingTeamName={battingTeam}
                bowlingTeamName={bowlingTeam}
                battingPlayers={battingTeam === team1 ? team1Players : team2Players}
                bowlingPlayers={bowlingTeam === team1 ? team1Players : team2Players}
                deliveries={deliveries}
                dismissedBatsmen={dismissedBatsmen}
                inningsRuns={runs}
                inningsWickets={wickets}
                inningsOvers={overs}
                inningsBalls={balls}
                totalOvers={totalOvers}
                striker={striker}
                nonStriker={nonStriker}
                currentBowler={bowler}
                isLive={true}
              />
            )}
          </>
        )}

        {/* Match Result Banner */}
        {matchStatus === 'completed' && state.matchResult && (
          <View style={styles.resultBanner}>
            <LinearGradient
              colors={['rgba(245,166,35,0.15)', 'rgba(245,166,35,0.03)']}
              style={StyleSheet.absoluteFillObject}
            />
            <MaterialCommunityIcons name="trophy" size={22} color="#F5A623" />
            <Text style={styles.resultText}>{state.matchResult}</Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

// ====================================================
// STYLES
// ====================================================

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
    padding: 16,
    paddingBottom: 50,
  },

  // Match Summary
  matchSummaryCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.15)',
    overflow: 'hidden',
    marginBottom: 24,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  teamLogoBlock: {
    alignItems: 'center',
    width: 80,
  },
  teamLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 8,
  },
  teamLogoText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFF',
  },
  summaryTeamName: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  scoreBlock: {
    alignItems: 'center',
  },
  mainScore: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1,
  },
  mainWickets: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.5)',
  },
  mainOvers: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F5A623',
    marginTop: 4,
  },
  ratesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  rateCol: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  rateLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
  rateDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // Innings Toggle (accordion header)
  inningsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  inningsToggleActive: {
    borderColor: 'rgba(245,166,35,0.2)',
    backgroundColor: 'rgba(245,166,35,0.04)',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  inningsToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    gap: 8,
  },
  inningsBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inningsBadgeText: {
    fontSize: 12,
    fontWeight: '900',
  },
  inningsToggleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  inningsToggleSub: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
  },

  // Innings Content (expanded body)
  inningsContent: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: 'rgba(245,166,35,0.12)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 12,
    paddingTop: 16,
    marginBottom: 4,
  },

  // Mini score bar inside innings
  miniScoreBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  miniScoreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniTeamName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F5A623',
    letterSpacing: 0.5,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4AC29A',
  },
  miniScoreRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  miniScoreText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
  },
  miniOversText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
  },
  miniCrrText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F5A623',
  },

  // Sections
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 1.5,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 160,
  },
  thStat: {
    width: 30,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.4)',
  },

  // Cards
  cardContainer: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  playerInfoCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captainBorder: {
    borderWidth: 1.5,
    borderColor: '#F5A623',
  },
  captainBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    backgroundColor: '#F5A623',
    width: 15,
    height: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0B1120',
  },
  captainBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#0B1120',
  },
  playerName: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  playerStatus: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    width: 160,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  tdStat: {
    width: 30,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },

  // Result Banner
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.2)',
    overflow: 'hidden',
  },
  resultText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F5A623',
    letterSpacing: 0.5,
  },
});
