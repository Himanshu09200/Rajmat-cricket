import { View, StyleSheet, Image } from "react-native";
import { Text, Button } from 'react-native-paper';
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#0B1120', '#162544', '#1A3A5C']}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/cricket-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>RAJMAT</Text>
        <Text style={styles.subtitle}>CRICKET</Text>
        <View style={styles.divider} />
        <Text style={styles.tagline}>Professional Cricket Scoring</Text>

        {/* Features */}
        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="cricket" size={22} color="#F5A623" />
            <Text style={styles.featureText}>Live Score</Text>
          </View>
          <View style={styles.featureDot} />
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="account-group" size={22} color="#F5A623" />
            <Text style={styles.featureText}>Team Mgmt</Text>
          </View>
          <View style={styles.featureDot} />
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="chart-line" size={22} color="#F5A623" />
            <Text style={styles.featureText}>Statistics</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={() => router.replace("/(tabs)/home" as any)}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          buttonColor="#F5A623"
          textColor="#0B1120"
        >
          GET STARTED
        </Button>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(245, 166, 35, 0.3)',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F5A623',
    letterSpacing: 12,
    marginTop: 4,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: '#F5A623',
    marginVertical: 20,
    borderRadius: 1,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
  },
  featuresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    gap: 12,
  },
  featureItem: {
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  featureDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(245, 166, 35, 0.4)',
  },
  footer: {
    paddingBottom: 50,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  button: {
    borderRadius: 30,
    width: '100%',
    elevation: 8,
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },
  version: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.25)',
    marginTop: 16,
  },
});
