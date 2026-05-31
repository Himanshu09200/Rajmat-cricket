import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMatchStore, DeliveryType, getDeliveryLabel } from '../../store/useMatchStore';

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

const ScoreBoardCard = React.memo(({ runs, wickets, overs, balls, totalOvers, crr, deliveries }: any) => {
  const emptyBalls = Array.from({ length: 6 - deliveries.length }).map((_, i) => i);
  
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
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            {deliveries.length === 0 ? <Text style={{ color: '#888', fontSize: 16 }}>—</Text> : null}
            {deliveries.map((d: any, i: number) => {
              const label = getDeliveryLabel(d);
              let bgColor = 'rgba(255,255,255,0.1)';
              let textColor = '#FFF';
              
              if (label === 'W') { bgColor = '#FF4757'; }
              else if (label === 'WD' || label === 'NB') { bgColor = '#FECA57'; textColor = '#000'; }
              else if (label === '4') { bgColor = '#4AC29A'; }
              else if (label === '6') { bgColor = '#6C8AFF'; }
              
              return (
                <View key={`d-${i}`} style={{
                  width: 26, height: 26, borderRadius: 13, backgroundColor: bgColor,
                  justifyContent: 'center', alignItems: 'center',
                  shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 3, elevation: 3
                }}>
                  <Text style={{ color: textColor, fontSize: 11, fontWeight: '800' }}>{label}</Text>
                </View>
              );
            })}
            {/* Empty dots */}
            {emptyBalls.map((_, i) => (
              <View key={`e-${i}`} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.1)' }} />
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
// MAIN SCREEN
// ==========================================

export default function ScoreScreen() {
  const router = useRouter();
  const matchState = useMatchStore();
  const {
    battingTeam, bowlingTeam, runs, wickets, overs, balls,
    totalOvers, addDelivery, undoLastDelivery, endInnings, deliveries,
    currentInnings, matchStatus, targetScore, matchResult, startSecondInnings
  } = matchState;

  const currentOverDeliveries = deliveries.filter((d) => d.overIndex === overs);
  const totalBalls = overs * 6 + balls;
  const crr = totalBalls > 0 ? ((runs / totalBalls) * 6).toFixed(2) : '0.00';

  const [showCustomRun, setShowCustomRun] = useState(false);
  const [customRunValue, setCustomRunValue] = useState('');
  const [showNoBallRuns, setShowNoBallRuns] = useState(false);

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
        <View style={styles.overlayContainer}>
          <View style={styles.overlayCard}>
             <MaterialCommunityIcons name="trophy" size={48} color="#F5A623" style={{marginBottom: 10}}/>
             <Text style={styles.overlayTitle}>Match Completed</Text>
             <Text style={styles.overlaySubtitle}>{matchResult}</Text>
             <TouchableOpacity style={styles.overlayBtn} onPress={() => router.replace('/(tabs)/home' as any)}>
                <Text style={styles.overlayBtnText}>BACK TO HOME</Text>
             </TouchableOpacity>
          </View>
        </View>
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
