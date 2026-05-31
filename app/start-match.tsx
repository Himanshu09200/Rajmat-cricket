import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput as RNTextInput,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMatchStore } from '../store/useMatchStore';

const { width } = Dimensions.get('window');

const ROSTER_PLAYERS = [
  { id: 'roster-1', name: 'Anup', image: require('../assets/images/anup.jpg') },
  { id: 'roster-2', name: 'Banti', image: require('../assets/images/banti.jpg') },
  { id: 'roster-3', name: 'Gaurav', image: require('../assets/images/gaurav.jpg') },
  { id: 'roster-4', name: 'Himanshu', image: require('../assets/images/himanshu.jpg') },
  { id: 'roster-5', name: 'Himanshu Varma', image: require('../assets/images/himanshu_varma.jpg') },
  { id: 'roster-6', name: 'Karan', image: require('../assets/images/karan.jpg') },
  { id: 'roster-7', name: 'Keshav', image: require('../assets/images/keshav.jpg') },
  { id: 'roster-8', name: 'Kunal', image: require('../assets/images/kunal.jpg') },
  { id: 'roster-9', name: 'Lokesh', image: require('../assets/images/lokesh.jpg') },
  { id: 'roster-10', name: 'Nitish', image: require('../assets/images/nitish.jpg') },
  { id: 'roster-11', name: 'Priyanshu', image: require('../assets/images/priyanshu.jpg') },
  { id: 'roster-12', name: 'Rahul', image: require('../assets/images/rahul.jpg') },
  { id: 'roster-13', name: 'Rajiv', image: require('../assets/images/rajiv.jpg') },
  { id: 'roster-14', name: 'Ranjan', image: require('../assets/images/ranjan.jpg') },
  { id: 'roster-15', name: 'Roshan Potta', image: require('../assets/images/roshan_potta.jpg') },
  { id: 'roster-16', name: 'Roshan Varma', image: require('../assets/images/roshan_varma.jpg') },
  { id: 'roster-17', name: 'Shivam', image: require('../assets/images/shivam.jpg') },
  { id: 'roster-18', name: 'Shivam Singh', image: require('../assets/images/shivam_singh.jpg') },
  { id: 'roster-19', name: 'Vicky', image: require('../assets/images/vicky.jpg') },
];

// ==========================================
// CUSTOM SKEUOMORPHIC VISUAL COMPONENTS
// ==========================================

// Realistic 3D-looking Cricket Ball
const LeatherBall = React.memo(({ size = 48 }: { size?: number }) => {
  return (
    <View style={{ width: size, height: size }}>
      <LinearGradient
        colors={['#FF5252', '#B71C1C', '#7F0000']}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 0.8, y: 0.8 }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: size / 2,
          borderWidth: 1.5,
          borderColor: 'rgba(255, 255, 255, 0.2)',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.45,
          shadowRadius: 5,
          elevation: 6,
        }}
      >
        {/* Shine Highlight Overlay */}
        <View
          style={{
            position: 'absolute',
            top: '10%',
            left: '15%',
            width: '40%',
            height: '40%',
            borderRadius: size * 0.2,
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
          }}
        />
        {/* Seam Stitching */}
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: 5,
            backgroundColor: 'transparent',
            borderTopWidth: 1.5,
            borderBottomWidth: 1.5,
            borderColor: 'rgba(255, 255, 255, 0.6)',
            borderStyle: 'dashed',
            top: '45%',
            transform: [{ rotate: '15deg' }],
          }}
        />
      </LinearGradient>
    </View>
  );
});

// Skeuomorphic Wood-textured Cricket Bat
const CricketBat = React.memo(({ size = 50 }: { size?: number }) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '-35deg' }],
      }}
    >
      {/* Wooden Blade */}
      <LinearGradient
        colors={['#E5A93B', '#C1882A', '#8F5C12']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: size * 0.16,
          height: size * 0.7,
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
          borderWidth: 1,
          borderColor: '#5C3806',
          shadowColor: '#000',
          shadowOffset: { width: 1, height: 2 },
          shadowOpacity: 0.4,
          shadowRadius: 2,
          elevation: 3,
        }}
      />
      {/* Handle */}
      <View
        style={{
          width: size * 0.08,
          height: size * 0.35,
          backgroundColor: '#4E342E',
          borderRadius: 1,
          borderWidth: 0.5,
          borderColor: '#1A0C08',
          position: 'absolute',
          bottom: '68%',
        }}
      />
      {/* Handle Grip */}
      <View
        style={{
          width: size * 0.1,
          height: size * 0.22,
          backgroundColor: '#EAEAEA',
          position: 'absolute',
          bottom: '72%',
          borderRadius: 1,
          borderWidth: 0.5,
          borderColor: '#9E9E9E',
        }}
      />
    </View>
  );
});

// Premium Skeuomorphic Cricket Cap Visual Component
const CricketCap = React.memo(({ color }: { color: string }) => {
  return (
    <View style={{ width: 70, height: 56, justifyContent: 'center', alignItems: 'center' }}>
      {/* Cap Dome */}
      <LinearGradient
        colors={[color, '#1A2332']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{
          width: 50,
          height: 34,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.12)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 3,
          elevation: 4,
        }}
      >
        {/* Cap Top Button */}
        <View
          style={{
            position: 'absolute',
            top: -3,
            left: 22,
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: color,
            borderWidth: 0.5,
            borderColor: 'rgba(255,255,255,0.4)',
          }}
        />
        {/* Cap Segment lines */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 24,
            bottom: 0,
            width: 1,
            backgroundColor: 'rgba(255,255,255,0.1)',
          }}
        />
      </LinearGradient>
      {/* Cap Visor / Brim */}
      <LinearGradient
        colors={[color, '#0A0D14']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          width: 58,
          height: 8,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 8,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 12,
          marginTop: -6,
          marginLeft: 10,
          borderWidth: 0.5,
          borderColor: 'rgba(255,255,255,0.15)',
        }}
      />
    </View>
  );
});

// Premium Dial-like Metallic Button for Overs
const DialButton = React.memo(({
  icon,
  onPress,
  disabled,
}: {
  icon: string;
  onPress: () => void;
  disabled?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 8,
      }}
    >
      <LinearGradient
        colors={['#C5B3A6', '#877567', '#504439']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          borderWidth: 2,
          borderColor: '#362E27',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
        }}
      >
        <LinearGradient
          colors={['#2A211B', '#16110E']}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.08)',
          }}
        >
          <MaterialCommunityIcons name={icon as any} size={20} color="#D2C5B9" />
        </LinearGradient>
      </LinearGradient>
    </TouchableOpacity>
  );
});

// Metallic Stepper (Plus/Minus) for Player Count
const MetallicStepper = React.memo(({
  value,
  onIncrement,
  onDecrement,
}: {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1C1917',
        borderRadius: 12,
        padding: 4,
        borderWidth: 1.5,
        borderColor: '#433A31',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 4,
        width: 125,
        height: 42,
      }}
    >
      {/* Minus Button */}
      <TouchableOpacity
        onPress={onDecrement}
        activeOpacity={0.7}
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#45382D',
        }}
      >
        <LinearGradient
          colors={['#B5A69B', '#7A685D', '#4B3E36']}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MaterialCommunityIcons name="minus" size={16} color="#1E140C" style={{ fontWeight: 'bold' }} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Center Value Plaque */}
      <View
        style={{
          flex: 1,
          marginHorizontal: 3,
          height: 32,
          backgroundColor: '#0F0D0C',
          borderRadius: 5,
          borderWidth: 1,
          borderColor: '#26201C',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: '900',
            color: '#E6A129',
            fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
            textShadowColor: 'rgba(230,161,41,0.4)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 4,
          }}
        >
          {value < 10 ? `0${value}` : value}
        </Text>
      </View>

      {/* Plus Button */}
      <TouchableOpacity
        onPress={onIncrement}
        activeOpacity={0.7}
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#45382D',
        }}
      >
        <LinearGradient
          colors={['#B5A69B', '#7A685D', '#4B3E36']}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MaterialCommunityIcons name="plus" size={16} color="#1E140C" style={{ fontWeight: 'bold' }} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
});

// Checkmark Badge for Selected Cards
const ActiveCheckBadge = React.memo(() => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 8,
        right: 8,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#F5A623',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 3,
        zIndex: 10,
      }}
    >
      <MaterialCommunityIcons name="check" size={12} color="#0B1120" style={{ fontWeight: 'bold' }} />
    </View>
  );
});

// Background Stadium Overlay
const StadiumBackground = React.memo(() => {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Deep Gradient */}
      <LinearGradient
        colors={['#0F1522', '#141D2D', '#0A0E17']}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Stadium Spotlight Glow Left */}
      <LinearGradient
        colors={['rgba(255,255,255,0.05)', 'transparent']}
        style={{
          position: 'absolute',
          top: -120,
          left: -120,
          width: 320,
          height: 520,
          transform: [{ rotate: '38deg' }],
        }}
      />
      {/* Stadium Spotlight Glow Right */}
      <LinearGradient
        colors={['rgba(255,255,255,0.05)', 'transparent']}
        style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 320,
          height: 520,
          transform: [{ rotate: '-38deg' }],
        }}
      />
      {/* Pitch Lane Watermark */}
      <View
        style={{
          position: 'absolute',
          left: '50%',
          top: '15%',
          bottom: '15%',
          width: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.015)',
          borderStyle: 'dashed',
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: '42%',
          width: '16%',
          height: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          top: '22%',
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: '42%',
          width: '16%',
          height: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          bottom: '22%',
        }}
      />
    </View>
  );
});

// Memoized Player Input Row for Smooth Typing
const MemoizedPlayerInputRow = React.memo(({ player, expandedTeam, updatePlayer, setCaptain, idx }: any) => {
  const [localName, setLocalName] = useState(player.name);
  
  React.useEffect(() => {
    setLocalName(player.name);
  }, [player.name]);

  return (
    <View style={[styles.playerInputRow, player.isCaptain && { borderColor: 'rgba(245, 166, 35, 0.4)', backgroundColor: 'rgba(245, 166, 35, 0.05)' }]}>
      {player.image ? (
        <TouchableOpacity 
          style={{ position: 'relative', marginRight: 10 }}
          onPress={() => setCaptain(expandedTeam, player.id)}
        >
          <Image source={player.image} style={[{ width: 22, height: 22, borderRadius: 11 }, player.isCaptain && { borderWidth: 1.5, borderColor: '#F5A623' }]} />
          {player.isCaptain && (
            <View style={{ position: 'absolute', bottom: -6, right: -6, backgroundColor: '#F5A623', borderRadius: 8, width: 14, height: 14, justifyContent: 'center', alignItems: 'center', zIndex: 10, borderWidth: 1, borderColor: '#1F293D' }}>
              <Text style={{ fontSize: 9, fontWeight: '900', color: '#0B1120' }}>C</Text>
            </View>
          )}
          <TouchableOpacity 
            style={{ position: 'absolute', top: -6, left: -6, backgroundColor: '#FF4757', borderRadius: 8, width: 14, height: 14, justifyContent: 'center', alignItems: 'center', zIndex: 11 }}
            onPress={() => {
              setLocalName(`Player ${idx + 1}`);
              updatePlayer(expandedTeam, player.id, `Player ${idx + 1}`, null);
            }}
          >
            <MaterialCommunityIcons name="close" size={10} color="#FFF" />
          </TouchableOpacity>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={[styles.playerNumberBadge, player.isCaptain && { backgroundColor: 'rgba(245, 166, 35, 0.2)', borderWidth: 1, borderColor: '#F5A623' }]}
          onPress={() => setCaptain(expandedTeam, player.id)}
        >
          {player.isCaptain ? (
            <Text style={[styles.playerNumberText, { color: '#F5A623' }]}>C</Text>
          ) : (
            <Text style={styles.playerNumberText}>{idx + 1}</Text>
          )}
        </TouchableOpacity>
      )}
      <RNTextInput
        value={localName}
        onChangeText={setLocalName}
        onEndEditing={() => updatePlayer(expandedTeam, player.id, localName)}
        style={styles.playerInputField}
        placeholderTextColor="rgba(255,255,255,0.3)"
        placeholder={`Player ${idx + 1}`}
      />
      <TouchableOpacity 
        style={{ paddingHorizontal: 4 }}
        onPress={() => setCaptain(expandedTeam, player.id)}
      >
        <MaterialCommunityIcons 
          name={player.isCaptain ? "star" : "star-outline"} 
          size={18} 
          color={player.isCaptain ? "#F5A623" : "rgba(255,255,255,0.2)"} 
          style={{ marginRight: 6 }}
        />
      </TouchableOpacity>
      <MaterialCommunityIcons name="pencil" size={16} color="rgba(255,255,255,0.2)" />
    </View>
  );
});

LeatherBall.displayName = 'LeatherBall';
CricketBat.displayName = 'CricketBat';
CricketCap.displayName = 'CricketCap';
DialButton.displayName = 'DialButton';
MetallicStepper.displayName = 'MetallicStepper';
ActiveCheckBadge.displayName = 'ActiveCheckBadge';
StadiumBackground.displayName = 'StadiumBackground';
MemoizedPlayerInputRow.displayName = 'MemoizedPlayerInputRow';

export default function StartMatchScreen() {
  const router = useRouter();
  const { setupMatch, team1Players, team2Players, setPlayerCount, updatePlayer, setCaptain } = useMatchStore();

  const [team1, setTeam1] = useState('Team A');
  const [team2, setTeam2] = useState('Team B');
  const [tossWinner, setTossWinner] = useState('Team A');
  const [optTo, setOptTo] = useState<'bat' | 'bowl'>('bat');
  const [overs, setOvers] = useState('20');
  const [expandedTeam, setExpandedTeam] = useState<'team1' | 'team2' | null>(null);

  const assignRosterPlayer = (rosterPlayer: any) => {
    if (!expandedTeam) return;
    const players = expandedTeam === 'team1' ? team1Players : team2Players;
    const emptySlotIndex = players.findIndex(p => p.name.startsWith('Player '));
    if (emptySlotIndex !== -1) {
      updatePlayer(expandedTeam, players[emptySlotIndex].id, rosterPlayer.name, rosterPlayer.image);
    }
  };

  const assignCommonPlayer = (rosterPlayer: any) => {
    const inTeam1 = team1Players.some(p => p.name === rosterPlayer.name);
    const inTeam2 = team2Players.some(p => p.name === rosterPlayer.name);
    if (!inTeam1) {
      const slot1 = team1Players.findIndex(p => p.name.startsWith('Player '));
      if (slot1 !== -1) {
        updatePlayer('team1', team1Players[slot1].id, rosterPlayer.name, rosterPlayer.image);
      }
    }
    if (!inTeam2) {
      const slot2 = team2Players.findIndex(p => p.name.startsWith('Player '));
      if (slot2 !== -1) {
        updatePlayer('team2', team2Players[slot2].id, rosterPlayer.name, rosterPlayer.image);
      }
    }
  };

  const handleStartMatch = () => {
    // Resolve current text values for setup
    const t1Name = team1.trim() || 'Team A';
    const t2Name = team2.trim() || 'Team B';
    const winnerName = tossWinner === 'Team A' ? t1Name : t2Name;
    
    setupMatch(t1Name, t2Name, winnerName, optTo, parseInt(overs, 10));
    router.replace('/match/score' as any);
  };

  const handleIncrement = (team: 'team1' | 'team2') => {
    const current = team === 'team1' ? team1Players.length : team2Players.length;
    if (current < 15) {
      setPlayerCount('team1', current + 1);
      setPlayerCount('team2', current + 1);
    }
  };

  const handleDecrement = (team: 'team1' | 'team2') => {
    const current = team === 'team1' ? team1Players.length : team2Players.length;
    if (current > 2) {
      setPlayerCount('team1', current - 1);
      setPlayerCount('team2', current - 1);
    }
  };

  // Overs Custom Labels
  const getOversLabel = (oversCount: string) => {
    const count = parseInt(oversCount, 10);
    if (count === 20) return 'Standard T20';
    if (count === 50) return 'Standard ODI';
    if (count === 10) return 'T10 Match';
    if (count === 5) return 'Five Overs';
    return 'Custom Match';
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Stadium Background Design */}
      <StadiumBackground />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8} style={styles.backBtn}>
          <LinearGradient
            colors={['#1F293D', '#111827']}
            style={styles.backGradient}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>MATCH SETUP</Text>

        <View style={styles.floatingBallWrap}>
          <LeatherBall size={32} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ========================================================
            TEAM NAMES SECTION
            ======================================================== */}
        <Text style={styles.sectionLabel}>TEAM NAMES</Text>
        <View style={styles.teamNamesRow}>
          {/* Team A Card */}
          <View style={[styles.teamInputCard, styles.teamACardBorder]}>
            <LinearGradient
              colors={['rgba(21, 34, 56, 0.45)', 'rgba(10, 16, 28, 0.7)']}
              style={styles.cardGradient}
            >
              <View style={styles.teamCardHeader}>
                <Text style={styles.teamInputTitleA}>Team A</Text>
              </View>
              <RNTextInput
                value={team1}
                onChangeText={(text) => {
                  setTeam1(text);
                }}
                style={styles.teamInputField}
                placeholderTextColor="rgba(255,255,255,0.25)"
                placeholder="Team A Name"
                maxLength={14}
              />
              <Text style={styles.logoPlaceholder}>logo placeholder</Text>
            </LinearGradient>
          </View>

          {/* Team B Card */}
          <View style={[styles.teamInputCard, styles.teamBCardBorder]}>
            <LinearGradient
              colors={['rgba(21, 34, 56, 0.45)', 'rgba(10, 16, 28, 0.7)']}
              style={styles.cardGradient}
            >
              <View style={styles.teamCardHeader}>
                <Text style={styles.teamInputTitleB}>Team B</Text>
              </View>
              <RNTextInput
                value={team2}
                onChangeText={(text) => {
                  setTeam2(text);
                }}
                style={styles.teamInputField}
                placeholderTextColor="rgba(255,255,255,0.25)"
                placeholder="Team B Name"
                maxLength={14}
              />
              <Text style={styles.logoPlaceholder}>logo placeholder</Text>
            </LinearGradient>
          </View>
        </View>

        {/* ========================================================
            PLAYERS SECTION
            ======================================================== */}
        <Text style={styles.sectionLabel}>PLAYERS</Text>
        <View style={styles.playersRow}>
          {/* Team A Players Card */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setExpandedTeam(expandedTeam === 'team1' ? null : 'team1')}
            style={[
              styles.playerTeamCard,
              { borderColor: expandedTeam === 'team1' ? '#4AC29A' : 'rgba(255,255,255,0.06)' }
            ]}
          >
            <LinearGradient
              colors={['rgba(21, 34, 56, 0.4)', 'rgba(10, 16, 28, 0.6)']}
              style={styles.cardGradientInside}
            >
              <MaterialCommunityIcons name="account-group" size={32} color="#4AC29A" />
              <Text style={[styles.playerTeamLabel, { color: '#4AC29A' }]}>{team1.trim() || 'Team A'} Players</Text>
              <View style={{ marginTop: 8 }} pointerEvents="box-none">
                <MetallicStepper
                  value={team1Players.length}
                  onIncrement={() => handleIncrement('team1')}
                  onDecrement={() => handleDecrement('team1')}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Team B Players Card */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setExpandedTeam(expandedTeam === 'team2' ? null : 'team2')}
            style={[
              styles.playerTeamCard,
              { borderColor: expandedTeam === 'team2' ? '#6C8AFF' : 'rgba(255,255,255,0.06)' }
            ]}
          >
            <LinearGradient
              colors={['rgba(21, 34, 56, 0.4)', 'rgba(10, 16, 28, 0.6)']}
              style={styles.cardGradientInside}
            >
              <MaterialCommunityIcons name="account-group" size={32} color="#6C8AFF" />
              <Text style={[styles.playerTeamLabel, { color: '#6C8AFF' }]}>{team2.trim() || 'Team B'} Players</Text>
              <View style={{ marginTop: 8 }} pointerEvents="box-none">
                <MetallicStepper
                  value={team2Players.length}
                  onIncrement={() => handleIncrement('team2')}
                  onDecrement={() => handleDecrement('team2')}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Collapsible Player Name Customizer */}
        {expandedTeam && (
          <View style={styles.expandedPlayersContainer}>
            <LinearGradient
              colors={['#172237', '#0F1624']}
              style={styles.expandedGradient}
            >
              <View style={styles.expandedHeader}>
                <Text style={styles.expandedTitle}>
                  Edit {expandedTeam === 'team1' ? (team1.trim() || 'Team A') : (team2.trim() || 'Team B')} Player Names
                </Text>
                <TouchableOpacity onPress={() => setExpandedTeam(null)}>
                  <MaterialCommunityIcons name="close-circle" size={20} color="rgba(255,255,255,0.4)" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.expandedScroll} nestedScrollEnabled>
                {(expandedTeam === 'team1' ? team1Players : team2Players).map((player, idx) => (
                  <MemoizedPlayerInputRow
                    key={player.id}
                    player={player}
                    expandedTeam={expandedTeam}
                    updatePlayer={updatePlayer}
                    setCaptain={setCaptain}
                    idx={idx}
                  />
                ))}
              </ScrollView>

              <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 12 }}>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 8, fontWeight: '700' }}>SELECT FROM ROSTER</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                  {(() => {
                    const hasCommonPlayer = ROSTER_PLAYERS.some(rp => 
                      team1Players.some(p => p.name === rp.name) && team2Players.some(p => p.name === rp.name)
                    );
                    return ROSTER_PLAYERS.map(rp => {
                    const inTeam1 = team1Players.some(p => p.name === rp.name);
                    const inTeam2 = team2Players.some(p => p.name === rp.name);
                    const isCommon = inTeam1 && inTeam2;
                    const isUsed = inTeam1 || inTeam2;
                    return (
                      <View key={rp.id} style={{ alignItems: 'center', opacity: isUsed && !isCommon ? 0.3 : 1 }}>
                        <TouchableOpacity 
                          onPress={() => !isUsed && assignRosterPlayer(rp)}
                          disabled={isUsed}
                          style={{ alignItems: 'center' }}
                        >
                          <Image source={rp.image} style={[
                            { width: 44, height: 44, borderRadius: 22, borderWidth: 2, marginBottom: 4 },
                            isCommon
                              ? { borderColor: '#A855F7' }
                              : isUsed 
                                ? { borderColor: 'rgba(255,255,255,0.15)' } 
                                : { borderColor: '#F5A623' }
                          ]} />
                          <Text style={{ color: isUsed && !isCommon ? 'rgba(255,255,255,0.3)' : '#FFF', fontSize: 10, fontWeight: '600' }}>{rp.name}</Text>
                          {isUsed && !isCommon && (
                            <View style={{ position: 'absolute', top: 12, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, paddingHorizontal: 4, paddingVertical: 1 }}>
                              <MaterialCommunityIcons name="check-circle" size={14} color="rgba(74, 194, 154, 0.7)" />
                            </View>
                          )}
                          {isCommon && (
                            <View style={{ position: 'absolute', top: 12, backgroundColor: 'rgba(168, 85, 247, 0.85)', borderRadius: 8, paddingHorizontal: 4, paddingVertical: 1 }}>
                              <MaterialCommunityIcons name="account-switch" size={14} color="#FFF" />
                            </View>
                          )}
                        </TouchableOpacity>
                        {/* Common Player Toggle - only show if no common player exists yet */}
                        {!isCommon && !hasCommonPlayer && (
                          <TouchableOpacity
                            onPress={() => assignCommonPlayer(rp)}
                            style={{
                              marginTop: 4,
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: 'rgba(168, 85, 247, 0.15)',
                              borderRadius: 8,
                              paddingHorizontal: 5,
                              paddingVertical: 2,
                              borderWidth: 1,
                              borderColor: 'rgba(168, 85, 247, 0.4)',
                            }}
                          >
                            <MaterialCommunityIcons name="account-switch-outline" size={10} color="#A855F7" />
                            <Text style={{ fontSize: 7, color: '#A855F7', fontWeight: '800', marginLeft: 2 }}>BOTH</Text>
                          </TouchableOpacity>
                        )}
                        {isCommon && (
                          <Text style={{ fontSize: 7, color: '#A855F7', fontWeight: '800', marginTop: 2 }}>COMMON</Text>
                        )}
                      </View>
                    );
                  });
                  })()}
                </ScrollView>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* ========================================================
            OVERS SECTION
            ======================================================== */}
        <Text style={styles.sectionLabel}>OVERS</Text>
        <View style={styles.oversRow}>
          {/* Dial Minus Button */}
          <DialButton
            icon="minus"
            onPress={() => {
              const v = Math.max(1, parseInt(overs, 10) - 1);
              setOvers(String(v));
            }}
          />

          {/* Center Display */}
          <View style={styles.oversCenterDisplay}>
            <Text style={styles.oversNumber}>{overs}</Text>
            <Text style={styles.oversSubText}>OVERS</Text>
            <Text style={styles.oversTypeLabel}>{getOversLabel(overs)}</Text>
          </View>

          {/* Dial Plus Button */}
          <DialButton
            icon="plus"
            onPress={() => {
              const v = Math.min(50, parseInt(overs, 10) + 1);
              setOvers(String(v));
            }}
          />
        </View>

        {/* ========================================================
            TOSS WON BY SECTION
            ======================================================== */}
        <Text style={styles.sectionLabel}>TOSS WON BY</Text>
        <View style={styles.tossRow}>
          {/* Team A Cap */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setTossWinner('Team A')}
            style={[
              styles.tossCapCard,
              tossWinner === 'Team A' && styles.activeGoldBorder,
            ]}
          >
            <LinearGradient
              colors={['rgba(21, 34, 56, 0.4)', 'rgba(10, 16, 28, 0.65)']}
              style={styles.capCardGradient}
            >
              {tossWinner === 'Team A' && <ActiveCheckBadge />}
              <View style={[styles.capGlowWrap, { transform: [{ scale: 0.8 }] }]}>
                <CricketCap color="#4AC29A" />
              </View>
              <Text style={styles.capTeamName}>{team1.trim() || 'Team A'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Team B Cap */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setTossWinner('Team B')}
            style={[
              styles.tossCapCard,
              tossWinner === 'Team B' && styles.activeGoldBorder,
            ]}
          >
            <LinearGradient
              colors={['rgba(21, 34, 56, 0.4)', 'rgba(10, 16, 28, 0.65)']}
              style={styles.capCardGradient}
            >
              {tossWinner === 'Team B' && <ActiveCheckBadge />}
              <View style={[styles.capGlowWrap, { transform: [{ scale: 0.8 }] }]}>
                <CricketCap color="#6C8AFF" />
              </View>
              <Text style={styles.capTeamName}>{team2.trim() || 'Team B'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ========================================================
            OPTED TO SECTION
            ======================================================== */}
        <Text style={styles.sectionLabel}>OPTED TO</Text>
        <View style={styles.tossRow}>
          {/* BAT Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setOptTo('bat')}
            style={[
              styles.decisionCard,
              optTo === 'bat' && styles.activeGoldBorder,
            ]}
          >
            <LinearGradient
              colors={['rgba(21, 34, 56, 0.45)', 'rgba(10, 16, 28, 0.65)']}
              style={styles.decisionGradient}
            >
              {optTo === 'bat' && <ActiveCheckBadge />}
              <View style={styles.decisionIconWrap}>
                <CricketBat size={36} />
              </View>
              <Text style={[styles.decisionText, optTo === 'bat' && styles.decisionTextActive]}>
                BAT
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* BOWL Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setOptTo('bowl')}
            style={[
              styles.decisionCard,
              optTo === 'bowl' && styles.activeGoldBorder,
            ]}
          >
            <LinearGradient
              colors={['rgba(21, 34, 56, 0.45)', 'rgba(10, 16, 28, 0.65)']}
              style={styles.decisionGradient}
            >
              {optTo === 'bowl' && <ActiveCheckBadge />}
              <View style={styles.decisionIconWrap}>
                <LeatherBall size={28} />
              </View>
              <Text style={[styles.decisionText, optTo === 'bowl' && styles.decisionTextActive]}>
                BOWL
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ========================================================
            START MATCH BUTTON
            ======================================================== */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={handleStartMatch}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={['#FFDF60', '#C59021']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.startGradient}
          >
            <MaterialCommunityIcons name="cricket" size={24} color="#2A1B00" style={styles.btnIcon} />
            <Text style={styles.startBtnText}>START MATCH</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1522',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 16,
    zIndex: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
  },
  backGradient: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  floatingBallWrap: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 1.5,
    marginTop: 22,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  // Team Names
  teamNamesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  teamInputCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  teamACardBorder: {
    borderColor: 'rgba(74, 194, 154, 0.3)',
  },
  teamBCardBorder: {
    borderColor: 'rgba(108, 138, 255, 0.3)',
  },
  cardGradient: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    alignItems: 'center',
    minHeight: 115,
  },
  teamCardHeader: {
    marginBottom: 6,
  },
  teamInputTitleA: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4AC29A',
    letterSpacing: 0.5,
  },
  teamInputTitleB: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6C8AFF',
    letterSpacing: 0.5,
  },
  teamInputField: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    width: '100%',
    paddingVertical: 4,
  },
  logoPlaceholder: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.25)',
    marginTop: 6,
    fontWeight: '500',
  },
  // Players Section
  playersRow: {
    flexDirection: 'row',
    gap: 12,
  },
  playerTeamCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  cardGradientInside: {
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  playerTeamLabel: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 6,
    textAlign: 'center',
  },
  // Expanded Players Name List
  expandedPlayersContainer: {
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  expandedGradient: {
    padding: 16,
  },
  expandedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    paddingBottom: 8,
    marginBottom: 12,
  },
  expandedTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FDE484',
    letterSpacing: 0.5,
  },
  expandedScroll: {
    maxHeight: 220,
  },
  playerInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  playerNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  playerNumberText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '800',
  },
  playerInputField: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    paddingVertical: 4,
  },
  // Overs
  oversRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(21, 34, 56, 0.45)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  oversCenterDisplay: {
    alignItems: 'center',
    minWidth: 100,
  },
  oversNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FDE484',
    textShadowColor: 'rgba(253, 228, 132, 0.25)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  oversSubText: {
    fontSize: 11,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 1,
    marginTop: -2,
  },
  oversTypeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.25)',
    marginTop: 4,
  },
  // Toss & Opted
  tossRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tossCapCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  capCardGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  capGlowWrap: {
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  capIconShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  capTeamName: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  activeGoldBorder: {
    borderColor: '#F5A623',
    shadowColor: '#F5A623',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  decisionCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  decisionGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
    minHeight: 80,
    justifyContent: 'center',
  },
  decisionIconWrap: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decisionText: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.4)',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  decisionTextActive: {
    color: '#F5A623',
  },
  // Start Button
  startBtn: {
    marginTop: 32,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#F5A623',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  startGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  btnIcon: {
    marginRight: 10,
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F1400',
    letterSpacing: 2,
  },
});
