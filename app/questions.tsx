import { useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Text, Platform } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import questionsData from '@/questions_answers.json';

type QuestionData = {
  VI?: { Q: string; A: string };
  VE?: { Q: string; A: string };
  QSER: { Q: string; A: string };
  '1ers secours': { Q: string; A: string };
};

type QuestionsDatabase = {
  [key: string]: QuestionData;
};

export default function QuestionsScreen() {
  const { number } = useLocalSearchParams<{ number: string }>();
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [showAnswer3, setShowAnswer3] = useState(false);

  // Format the number to match the JSON keys (e.g., "1" -> "01")
  const formattedNumber = number?.toString().padStart(2, '0') || '00';

  const questions = (questionsData as QuestionsDatabase)[formattedNumber];

  if (!questions) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: Platform.OS === 'android' ? 'Accueil' : `Question ${number}` }} />
        <ThemedView style={styles.content}>
          <ThemedText type="title">Aucune question trouvée</ThemedText>
          <ThemedText>Les questions pour le numéro {number} ne sont pas disponibles.</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  const firstQuestionType = questions.VI || questions.VE;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: Platform.OS === 'android' ? 'Accueil' : `Question ${number}` }} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Question #{number}
          </ThemedText>
        </ThemedView>

        {/* First Question Type (VI or VE) */}
        {firstQuestionType && (
          <ThemedView style={styles.questionCard}>
            <ThemedText type="subtitle" style={styles.questionType}>
              {questions.VI ? 'VI - Vérification Intérieure' : 'VE - Vérification Extérieure'}
            </ThemedText>
            <View style={styles.questionSection}>
              <ThemedText style={styles.label}>Question:</ThemedText>
              <ThemedText style={styles.questionText}>{firstQuestionType.Q}</ThemedText>
            </View>
            <Pressable
              style={[styles.showAnswerButton, { backgroundColor: '#3b82f6' }]}
              onPress={() => setShowAnswer1(!showAnswer1)}>
              <Text style={styles.showAnswerButtonText}>
                {showAnswer1 ? '👁️ Masquer la Réponse' : '👁️ Voir la Réponse'}
              </Text>
            </Pressable>
            {showAnswer1 && (
              <View style={styles.answerSection}>
                <ThemedText style={styles.label}>Réponse:</ThemedText>
                <ThemedText style={styles.answerText}>{firstQuestionType.A}</ThemedText>
              </View>
            )}
          </ThemedView>
        )}

        {/* QSER Question */}
        <ThemedView style={styles.questionCard}>
          <ThemedText type="subtitle" style={styles.questionType}>
            QSER - Questions de Sécurité Routière
          </ThemedText>
          <View style={styles.questionSection}>
            <ThemedText style={styles.label}>Question:</ThemedText>
            <ThemedText style={styles.questionText}>{questions.QSER.Q}</ThemedText>
          </View>
          <Pressable
            style={[styles.showAnswerButton, { backgroundColor: '#3b82f6' }]}
            onPress={() => setShowAnswer2(!showAnswer2)}>
            <Text style={styles.showAnswerButtonText}>
              {showAnswer2 ? '👁️ Masquer la Réponse' : '👁️ Voir la Réponse'}
            </Text>
          </Pressable>
          {showAnswer2 && (
            <View style={styles.answerSection}>
              <ThemedText style={styles.label}>Réponse:</ThemedText>
              <ThemedText style={styles.answerText}>{questions.QSER.A}</ThemedText>
            </View>
          )}
        </ThemedView>

        {/* First Aid Question */}
        <ThemedView style={styles.questionCard}>
          <ThemedText type="subtitle" style={styles.questionType}>
            1ers Secours - Premiers Secours
          </ThemedText>
          <View style={styles.questionSection}>
            <ThemedText style={styles.label}>Question:</ThemedText>
            <ThemedText style={styles.questionText}>{questions['1ers secours'].Q}</ThemedText>
          </View>
          <Pressable
            style={[styles.showAnswerButton, { backgroundColor: '#3b82f6' }]}
            onPress={() => setShowAnswer3(!showAnswer3)}>
            <Text style={styles.showAnswerButtonText}>
              {showAnswer3 ? '👁️ Masquer la Réponse' : '👁️ Voir la Réponse'}
            </Text>
          </Pressable>
          {showAnswer3 && (
            <View style={styles.answerSection}>
              <ThemedText style={styles.label}>Réponse:</ThemedText>
              <ThemedText style={styles.answerText}>{questions['1ers secours'].A}</ThemedText>
            </View>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  questionCard: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionType: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#3b82f6',
  },
  questionSection: {
    gap: 8,
  },
  answerSection: {
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
    textTransform: 'uppercase',
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  answerText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  showAnswerButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  showAnswerButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
