import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Image, Animated, Dimensions, Easing } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMatchStore, DeliveryType, getDeliveryLabel, Player, Delivery } from '../../store/useMatchStore';

// ==========================================
// CUSTOM SKEUOMORPHIC COMPONENTS
// ==========================================

const ScoreStadiumBackground = React.memo(() => {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Deep base */}
      <LinearGradient colors={['#0F1522', '#141D2D', '#0A0E17']} style={StyleSheet.absoluteFillObject} />
      
      {/* Pitch Area */}
      <View style={{
        position: 'absolute',
        top: '20%',
        bottom: 0,
        left: '20%',
        right: '20%',
        backgroundColor: 'rgba(61, 74, 62, 0.4)', // subtle green
      }}>
        {/* Pitch center */}
        <View style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '25%',
          right: '25%',
          backgroundColor: 'rgba(92, 74, 61, 0.5)', // brown pitch
        }} />
        {/* Pitch lines */}
        <View style={{ position: 'absolute', top: '10%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.15)' }} />
        <View style={{ position: 'absolute', top: '90%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.15)' }} />
      </View>
      
      {/* Grid Lines */}
      <View style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.03)' }} />
      <View style={{ position: 'absolute', top: '75%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.03)' }} />
      
      {/* Spotlights */}
      <LinearGradient
        colors={['rgba(245, 166, 35, 0.1)', 'transparent']}
        style={{ position: 'absolute', top: -100, left: -50, width: 250, height: 400, transform: [{ rotate: '35deg' }] }}
      />
      <LinearGradient
        colors={['rgba(245, 166, 35, 0.1)', 'transparent']}
        style={{ position: 'absolute', top: -100, right: -50, width: 250, height: 400, transform: [{ rotate: '-35deg' }] }}
      />
    </View>
  );
});
ScoreStadiumBackground.displayName = 'ScoreStadiumBackground';

const HeaderButton = React.memo(({ icon, onPress }: any) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{
      width: 44,
      height: 44,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: '#362B21',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 6,
    }}>
      <LinearGradient colors={['#2A241F', '#171411']} style={{ flex: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
        <MaterialCommunityIcons name={icon} size={22} color="#B5A69B" />
      </LinearGradient>
    </TouchableOpacity>
  );
});
HeaderButton.displayName = 'HeaderButton';

const ScoreBoardCard = React.memo(({ runs, wickets, overs, balls, totalOvers, crr, deliveries, battingTeamPlayers }: any) => {
  const emptyBalls = Array.from({ length: Math.max(0, 6 - deliveries.length) }).map((_, i) => i);
  
  return (
    <View style={{
      borderRadius: 16,
      borderWidth: 2,
      borderColor: '#4A3A2A',
      backgroundColor: '#1E1A16', // Dark inner
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 10,
      elevation: 10,
      marginBottom: 24,
    }}>
      <LinearGradient colors={['#2A241F', '#171411']} style={{ borderRadius: 14, padding: 16 }}>
        {/* Top half */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={{ fontSize: 56, fontWeight: '900', color: '#FFF', lineHeight: 60, letterSpacing: -2 }}>
              {runs}/{wickets}
            </Text>
            <Text style={{ fontSize: 13, color: '#A09D9A', marginTop: 2, fontWeight: '500' }}>
              Overs: {overs}.{balls} / {totalOvers}
            </Text>
          </View>
          <View style={{
            backgroundColor: '#322616',
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderWidth: 1.5,
            borderColor: '#5C4422',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 4,
          }}>
            <Text style={{ fontSize: 9, color: '#F5A623', fontWeight: '800' }}>CRR</Text>
            <Text style={{ fontSize: 20, color: '#F5A623', fontWeight: '900' }}>{crr}</Text>
          </View>
        </View>
        
        {/* Divider */}
        <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 14 }} />
        
        {/* This Over */}
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ fontSize: 10, color: '#888', fontWeight: '800', letterSpacing: 1.5 }}>THIS OVER</Text>
            <Text style={{ fontSize: 10, color: '#666', fontWeight: '600' }}>6-ball over</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
            {deliveries.length === 0 ? <Text style={{ color: '#888', fontSize: 16 }}>—</Text> : null}
            {deliveries.map((d: any, i: number) => {
              const label = getDeliveryLabel(d);
              let bgColor = 'rgba(255,255,255,0.1)';
              let textColor = '#FFF';
              
              if (label === 'W') { bgColor = '#FF4757'; }
              else if (label === 'WD' || label.startsWith('NB')) { bgColor = '#FECA57'; textColor = '#000'; }
              else if (label === '4') { bgColor = '#4AC29A'; }
              else if (label === '6') { bgColor = '#6C8AFF'; }

              // Find player profile for this delivery
              const strikerPlayer = battingTeamPlayers?.find((p: any) => p.name === d.strikerName);
              
              return (
                <View key={`d-${i}`} style={{ alignItems: 'center' }}>
                  {/* Player profile photo above the ball */}
                  {strikerPlayer?.image ? (
                    <Image source={strikerPlayer.image} style={{
                      width: 20, height: 20, borderRadius: 10,
                      borderWidth: 1.5,
                      borderColor: bgColor,
                      marginBottom: 4,
                    }} />
                  ) : d.strikerName ? (
                    <View style={{
                      width: 20, height: 20, borderRadius: 10,
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      borderWidth: 1.5,
                      borderColor: bgColor,
                      justifyContent: 'center', alignItems: 'center',
                      marginBottom: 4,
                    }}>
                      <Text style={{ fontSize: 8, fontWeight: '800', color: 'rgba(255,255,255,0.5)' }}>
                        {d.strikerName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  ) : (
                    <View style={{ width: 20, height: 20, marginBottom: 4 }} />
                  )}
                  {/* Run ball */}
                  <View style={{
                    width: 28, height: 28, borderRadius: 14, backgroundColor: bgColor,
                    justifyContent: 'center', alignItems: 'center',
                    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 3, elevation: 3
                  }}>
                    <Text style={{ color: textColor, fontSize: 11, fontWeight: '800' }}>{label}</Text>
                  </View>
                </View>
              );
            })}
            {/* Empty dots */}
            {emptyBalls.map((_, i) => (
              <View key={`e-${i}`} style={{ alignItems: 'center' }}>
                <View style={{ width: 20, height: 20, marginBottom: 4 }} />
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.1)' }} />
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
});
ScoreBoardCard.displayName = 'ScoreBoardCard';

const RunButton = React.memo(({ value, onPress, variant = 'default' }: any) => {
  const getGradient = () => {
    if (variant === 'four') return ['#30574A', '#1E362E'] as const;
    if (variant === 'six') return ['#283C66', '#1A2742'] as const;
    return ['#5A3B2C', '#362118'] as const;
  };
  const getTextColor = () => {
    if (variant === 'four') return '#4AC29A';
    if (variant === 'six') return '#6C8AFF';
    return '#E0D6C8';
  };
  const getBorderColor = () => {
    if (variant === 'four') return '#4AC29A';
    if (variant === 'six') return '#6C8AFF';
    return '#A08F83';
  };
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{
      flex: 1,
      height: 65,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: getBorderColor(),
      backgroundColor: '#2A1F1A',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.6,
      shadowRadius: 5,
      elevation: 6,
    }}>
      <LinearGradient colors={getGradient()} style={{ flex: 1, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
        <Text style={{ fontSize: 28, fontWeight: '900', color: getTextColor(), textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 3 }}>
          {value}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
});
RunButton.displayName = 'RunButton';

const ExtraButton = React.memo(({ label, sub, color, onPress }: any) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{
      flex: 1,
      height: 65,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: color,
      backgroundColor: 'rgba(0,0,0,0.5)',
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    }}>
      <LinearGradient colors={['rgba(255,255,255,0.1)', 'transparent']} style={{ flex: 1, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: '900', color: color, textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 3 }}>{label}</Text>
        <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2, textTransform: 'uppercase', fontWeight: '600' }}>{sub}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
});
ExtraButton.displayName = 'ExtraButton';

const ActionButton = React.memo(({ icon, label, onPress, type }: any) => {
  const isWicket = type === 'wicket';
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{
      flex: isWicket ? 1.5 : 1,
      height: 60,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: isWicket ? '#7F1D1D' : '#C59021',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 6,
    }}>
      <LinearGradient colors={isWicket ? ['#991B1B', '#7F1D1D'] : ['#E6B970', '#C59021']} style={{ flex: 1, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
        <MaterialCommunityIcons name={icon} size={22} color={isWicket ? '#FFF' : '#332200'} />
        <Text style={{ fontSize: 16, fontWeight: '900', color: isWicket ? '#FFF' : '#332200', marginLeft: 8, letterSpacing: 1.5 }}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
});
ActionButton.displayName = 'ActionButton';

// ==========================================
// CONFETTI ANIMATION
// ==========================================

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CONFETTI_COLORS = ['#F5A623', '#FF4757', '#4AC29A', '#6C8AFF', '#FECA57', '#FF6B6B', '#A29BFE', '#FD79A8', '#00CEFF'];

const ConfettiPiece = React.memo(({ delay, index }: { delay: number; index: number }) => {
  const fall = useRef(new Animated.Value(-50)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const xStart = useMemo(() => Math.random() * SCREEN_WIDTH, []);
  const size = useMemo(() => 6 + Math.random() * 8, []);
  const color = useMemo(() => CONFETTI_COLORS[index % CONFETTI_COLORS.length], [index]);
  const duration = useMemo(() => 2500 + Math.random() * 2000, []);
  const swayAmount = useMemo(() => 30 + Math.random() * 60, []);
  const isSquare = useMemo(() => Math.random() > 0.5, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fall, {
          toValue: SCREEN_HEIGHT + 100,
          duration,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(sway, { toValue: swayAmount, duration: duration / 4, useNativeDriver: true }),
            Animated.timing(sway, { toValue: -swayAmount, duration: duration / 2, useNativeDriver: true }),
            Animated.timing(sway, { toValue: 0, duration: duration / 4, useNativeDriver: true }),
          ])
        ),
        Animated.loop(
          Animated.timing(spin, { toValue: 1, duration: 800 + Math.random() * 1200, useNativeDriver: true })
        ),
        Animated.timing(opacity, {
          toValue: 0,
          duration,
          delay: duration * 0.6,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  const rotateZ = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: xStart,
        top: 0,
        width: size,
        height: isSquare ? size : size * 2.5,
        backgroundColor: color,
        borderRadius: isSquare ? 2 : size / 2,
        opacity,
        transform: [{ translateY: fall }, { translateX: sway }, { rotateZ }],
      }}
    />
  );
});
ConfettiPiece.displayName = 'ConfettiPiece';

const ConfettiExplosion = React.memo(() => {
  const pieces = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      delay: Math.random() * 1500,
    }));
  }, []);

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {pieces.map((p) => (
        <ConfettiPiece key={p.id} index={p.id} delay={p.delay} />
      ))}
    </View>
  );
});
ConfettiExplosion.displayName = 'ConfettiExplosion';

// ==========================================
// MATCH OVER CELEBRATION SCREEN
// ==========================================

interface MOTMResult {
  player: Player;
  battingRuns: number;
  wickets: number;
  totalScore: number;
}

const calculateMOTM = (
  winnerTeamName: string,
  team1: string, team2: string,
  team1Players: Player[], team2Players: Player[],
  inn1Deliveries: Delivery[], inn2Deliveries: Delivery[],
  inn1BattingTeam: string,
): MOTMResult | null => {
  const winnerPlayers = winnerTeamName === team1 ? team1Players : team2Players;
  const allDeliveries = [...inn1Deliveries, ...inn2Deliveries];

  // Did the winner bat in innings 1 or 2?
  const winnerBattedInInnings1 = inn1BattingTeam === winnerTeamName;
  const battingDeliveries = winnerBattedInInnings1 ? inn1Deliveries : inn2Deliveries;
  const bowlingDeliveries = winnerBattedInInnings1 ? inn2Deliveries : inn1Deliveries;

  let bestPlayer: MOTMResult | null = null;

  winnerPlayers.forEach((player) => {
    // Batting: sum of runs scored by this player
    let battingRuns = 0;
    battingDeliveries
      .filter((d) => d.strikerName === player.name)
      .forEach((d) => { battingRuns += d.runs; });

    // Bowling: count wickets taken by this player (exclude runouts)
    let wicketsTaken = 0;
    bowlingDeliveries
      .filter((d) => d.bowlerName === player.name && d.isWicket)
      .filter((d) => d.wicketType !== 'runOut' && d.wicketType !== 'retiredHurt' && d.wicketType !== 'obstructingField' && d.wicketType !== 'timedOut')
      .forEach(() => { wicketsTaken++; });

    const totalScore = battingRuns * 1 + wicketsTaken * 5;

    if (!bestPlayer || totalScore > bestPlayer.totalScore) {
      bestPlayer = { player, battingRuns, wickets: wicketsTaken, totalScore };
    }
  });

  return bestPlayer;
};

interface MatchOverScreenProps {
  matchResult: string;
  team1: string;
  team2: string;
  team1Players: Player[];
  team2Players: Player[];
  inn1Deliveries: Delivery[];
  inn2Deliveries: Delivery[];
  inn1BattingTeam: string;
  onGoHome: () => void;
  onViewScorecard: () => void;
}

const MatchOverScreen = React.memo(({
  matchResult, team1, team2, team1Players, team2Players,
  inn1Deliveries, inn2Deliveries, inn1BattingTeam,
  onGoHome, onViewScorecard,
}: MatchOverScreenProps) => {
  // Determine winning team from matchResult
  let winnerTeam = '';
  if (matchResult.includes(team1)) {
    winnerTeam = team1;
  } else if (matchResult.includes(team2)) {
    winnerTeam = team2;
  }

  const motm = winnerTeam
    ? calculateMOTM(winnerTeam, team1, team2, team1Players, team2Players, inn1Deliveries, inn2Deliveries, inn1BattingTeam)
    : null;

  // Animations
  const bannerScale = useRef(new Animated.Value(0)).current;
  const bannerOpacity = useRef(new Animated.Value(0)).current;
  const trophyBounce = useRef(new Animated.Value(0)).current;
  const motmSlide = useRef(new Animated.Value(60)).current;
  const motmOpacity = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Trophy bounce in
      Animated.spring(trophyBounce, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }),
      // Banner reveal
      Animated.parallel([
        Animated.spring(bannerScale, { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.timing(bannerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      // MOTM card slide up
      Animated.parallel([
        Animated.spring(motmSlide, { toValue: 0, friction: 6, useNativeDriver: true }),
        Animated.timing(motmOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      // Buttons fade in
      Animated.timing(btnOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const trophyScale = trophyBounce.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <View style={celebStyles.container}>
      <LinearGradient colors={['#0B1120', '#1A1030', '#0B1120']} style={StyleSheet.absoluteFillObject} />

      {/* Confetti */}
      <ConfettiExplosion />

      {/* Radial glow behind trophy */}
      <View style={celebStyles.glowCircle} />

      <ScrollView contentContainerStyle={celebStyles.scroll} showsVerticalScrollIndicator={false}>
        {/* Trophy */}
        <Animated.View style={{ transform: [{ scale: trophyScale }], marginBottom: 16 }}>
          <View style={celebStyles.trophyRing}>
            <MaterialCommunityIcons name="trophy" size={64} color="#F5A623" />
          </View>
        </Animated.View>

        {/* Victory Banner */}
        <Animated.View style={[celebStyles.bannerContainer, { opacity: bannerOpacity, transform: [{ scale: bannerScale }] }]}>
          <Text style={celebStyles.matchOverLabel}>MATCH OVER</Text>
          {winnerTeam ? (
            <Text style={celebStyles.winnerText}>{winnerTeam} Wins! 🏆</Text>
          ) : (
            <Text style={celebStyles.winnerText}>Match Tied!</Text>
          )}
          <Text style={celebStyles.resultDetail}>{matchResult}</Text>
        </Animated.View>

        {/* Man of the Match */}
        {motm && (
          <Animated.View style={[celebStyles.motmCard, { opacity: motmOpacity, transform: [{ translateY: motmSlide }] }]}>
            <LinearGradient
              colors={['rgba(245,166,35,0.12)', 'rgba(245,166,35,0.02)']}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={celebStyles.motmLabel}>⭐ MAN OF THE MATCH ⭐</Text>

            {/* Profile */}
            <View style={celebStyles.motmProfileRing}>
              {motm.player.image ? (
                <Image source={motm.player.image} style={celebStyles.motmProfileImg} />
              ) : (
                <View style={[celebStyles.motmProfileImg, celebStyles.motmPlaceholder]}>
                  <MaterialCommunityIcons name="account" size={48} color="rgba(255,255,255,0.3)" />
                </View>
              )}
            </View>

            <Text style={celebStyles.motmName}>{motm.player.name}</Text>

            {/* Stats Row */}
            <View style={celebStyles.motmStatsRow}>
              <View style={celebStyles.motmStatCol}>
                <Text style={celebStyles.motmStatValue}>{motm.battingRuns}</Text>
                <Text style={celebStyles.motmStatLabel}>Runs</Text>
              </View>
              <View style={celebStyles.motmStatDivider} />
              <View style={celebStyles.motmStatCol}>
                <Text style={celebStyles.motmStatValue}>{motm.wickets}</Text>
                <Text style={celebStyles.motmStatLabel}>Wickets</Text>
              </View>
              <View style={celebStyles.motmStatDivider} />
              <View style={celebStyles.motmStatCol}>
                <Text style={[celebStyles.motmStatValue, { color: '#F5A623' }]}>{motm.totalScore}</Text>
                <Text style={celebStyles.motmStatLabel}>Points</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Action Buttons */}
        <Animated.View style={[celebStyles.btnRow, { opacity: btnOpacity }]}>
          <TouchableOpacity style={celebStyles.viewScorecardBtn} onPress={onViewScorecard}>
            <MaterialCommunityIcons name="scoreboard" size={18} color="#FFF" />
            <Text style={celebStyles.viewScorecardText}>VIEW SCORECARD</Text>
          </TouchableOpacity>

          <TouchableOpacity style={celebStyles.goHomeBtn} onPress={onGoHome}>
            <Text style={celebStyles.goHomeText}>BACK TO HOME</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
});
MatchOverScreen.displayName = 'MatchOverScreen';

const celebStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  glowCircle: {
    position: 'absolute',
    top: '15%',
    alignSelf: 'center',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(245,166,35,0.06)',
  },
  trophyRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#F5A623',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(245,166,35,0.08)',
  },
  bannerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  matchOverLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 4,
    marginBottom: 8,
  },
  winnerText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  resultDetail: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  // MOTM Card
  motmCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(245,166,35,0.25)',
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 32,
  },
  motmLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#F5A623',
    letterSpacing: 2,
    marginBottom: 16,
  },
  motmProfileRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#F5A623',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(245,166,35,0.05)',
  },
  motmProfileImg: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  motmPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  motmName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 16,
  },
  motmStatsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  motmStatCol: {
    flex: 1,
    alignItems: 'center',
  },
  motmStatValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
  },
  motmStatLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  motmStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  // Buttons
  btnRow: {
    width: '100%',
    gap: 12,
  },
  viewScorecardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 16,
    borderRadius: 30,
  },
  viewScorecardText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 1,
  },
  goHomeBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  goHomeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0B1120',
    letterSpacing: 1.5,
  },
});

// ==========================================
// MAIN SCREEN
// ==========================================

export default function ScoreScreen() {
  const router = useRouter();
  const matchState = useMatchStore();
  const {
    battingTeam, bowlingTeam, runs, wickets, overs, balls,
    totalOvers, addDelivery, undoLastDelivery, endInnings, deliveries,
    currentInnings, matchStatus, targetScore, matchResult, startSecondInnings,
    team1, team2, team1Players, team2Players, openersSelected, setOpeners,
    striker, nonStriker, needsNewBatsman, setNextBatsman, dismissedBatsmen,
    needsNewBowler, setBowler, bowler,
    innings1Deliveries, innings1BattingTeam,
  } = matchState;

  const currentOverDeliveries = deliveries.filter((d) => d.overIndex === overs);
  const totalBalls = overs * 6 + balls;
  const crr = totalBalls > 0 ? ((runs / totalBalls) * 6).toFixed(2) : '0.00';

  const [showCustomRun, setShowCustomRun] = useState(false);
  const [customRunValue, setCustomRunValue] = useState('');
  const [showNoBallRuns, setShowNoBallRuns] = useState(false);

  // Opening batsmen selection state
  const [selectedStriker, setSelectedStriker] = useState<string | null>(null);
  const [selectedNonStriker, setSelectedNonStriker] = useState<string | null>(null);
  const [playerPickerFor, setPlayerPickerFor] = useState<'striker' | 'nonStriker' | null>(null);

  // Get batting team players
  const battingTeamPlayers: Player[] = battingTeam === team1 ? team1Players : team2Players;
  const battingTeamColor = battingTeam === team1 ? '#4AC29A' : '#6C8AFF';

  // Get bowling team players
  const bowlingTeamPlayers: Player[] = bowlingTeam === team1 ? team1Players : team2Players;
  const bowlingTeamColor = bowlingTeam === team1 ? '#4AC29A' : '#6C8AFF';

  const strikerPlayer = battingTeamPlayers.find(p => p.name === selectedStriker);
  const nonStrikerPlayer = battingTeamPlayers.find(p => p.name === selectedNonStriker);

  const getMaxOversPerBowler = (total: number) => {
    if (total === 20) return 5;
    if (total === 10) return 3;
    if (total === 7) return 3;
    if (total <= 6) return 2;
    return Math.ceil(total / 5);
  };
  const maxOversLimit = getMaxOversPerBowler(totalOvers);

  const handleConfirmOpeners = () => {
    if (selectedStriker && selectedNonStriker) {
      setOpeners(selectedStriker, selectedNonStriker);
    }
  };

  const handlePlayerSelect = (playerName: string) => {
    if (playerPickerFor === 'striker') {
      setSelectedStriker(playerName);
    } else if (playerPickerFor === 'nonStriker') {
      setSelectedNonStriker(playerName);
    }
    setPlayerPickerFor(null);
  };

  const handleRun = (runsScored: number) => {
    addDelivery(runsScored, 'legal', false);
  };

  const handleExtra = (type: DeliveryType) => {
    addDelivery(0, type, false);
  };

  const handleWicket = () => {
    addDelivery(0, 'legal', true, 0, 'bowled');
  };

  return (
    <View style={styles.container}>
      <ScoreStadiumBackground />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <HeaderButton icon="arrow-left" onPress={() => router.back()} />
          <Text style={styles.headerInnings}>INNINGS {currentInnings}</Text>
          <HeaderButton icon="clipboard-text-outline" onPress={() => router.push('/match/scoreboard' as any)} />
        </View>
        <Text style={styles.headerTeams}>
          <Text style={{ color: '#4AC29A' }}>{battingTeam}</Text>
          {'  vs  '}
          <Text style={{ color: '#6C8AFF' }}>{bowlingTeam}</Text>
        </Text>
        {currentInnings === 2 && (
           <Text style={styles.targetText}>Target: {targetScore}</Text>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main 3D Score Card */}
        <ScoreBoardCard 
          runs={runs} wickets={wickets} overs={overs} balls={balls} 
          totalOvers={totalOvers} crr={crr} deliveries={currentOverDeliveries}
          battingTeamPlayers={battingTeamPlayers}
        />

        {/* RUNS Section */}
        <Text style={styles.sectionLabel}>RUNS</Text>
        <View style={styles.gridContainer}>
          <View style={styles.row}>
            <RunButton value="0" onPress={() => handleRun(0)} />
            <RunButton value="1" onPress={() => handleRun(1)} />
            <RunButton value="2" onPress={() => handleRun(2)} />
            <RunButton value="3" onPress={() => handleRun(3)} />
          </View>
          <View style={styles.row}>
            <RunButton value="4" variant="four" onPress={() => handleRun(4)} />
            <RunButton value="6" variant="six" onPress={() => handleRun(6)} />
            <RunButton value="+" onPress={() => setShowCustomRun(true)} />
          </View>
        </View>

        {/* EXTRAS Section */}
        <Text style={styles.sectionLabel}>EXTRAS</Text>
        <View style={styles.gridContainer}>
          <View style={styles.row}>
            <ExtraButton label="WD" sub="WIDE" color="#F5A623" onPress={() => handleExtra('wide')} />
            <ExtraButton label="NB" sub="NO BALL" color="#FF4757" onPress={() => setShowNoBallRuns(true)} />
            <ExtraButton label="BYE" sub="BYE" color="#48DBFB" onPress={() => handleExtra('bye')} />
            <ExtraButton label="LB" sub="LEG BYE" color="#48DBFB" onPress={() => handleExtra('legBye')} />
          </View>
        </View>

        {/* ACTIONS Section */}
        <View style={styles.actionsRow}>
          <ActionButton icon="alert-circle" label="WICKET" type="wicket" onPress={handleWicket} />
          <ActionButton icon="undo" label="UNDO" type="undo" onPress={undoLastDelivery} />
        </View>

        {/* Bottom Nav */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.bottomBtn}
            onPress={() => router.push('/match/scoreboard' as any)}
          >
            <MaterialCommunityIcons name="clipboard-list-outline" size={20} color="#F5A623" />
            <Text style={styles.bottomBtnText}>Full Scoreboard</Text>
          </TouchableOpacity>
          <View style={styles.bottomDivider} />
          <TouchableOpacity
            style={styles.bottomBtn}
            onPress={() => {
              if (matchStatus === 'ongoing') {
                endInnings();
              } else {
                router.replace('/(tabs)/home' as any);
              }
            }}
          >
            <MaterialCommunityIcons name="flag-checkered" size={20} color="#FF4757" />
            <Text style={[styles.bottomBtnText, { color: '#FF4757' }]}>
              {currentInnings === 1 ? 'End Innings' : 'End Match'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals for States */}
      {matchStatus === 'inningsBreak' && (
        <View style={styles.overlayContainer}>
          <View style={styles.overlayCard}>
             <MaterialCommunityIcons name="cricket" size={48} color="#F5A623" style={{marginBottom: 10}}/>
             <Text style={styles.overlayTitle}>First Innings Completed</Text>
             <Text style={styles.overlaySubtitle}>Target for {bowlingTeam} is <Text style={{fontWeight:'bold', color:'#F5A623'}}>{targetScore}</Text> runs.</Text>
             <TouchableOpacity style={styles.overlayBtn} onPress={startSecondInnings}>
                <Text style={styles.overlayBtnText}>START SECOND INNINGS</Text>
             </TouchableOpacity>
          </View>
        </View>
      )}

      {matchStatus === 'completed' && (
        <MatchOverScreen
          matchResult={matchResult}
          team1={team1}
          team2={team2}
          team1Players={team1Players}
          team2Players={team2Players}
          inn1Deliveries={innings1Deliveries}
          inn2Deliveries={deliveries}
          inn1BattingTeam={innings1BattingTeam || battingTeam}
          onGoHome={() => router.replace('/(tabs)/home' as any)}
          onViewScorecard={() => router.push('/match/scoreboard' as any)}
        />
      )}

      {showCustomRun && (
        <View style={styles.overlayContainer}>
          <View style={styles.overlayCard}>
             <Text style={styles.overlayTitle}>Custom Runs</Text>
             <Text style={styles.overlaySubtitle}>Enter runs scored on this delivery</Text>
             <TextInput
               style={styles.customInput}
               keyboardType="number-pad"
               value={customRunValue}
               onChangeText={(text) => {
                 const cleaned = text.replace(/[^0-9]/g, '');
                 if (!cleaned) {
                   setCustomRunValue('');
                   return;
                 }
                 const val = parseInt(cleaned, 10);
                 if (val <= 10) {
                   setCustomRunValue(val.toString());
                 } else {
                   setCustomRunValue('10');
                 }
               }}
               placeholder="e.g. 5, 7"
               placeholderTextColor="rgba(255,255,255,0.2)"
               maxLength={2}
               autoFocus
             />
             <View style={styles.overlayRowBtn}>
               <TouchableOpacity style={[styles.overlayBtn, { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }]} onPress={() => setShowCustomRun(false)}>
                  <Text style={[styles.overlayBtnText, { color: '#FFFFFF' }]}>CANCEL</Text>
               </TouchableOpacity>
               <View style={{ width: 12 }} />
               <TouchableOpacity 
                 style={[styles.overlayBtn, { flex: 1, opacity: customRunValue === '' ? 0.5 : 1 }]} 
                 disabled={customRunValue === ''}
                 onPress={() => {
                   const val = parseInt(customRunValue, 10);
                   if (!isNaN(val) && val <= 10) {
                     handleRun(val);
                     setShowCustomRun(false);
                     setCustomRunValue('');
                   }
                 }}
               >
                  <Text style={styles.overlayBtnText}>ADD RUNS</Text>
               </TouchableOpacity>
             </View>
          </View>
        </View>
      )}

      {showNoBallRuns && (
        <View style={styles.overlayContainer}>
          <View style={styles.overlayCard}>
             <Text style={styles.overlayTitle}>No Ball Runs</Text>
             <Text style={styles.overlaySubtitle}>Select batsman's runs off the No Ball</Text>
             <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
               {[0, 1, 2, 3, 4, 6].map(runsOffNoBall => (
                 <TouchableOpacity
                   key={`nb-${runsOffNoBall}`}
                   style={{
                     width: 65, height: 65, borderRadius: 12,
                     backgroundColor: 'rgba(255,255,255,0.05)',
                     borderWidth: 2, borderColor: '#FF4757',
                     justifyContent: 'center', alignItems: 'center'
                   }}
                   onPress={() => {
                     addDelivery(runsOffNoBall, 'noBall', false);
                     setShowNoBallRuns(false);
                   }}
                 >
                   <Text style={{ fontSize: 28, fontWeight: '900', color: '#FFF' }}>{runsOffNoBall}</Text>
                 </TouchableOpacity>
               ))}
             </View>
             <TouchableOpacity style={[styles.overlayBtn, { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }]} onPress={() => setShowNoBallRuns(false)}>
                <Text style={[styles.overlayBtnText, { color: '#FFFFFF' }]}>CANCEL</Text>
             </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Opening Batsmen Selection Modal - 2 Slot View */}
      {!openersSelected && matchStatus === 'ongoing' && !playerPickerFor && (
        <View style={styles.overlayContainer}>
          <View style={[styles.overlayCard, { paddingHorizontal: 24, paddingVertical: 28 }]}>
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: 28 }}>
              <MaterialCommunityIcons name="cricket" size={44} color={battingTeamColor} style={{ marginBottom: 10 }} />
              <Text style={[styles.overlayTitle, { fontSize: 22, marginBottom: 6 }]}>Select Opening Batsmen</Text>
              <Text style={[styles.overlaySubtitle, { marginBottom: 0, fontSize: 14 }]}>
                <Text style={{ color: battingTeamColor, fontWeight: '800' }}>{battingTeam}</Text> is batting
              </Text>
            </View>

            <View style={{ flexDirection: 'row', width: '100%', gap: 16, marginBottom: 24 }}>
              {/* Slot 1 - Opener */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setPlayerPickerFor('striker')}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  backgroundColor: selectedStriker ? 'rgba(245, 166, 35, 0.08)' : 'rgba(255,255,255,0.03)',
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: selectedStriker ? '#F5A623' : 'rgba(255,255,255,0.1)',
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                }}
              >
                {/* Number Badge or Profile Image */}
                <View style={{
                  width: 56, height: 56, borderRadius: 28,
                  backgroundColor: selectedStriker ? 'rgba(245, 166, 35, 0.2)' : 'rgba(255,255,255,0.06)',
                  borderWidth: 2,
                  borderColor: selectedStriker ? '#F5A623' : 'rgba(255,255,255,0.15)',
                  justifyContent: 'center', alignItems: 'center',
                  marginBottom: 12,
                  overflow: 'hidden',
                }}>
                  {strikerPlayer?.image ? (
                    <Image source={strikerPlayer.image} style={{ width: 56, height: 56 }} />
                  ) : selectedStriker ? (
                    <MaterialCommunityIcons name="account" size={32} color="#F5A623" />
                  ) : (
                    <Text style={{ fontSize: 22, fontWeight: '900', color: 'rgba(255,255,255,0.4)' }}>1</Text>
                  )}
                </View>

                {/* Label & Selected Name */}
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#F5A623', letterSpacing: 1.5, marginBottom: 6, textAlign: 'center' }}>OPENER</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: selectedStriker ? '#FFF' : 'rgba(255,255,255,0.3)', textAlign: 'center' }} numberOfLines={1}>
                    {selectedStriker || 'Tap to select'}
                  </Text>
                  {strikerPlayer?.isCaptain && (
                    <MaterialCommunityIcons name="star" size={14} color="#F5A623" style={{ marginLeft: 4 }} />
                  )}
                </View>
              </TouchableOpacity>

              {/* Slot 2 - Non-Striker */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setPlayerPickerFor('nonStriker')}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  backgroundColor: selectedNonStriker ? 'rgba(108, 138, 255, 0.08)' : 'rgba(255,255,255,0.03)',
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: selectedNonStriker ? '#6C8AFF' : 'rgba(255,255,255,0.1)',
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                }}
              >
                {/* Number Badge or Profile Image */}
                <View style={{
                  width: 56, height: 56, borderRadius: 28,
                  backgroundColor: selectedNonStriker ? 'rgba(108, 138, 255, 0.2)' : 'rgba(255,255,255,0.06)',
                  borderWidth: 2,
                  borderColor: selectedNonStriker ? '#6C8AFF' : 'rgba(255,255,255,0.15)',
                  justifyContent: 'center', alignItems: 'center',
                  marginBottom: 12,
                  overflow: 'hidden',
                }}>
                  {nonStrikerPlayer?.image ? (
                    <Image source={nonStrikerPlayer.image} style={{ width: 56, height: 56 }} />
                  ) : selectedNonStriker ? (
                    <MaterialCommunityIcons name="account" size={32} color="#6C8AFF" />
                  ) : (
                    <Text style={{ fontSize: 22, fontWeight: '900', color: 'rgba(255,255,255,0.4)' }}>2</Text>
                  )}
                </View>

                {/* Label & Selected Name */}
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#6C8AFF', letterSpacing: 1.5, marginBottom: 6, textAlign: 'center' }}>NON-STRIKER</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: selectedNonStriker ? '#FFF' : 'rgba(255,255,255,0.3)', textAlign: 'center' }} numberOfLines={1}>
                    {selectedNonStriker || 'Tap to select'}
                  </Text>
                  {nonStrikerPlayer?.isCaptain && (
                    <MaterialCommunityIcons name="star" size={14} color="#6C8AFF" style={{ marginLeft: 4 }} />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              style={[styles.overlayBtn, {
                opacity: (selectedStriker && selectedNonStriker) ? 1 : 0.4,
              }]}
              disabled={!selectedStriker || !selectedNonStriker}
              onPress={handleConfirmOpeners}
            >
              <Text style={styles.overlayBtnText}>LET'S PLAY 🏏</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Player Picker Sub-Modal */}
      {playerPickerFor && (
        <View style={styles.overlayContainer}>
          <View style={[styles.overlayCard, { paddingHorizontal: 16, paddingVertical: 20, maxHeight: '80%' }]}>
            {/* Picker Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, paddingHorizontal: 4 }}>
              <TouchableOpacity onPress={() => setPlayerPickerFor(null)} style={{ marginRight: 12 }}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: '900', color: '#FFF' }}>
                  {playerPickerFor === 'striker' ? 'Select Opener' : 'Select Non-Striker'}
                </Text>
                <Text style={{ fontSize: 12, color: battingTeamColor, fontWeight: '700', marginTop: 2 }}>
                  {battingTeam} Players
                </Text>
              </View>
              <View style={{
                paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
                backgroundColor: playerPickerFor === 'striker' ? 'rgba(245,166,35,0.15)' : 'rgba(108,138,255,0.15)',
                borderWidth: 1,
                borderColor: playerPickerFor === 'striker' ? 'rgba(245,166,35,0.4)' : 'rgba(108,138,255,0.4)',
              }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: playerPickerFor === 'striker' ? '#F5A623' : '#6C8AFF' }}>
                  {playerPickerFor === 'striker' ? 'OPENER' : 'NON-STRIKER'}
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 12 }} />

            {/* Player List */}
            <View style={{ maxHeight: 400, width: '100%' }}>
              <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 20 }}>
                {battingTeamPlayers.map((player, index) => {
                const isAlreadySelectedAsOther =
                  (playerPickerFor === 'striker' && selectedNonStriker === player.name) ||
                  (playerPickerFor === 'nonStriker' && selectedStriker === player.name);
                const accentColor = playerPickerFor === 'striker' ? '#F5A623' : '#6C8AFF';

                return (
                  <TouchableOpacity
                    key={`pick-${player.id}`}
                    activeOpacity={0.8}
                    disabled={isAlreadySelectedAsOther}
                    onPress={() => handlePlayerSelect(player.name)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      borderRadius: 14,
                      backgroundColor: isAlreadySelectedAsOther ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                      marginBottom: 8,
                      borderWidth: 1.5,
                      borderColor: isAlreadySelectedAsOther ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
                      opacity: isAlreadySelectedAsOther ? 0.35 : 1,
                    }}
                  >
                    {/* Player Image or Placeholder */}
                    {player.image ? (
                      <Image source={player.image} style={{
                        width: 44, height: 44, borderRadius: 22,
                        borderWidth: 2,
                        borderColor: isAlreadySelectedAsOther ? 'rgba(255,255,255,0.1)' : accentColor,
                        marginRight: 14,
                      }} />
                    ) : (
                      <View style={{
                        width: 44, height: 44, borderRadius: 22,
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        borderWidth: 2,
                        borderColor: isAlreadySelectedAsOther ? 'rgba(255,255,255,0.1)' : accentColor,
                        justifyContent: 'center', alignItems: 'center',
                        marginRight: 14,
                      }}>
                        <MaterialCommunityIcons name="account" size={22} color="rgba(255,255,255,0.4)" />
                      </View>
                    )}

                    {/* Player Name */}
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: isAlreadySelectedAsOther ? 'rgba(255,255,255,0.3)' : '#FFF' }}>
                        {player.name}
                      </Text>
                      {isAlreadySelectedAsOther && (
                        <Text style={{ fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>
                          Already selected as {playerPickerFor === 'striker' ? 'Non-Striker' : 'Opener'}
                        </Text>
                      )}
                      {player.isCaptain && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                          <MaterialCommunityIcons name="star" size={12} color="#F5A623" />
                          <Text style={{ fontSize: 10, fontWeight: '700', color: '#F5A623', marginLeft: 3 }}>Captain</Text>
                        </View>
                      )}
                    </View>

                    {/* Select arrow */}
                    {!isAlreadySelectedAsOther && (
                      <MaterialCommunityIcons name="chevron-right" size={22} color={accentColor} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          </View>
        </View>
      )}

      {/* Next Batsman Selection Modal */}
      {needsNewBatsman && matchStatus === 'ongoing' && (
        <View style={styles.overlayContainer}>
          <View style={[styles.overlayCard, { paddingHorizontal: 16, paddingVertical: 20, maxHeight: '80%' }]}>
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: 18 }}>
              <MaterialCommunityIcons name="account-alert" size={36} color="#FF4757" style={{ marginBottom: 8 }} />
              <Text style={[styles.overlayTitle, { fontSize: 20, color: '#FF4757' }]}>Wicket Fell!</Text>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Select the next batsman</Text>
            </View>

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 12 }} />

            {/* Player List */}
            <View style={{ maxHeight: 400, width: '100%' }}>
              <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 20 }}>
                {battingTeamPlayers.map((player) => {
                const isDismissed = dismissedBatsmen.includes(player.name);
                const isPlaying = striker === player.name || nonStriker === player.name;
                const isUnavailable = isDismissed || isPlaying;

                return (
                  <TouchableOpacity
                    key={`next-${player.id}`}
                    activeOpacity={0.8}
                    disabled={isUnavailable}
                    onPress={() => setNextBatsman(player.name)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      borderRadius: 14,
                      backgroundColor: isUnavailable ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                      marginBottom: 8,
                      borderWidth: 1.5,
                      borderColor: isUnavailable ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
                      opacity: isUnavailable ? 0.35 : 1, // Blur effect
                    }}
                  >
                    {/* Player Image or Placeholder */}
                    {player.image ? (
                      <Image source={player.image} style={{
                        width: 44, height: 44, borderRadius: 22,
                        borderWidth: 2,
                        borderColor: isUnavailable ? 'rgba(255,255,255,0.1)' : '#F5A623',
                        marginRight: 14,
                      }} />
                    ) : (
                      <View style={{
                        width: 44, height: 44, borderRadius: 22,
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        borderWidth: 2,
                        borderColor: isUnavailable ? 'rgba(255,255,255,0.1)' : '#F5A623',
                        justifyContent: 'center', alignItems: 'center',
                        marginRight: 14,
                      }}>
                        <MaterialCommunityIcons name="account" size={22} color="rgba(255,255,255,0.4)" />
                      </View>
                    )}

                    {/* Player Name */}
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: isUnavailable ? 'rgba(255,255,255,0.3)' : '#FFF' }}>
                        {player.name}
                      </Text>
                      {isDismissed && (
                        <Text style={{ fontSize: 10, fontWeight: '600', color: '#FF4757', marginTop: 2 }}>
                          Dismissed
                        </Text>
                      )}
                      {isPlaying && !isDismissed && (
                        <Text style={{ fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>
                          Currently playing
                        </Text>
                      )}
                      {player.isCaptain && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                          <MaterialCommunityIcons name="star" size={12} color="#F5A623" />
                          <Text style={{ fontSize: 10, fontWeight: '700', color: '#F5A623', marginLeft: 3 }}>Captain</Text>
                        </View>
                      )}
                    </View>

                    {/* Select arrow */}
                    {!isUnavailable && (
                      <MaterialCommunityIcons name="chevron-right" size={22} color="#F5A623" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          </View>
        </View>
      )}

      {/* Select Bowler Modal */}
      {openersSelected && needsNewBowler && matchStatus === 'ongoing' && !needsNewBatsman && (
        <View style={styles.overlayContainer}>
          <View style={[styles.overlayCard, { paddingHorizontal: 16, paddingVertical: 20, maxHeight: '80%' }]}>
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: 18 }}>
              <MaterialCommunityIcons name="cricket" size={36} color={bowlingTeamColor} style={{ marginBottom: 8 }} />
              <Text style={[styles.overlayTitle, { fontSize: 20, color: '#FFF' }]}>Select Bowler</Text>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                <Text style={{ color: bowlingTeamColor, fontWeight: '800' }}>{bowlingTeam}</Text> is bowling this over
              </Text>
            </View>

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 12 }} />

            {/* Player List */}
            <View style={{ maxHeight: 400, width: '100%' }}>
              <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 20 }}>
                {bowlingTeamPlayers.map((player) => {
                // Technically a bowler can't bowl two consecutive overs
                const isJustBowled = overs > 0 && bowler === player.name;

                // Calculate how many overs this player has completed
                const legalBalls = deliveries.filter(
                  (d) => d.bowlerName === player.name && (d.type === 'legal' || d.type === 'bye' || d.type === 'legBye')
                ).length;
                const completedOvers = Math.floor(legalBalls / 6);
                const isMaxReached = completedOvers >= maxOversLimit;

                const isDisabled = isJustBowled || isMaxReached;

                return (
                  <TouchableOpacity
                    key={`bowler-${player.id}`}
                    activeOpacity={0.8}
                    disabled={isDisabled}
                    onPress={() => setBowler(player.name)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      borderRadius: 14,
                      backgroundColor: isDisabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                      marginBottom: 8,
                      borderWidth: 1.5,
                      borderColor: isDisabled ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
                      opacity: isDisabled ? 0.35 : 1, // Blur effect
                    }}
                  >
                    {/* Player Image or Placeholder */}
                    {player.image ? (
                      <Image source={player.image} style={{
                        width: 44, height: 44, borderRadius: 22,
                        borderWidth: 2,
                        borderColor: isDisabled ? 'rgba(255,255,255,0.1)' : bowlingTeamColor,
                        marginRight: 14,
                      }} />
                    ) : (
                      <View style={{
                        width: 44, height: 44, borderRadius: 22,
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        borderWidth: 2,
                        borderColor: isDisabled ? 'rgba(255,255,255,0.1)' : bowlingTeamColor,
                        justifyContent: 'center', alignItems: 'center',
                        marginRight: 14,
                      }}>
                        <MaterialCommunityIcons name="account" size={22} color="rgba(255,255,255,0.4)" />
                      </View>
                    )}

                    {/* Player Name */}
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: isDisabled ? 'rgba(255,255,255,0.3)' : '#FFF' }}>
                        {player.name}
                      </Text>
                      {isJustBowled && !isMaxReached && (
                        <Text style={{ fontSize: 10, fontWeight: '600', color: '#FF4757', marginTop: 2 }}>
                          Bowled last over
                        </Text>
                      )}
                      {isMaxReached && (
                        <Text style={{ fontSize: 10, fontWeight: '600', color: '#FF4757', marginTop: 2 }}>
                          Max overs reached ({maxOversLimit})
                        </Text>
                      )}
                      {player.isCaptain && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                          <MaterialCommunityIcons name="star" size={12} color="#F5A623" />
                          <Text style={{ fontSize: 10, fontWeight: '700', color: '#F5A623', marginLeft: 3 }}>Captain</Text>
                        </View>
                      )}
                    </View>

                    {/* Select arrow */}
                    {!isDisabled && (
                      <MaterialCommunityIcons name="chevron-right" size={22} color={bowlingTeamColor} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          </View>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1522',
  },
  header: {
    paddingTop: 54,
    paddingBottom: 16,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInnings: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F5A623',
    letterSpacing: 2,
    textShadowColor: 'rgba(245,166,35,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerTeams: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 12,
  },
  targetText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#F5A623',
    marginTop: 4,
    letterSpacing: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 2,
    marginBottom: 12,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  gridContainer: {
    gap: 12,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    marginBottom: 32,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  bottomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  bottomBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F5A623',
  },
  bottomDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11,17,32,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 100,
  },
  overlayCard: {
    backgroundColor: '#1E1A16',
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: '#4A3A2A',
    elevation: 10,
  },
  overlayTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  overlaySubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 28,
    textAlign: 'center',
    lineHeight: 24,
  },
  overlayBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  overlayBtnText: {
    color: '#0B1120',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  customInput: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4A3A2A',
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    paddingVertical: 20,
    marginBottom: 28,
  },
  overlayRowBtn: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});
