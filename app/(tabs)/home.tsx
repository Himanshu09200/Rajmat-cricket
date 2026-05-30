import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0F1522', '#141D2D']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Faint Background Watermark Rings */}
      <View style={[styles.watermarkRing, { width: 600, height: 600, top: -100, left: -100 }]} />
      <View style={[styles.watermarkRing, { width: 400, height: 400, top: 0, left: 0 }]} />
      <View style={[styles.watermarkRing, { width: 800, height: 800, top: 300, left: -200 }]} />
      <View style={styles.watermarkPitch} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <Text style={styles.pageTitle}>Home</Text>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.glowRing}>
            <LinearGradient
              colors={['#007BFF', '#00C6FF']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.glowInner}>
               <Image
                source={require('../../assets/images/cricket-logo.png')}
                style={styles.heroLogo}
                resizeMode="contain"
              />
            </View>
          </View>
          
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Ready to Play?</Text>
            <Text style={styles.heroSubtitle}>Start a match and track every ball</Text>
          </View>
        </View>

        {/* Start Match Button */}
        <TouchableOpacity
          style={styles.startCardWrapper}
          onPress={() => router.push('/start-match' as any)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#FDE484', '#C99327']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.startCardGradient}
          >
            <View style={styles.startCardContent}>
              <View>
                <Text style={styles.startCardTitle}>START NEW MATCH</Text>
                <Text style={styles.startCardSub}>Setup teams, toss & go</Text>
              </View>
              <View style={styles.startCardIconWrap}>
                 <LinearGradient
                    colors={['#B5801B', '#EAC15F']}
                    style={StyleSheet.absoluteFillObject}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                 />
                 <MaterialCommunityIcons name="cricket" size={26} color="#2A1B00" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Stats Grid */}
        <View style={styles.statsRow}>
          {/* Matches Card (Silver) */}
          <View style={[styles.statCard, { borderColor: '#8A95A5' }]}>
            <LinearGradient
              colors={['#E1E6EC', '#758292']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            {/* Inner bevel overlay */}
            <View style={styles.statInnerBevel} />
            <MaterialCommunityIcons name="trophy" size={24} color="#FACC15" style={styles.iconShadow} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>MATCHES</Text>
          </View>

          {/* Total Runs Card (Bronze/Gold) */}
          <View style={[styles.statCard, { borderColor: '#8A7A5D' }]}>
            <LinearGradient
              colors={['#C5B89D', '#6D6045']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.statInnerBevel} />
            <MaterialCommunityIcons name="chart-line-variant" size={24} color="#FACC15" style={styles.iconShadow} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>TOTAL RUNS</Text>
          </View>

          {/* Wickets Card (Brown) */}
          <View style={[styles.statCard, { borderColor: '#5C442D' }]}>
            <LinearGradient
              colors={['#8C6E4F', '#412C1A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.statInnerBevel} />
            <MaterialCommunityIcons name="lightning-bolt" size={24} color="#FACC15" style={styles.iconShadow} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>WICKETS</Text>
          </View>
        </View>

        {/* Recent Matches Section */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>RECENT MATCHES</Text>
          
          <View style={styles.recentCard}>
            <LinearGradient
              colors={['#162135', '#0E1624']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            {/* Custom Stadium Illustration simulation */}
            <View style={styles.stadiumIllustration}>
               <MaterialCommunityIcons name="stadium" size={100} color="#354664" />
               <View style={styles.stadiumPitch} />
            </View>
            <Text style={styles.emptyText}>No matches played yet</Text>
            <Text style={styles.emptySubtext}>Your match history will appear here</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1522',
  },
  watermarkRing: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  watermarkPitch: {
    position: 'absolute',
    width: 140,
    height: 350,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.02)',
    top: '30%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 60,
    marginLeft: 20,
    marginBottom: 20,
  },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  glowRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 3,
    shadowColor: '#00C6FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  glowInner: {
    flex: 1,
    backgroundColor: '#0B1120',
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  heroLogo: {
    width: '100%',
    height: '100%',
  },
  heroTextContainer: {
    marginLeft: 18,
    flex: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  startCardWrapper: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 24,
  },
  startCardGradient: {
    padding: 24,
  },
  startCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  startCardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F1400',
    letterSpacing: 1,
  },
  startCardSub: {
    fontSize: 13,
    color: 'rgba(31,20,0,0.7)',
    marginTop: 6,
  },
  startCardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  statInnerBevel: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 14,
  },
  iconShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  recentSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
    marginBottom: 16,
  },
  recentCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 30,
    alignItems: 'center',
    overflow: 'hidden',
  },
  stadiumIllustration: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  stadiumPitch: {
    position: 'absolute',
    width: 20,
    height: 40,
    backgroundColor: '#C5A880',
    top: '40%',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.3)',
  },
});
