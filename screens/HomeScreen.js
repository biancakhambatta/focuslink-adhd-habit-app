import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  Pressable,
  Modal,
} from 'react-native';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { colors, fontSizes, fonts } from '../theme';
import axios from 'axios';
import { OPENAI_API_KEY } from '../openaiConfig';
import useEncouragements from '../hooks/useEncouragements';

export default function HomeScreen({ navigation }) {
  const [habit, setHabit] = useState('');
  const [linkedTo, setLinkedTo] = useState('');
  const [habits, setHabits] = useState([]);
  const [showMoodBar, setShowMoodBar] = useState(true);
  const [completionCount, setCompletionCount] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [bigOne, setBigOne] = useState('');

  useEncouragements();

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const promptTemplates = {
    sad: "Suggest a comforting micro-habit for someone feeling down. Make it ADHD-friendly and joyful.",
    meh: "Suggest a light and playful micro-habit for someone feeling unmotivated.",
    okay: "Suggest a helpful, positive micro-habit to gently boost someone's day.",
    energized: "Suggest a bold or expressive micro-habit for someone feeling energized.",
  };

  const suggestHabitByMood = async (mood) => {
    const prompt = promptTemplates[mood] || promptTemplates.okay;

    try {
      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a friendly, creative ADHD-aware habit coach. Keep responses under 12 words.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 50,
          temperature: 0.95,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const suggestion = res.data.choices[0].message.content.trim();

      Alert.alert(
        'Suggested Habit',
        suggestion,
        [
          { text: 'Add to My List', onPress: () => addHabit(suggestion) },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: true }
      );
    } catch (err) {
      console.error('OpenAI error:', err);
      Alert.alert('AI Coach Error', 'Please check your API key or internet connection.');
    }
  };

  const confirmDeleteHabit = (habitId, habitName) => {
    Alert.alert(
      'Delete Habit?',
      `Are you sure you want to delete "${habitName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteHabit(habitId),
        },
      ]
    );
  };
const addHabit = async (customHabit = null) => {
    const name = customHabit || habit;
    if (name.trim() === '') return;

    const newHabit = {
      name,
      linkedTo,
      completed: false,
      streak: 0,
      lastCompleted: '',
      completionHistory: [],
      createdAt: new Date(),
    };

    const tempId = Date.now().toString();
    setHabits((prev) => [{ id: tempId, ...newHabit }, ...prev]);
    setHabit('');
    setLinkedTo('');

    try {
      const docRef = await addDoc(collection(db, 'habits'), newHabit);
      setHabits((prev) =>
        prev.map((h) => (h.id === tempId ? { ...h, id: docRef.id } : h))
      );
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const toggleCompletion = (habitId) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;

        const today = getTodayDate();
        const newCompleted = !h.completed;
        let newHistory = [...(h.completionHistory || [])];

        if (newCompleted && !newHistory.includes(today)) {
          newHistory.push(today);
          setCompletionCount((count) => {
            const updated = count + 1;
            if (updated === 3) {
              setShowReward(true);
              setTimeout(() => setShowReward(false), 2500);
            }
            return updated;
          });
        } else if (!newCompleted) {
          newHistory = newHistory.filter((d) => d !== today);
          setCompletionCount((count) => Math.max(0, count - 1));
        }

        const habitRef = doc(db, 'habits', habitId);
        updateDoc(habitRef, {
          completed: newCompleted,
          lastCompleted: newCompleted ? today : '',
          completionHistory: newHistory,
        }).catch((err) => console.error('Toggle failed:', err));

        return {
          ...h,
          completed: newCompleted,
          lastCompleted: newCompleted ? today : '',
          completionHistory: newHistory,
        };
      })
    );
  };

  const deleteHabit = async (habitId) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    try {
      await deleteDoc(doc(db, 'habits', habitId));
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const loadHabits = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'habits'));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHabits(data.reverse());
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>☀️ Daily Focus Habits</Text>

      {showMoodBar ? (
        <View style={styles.moodBar}>
          <View style={styles.moodHeader}>
            <Text style={styles.moodTitle}>How are you feeling? 🧠</Text>
            <Pressable onPress={() => setShowMoodBar(false)}>
              <Text style={styles.close}>✖️</Text>
            </Pressable>
          </View>
          <View style={styles.emojiRow}>
            <Pressable onPress={() => suggestHabitByMood('sad')}>
              <Text style={styles.emoji}>😔</Text>
            </Pressable>
            <Pressable onPress={() => suggestHabitByMood('meh')}>
              <Text style={styles.emoji}>😐</Text>
            </Pressable>
            <Pressable onPress={() => suggestHabitByMood('okay')}>
              <Text style={styles.emoji}>🙂</Text>
            </Pressable>
            <Pressable onPress={() => suggestHabitByMood('energized')}>
              <Text style={styles.emoji}>😄</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable onPress={() => setShowMoodBar(true)} style={styles.showMoodButton}>
          <Text style={styles.showMoodText}>+ Show Mood Suggestions</Text>
        </Pressable>
      )}

      <TextInput
        style={styles.input}
        placeholder="Add a habit"
        value={habit}
        onChangeText={setHabit}
        placeholderTextColor={colors.gray}
      />
      <TextInput
        style={styles.input}
        placeholder="(Optional) Link to another habit"
        value={linkedTo}
        onChangeText={setLinkedTo}
        placeholderTextColor={colors.gray}
      />
      <View style={styles.buttonRow}>
        <Button title="Add Habit" onPress={() => addHabit()} color={colors.primary} />
      </View>

      <View style={styles.chatLinkContainer}>
        <Pressable onPress={() => navigation.navigate('Chat')}>
          <Text style={styles.chatLink}>💬 Open AI Coach Chat</Text>
        </Pressable>
      </View>
      <View style={styles.bigOneBox}>
  <Text style={styles.bigOneTitle}>🔥 The Big One</Text>
  <TextInput
    placeholder="What's your one big thing today?"
    value={bigOne}
    onChangeText={setBigOne}
    style={styles.bigOneInput}
    placeholderTextColor={colors.gray}
  />
    </View>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No habits yet — add one to get started 🌱</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => toggleCompletion(item.id)}
            onLongPress={() => confirmDeleteHabit(item.id, item.name)}
            style={styles.habitCard}
          >
            <Text
              style={[
                styles.habitText,
                item.completed && styles.completedText,
              ]}
            >
              {item.completed ? '✅' : '🟦'} {item.name}
            </Text>
            {item.linkedTo ? (
              <Text style={styles.linkedText}>↪ linked to: {item.linkedTo}</Text>
            ) : null}
          </Pressable>
        )}
      />

      <Modal visible={showReward} transparent animationType="fade">
        <View style={styles.rewardContainer}>
          <View style={styles.rewardBox}>
            <Text style={styles.rewardText}>🎉 You completed 3 habits! Great job! 🌟</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  title: {
    fontSize: fontSizes.xlarge,
    fontFamily: fonts.bold,
    marginBottom: 20,
    textAlign: 'center',
    color: colors.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.light,
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.white,
    fontSize: fontSizes.medium,
    fontFamily: fonts.regular,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  list: { marginTop: 20 },
  habitCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 6,
    borderLeftColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  habitText: {
    fontSize: fontSizes.medium,
    color: colors.text,
    fontFamily: fonts.regular,
  },
  completedText: {
    color: colors.gray,
    textDecorationLine: 'line-through',
  },
  linkedText: {
    fontSize: fontSizes.small,
    color: colors.gray,
    fontFamily: fonts.regular,
    marginTop: 4,
  },
  empty: {
    textAlign: 'center',
    color: colors.gray,
    fontStyle: 'italic',
    marginTop: 40,
  },
  moodBar: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderColor: colors.light,
    borderWidth: 1,
  },
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  moodTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.medium,
    color: colors.text,
  },
  close: {
    fontSize: 16,
    color: colors.gray,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  emoji: {
    fontSize: 28,
  },
  showMoodButton: {
    backgroundColor: colors.light,
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 10,
  },
  showMoodText: {
    color: colors.primary,
    fontFamily: fonts.bold,
    fontSize: fontSizes.medium,
  },
  chatLinkContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  chatLink: {
    color: colors.primary,
    fontFamily: fonts.bold,
    fontSize: fontSizes.medium,
    textDecorationLine: 'underline',
  },
  rewardContainer: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    maxWidth: '80%',
    elevation: 6,
  },
  rewardText: {
    fontSize: fontSizes.large,
    color: colors.primary,
    textAlign: 'center',
    fontFamily: fonts.bold,
  },
  bigOneBox: {
  backgroundColor: '#fff',
  padding: 12,
  marginBottom: 16,
  borderRadius: 12,
  borderColor: colors.light,
  borderWidth: 1,
},
bigOneTitle: {
  fontFamily: fonts.bold,
  fontSize: fontSizes.medium,
  marginBottom: 6,
  color: colors.primary,
},
bigOneInput: {
  fontSize: fontSizes.medium,
  fontFamily: fonts.regular,
  color: colors.text,
  backgroundColor: '#F9FAFB',
  padding: 10,
  borderRadius: 8,
},

});
