import { useState } from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const [odometerReading, setOdometerReading] = useState<number | null>(null);
  const [questionNumber, setQuestionNumber] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const router = useRouter();

  const rollOdometer = () => {
    if (isRolling) return; // Prevent multiple clicks during animation

    setIsRolling(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setTimeout(() => {
      // Generate random odometer reading (10,000 - 99,999 km)
      const randomOdometer = Math.floor(Math.random() * 90000) + 10000;
      // Extract last 2 digits for question number (01-99)
      const lastTwoDigits = randomOdometer % 100;
      const finalQuestionNum = lastTwoDigits === 0 ? 1 : lastTwoDigits;

      setOdometerReading(randomOdometer);
      setQuestionNumber(finalQuestionNum);
      setIsRolling(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 800);
  };

  // Dice rotation animation
  const diceAnimatedStyle = useAnimatedStyle(() => {
    if (isRolling) {
      return {
        transform: [
          {
            rotate: withSequence(
              withTiming('0deg', { duration: 0 }),
              withTiming('360deg', { duration: 200 }),
              withTiming('720deg', { duration: 200 }),
              withTiming('1080deg', { duration: 200 }),
              withTiming('1440deg', { duration: 200 })
            ),
          },
        ],
      };
    }
    return {
      transform: [{ rotate: '0deg' }],
    };
  });

  // Result animation
  const resultAnimatedStyle = useAnimatedStyle(() => {
    if (odometerReading !== null && !isRolling) {
      return {
        opacity: withSpring(1),
        transform: [{ translateY: withSpring(0) }],
      };
    }
    return {
      opacity: 0,
      transform: [{ translateY: 20 }],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.topSection}>
          <ThemedText type="title" style={styles.title}>
            Questions Permis de Conduire
          </ThemedText>

          <Animated.Text style={[styles.diceIcon, diceAnimatedStyle]}>
            ⏲️
          </Animated.Text>
        </ThemedView>

        <ThemedView style={styles.middleSection}>
          {odometerReading === null ? (
            <ThemedText style={styles.prompt}>
              Consultez le compteur kilométrique !
            </ThemedText>
          ) : (
            <Animated.View style={resultAnimatedStyle}>
              <ThemedView style={styles.odometerContainer}>
                <ThemedText style={styles.odometerLabel}>
                  Compteur km:
                </ThemedText>
                <Text style={styles.odometerReading}>
                  {odometerReading.toLocaleString('fr-FR')} km
                </Text>
                <ThemedView style={styles.lastDigitsContainer}>
                  <ThemedText style={styles.lastDigitsLabel}>
                    Derniers 2 chiffres:
                  </ThemedText>
                  <Text style={styles.questionNumber}>
                    {questionNumber?.toString().padStart(2, '0')}
                  </Text>
                </ThemedView>
              </ThemedView>
            </Animated.View>
          )}
        </ThemedView>

        <ThemedView style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.button,
              { backgroundColor: '#0a7ea4' },
              isRolling && styles.buttonDisabled,
            ]}
            onPress={rollOdometer}
            disabled={isRolling}>
            <Text style={styles.buttonText}>
              {isRolling ? 'Lecture...' : 'Consulter le Compteur'}
            </Text>
          </Pressable>

          {questionNumber !== null && !isRolling && (
            <Animated.View style={resultAnimatedStyle}>
              <Pressable
                style={[styles.button, { backgroundColor: '#22c55e', marginTop: 16 }]}
                onPress={() => router.push(`/questions?number=${questionNumber}`)}>
                <Text style={styles.buttonText}>
                  Voir les Questions n°{questionNumber?.toString().padStart(2, '0')}
                </Text>
              </Pressable>
            </Animated.View>
          )}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  topSection: {
    alignItems: 'center',
    gap: 24,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    textAlign: 'center',
  },
  diceIcon: {
    fontSize: 80,
    lineHeight: 80,
  },
  prompt: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.7,
  },
  odometerContainer: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  odometerLabel: {
    fontSize: 16,
    opacity: 0.7,
  },
  odometerReading: {
    fontSize: 42,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 4,
    color: '#0a7ea4',
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  lastDigitsContainer: {
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 16,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  lastDigitsLabel: {
    fontSize: 14,
    opacity: 0.8,
  },
  questionNumber: {
    fontSize: 56,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: '#22c55e',
    letterSpacing: 8,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  showQuestionsButton: {
    backgroundColor: '#22c55e',
    marginTop: 16,
  },
});
