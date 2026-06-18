import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { colors, fontSizes, fonts } from '../theme';
import axios from 'axios';
import { OPENAI_API_KEY } from '../openaiConfig';

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '0',
      sender: 'ai',
      text: '👋 Hey! I’m your FocusLink Coach. What habit or feeling would you like to explore today?',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
    };

    setMessages((prev) => [userMessage, ...prev]);
    setInput('');
    setLoading(true);

    try {
      const reply = await getAIResponse(input);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
      };
      setMessages((prev) => [aiMessage, ...prev]);
    } catch (error) {
      console.error('AI error:', error);
      const errorMessage = {
        id: Date.now().toString() + '_error',
        sender: 'ai',
        text: '⚠️ Sorry, something went wrong. Please try again.',
      };
      setMessages((prev) => [errorMessage, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const getAIResponse = async (userInput) => {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful, motivational habit coach named FocusLink who responds in short, kind, ADHD-friendly tips and encouragement.',
          },
          {
            role: 'user',
            content: userInput,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <FlatList
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === 'ai' ? styles.aiBubble : styles.userBubble,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      {loading && (
        <ActivityIndicator size="small" color={colors.primary} style={{ marginBottom: 10 }} />
      )}

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Ask your coach..."
          value={input}
          onChangeText={setInput}
          placeholderTextColor={colors.gray}
        />
        <Button title="Send" onPress={sendMessage} color={colors.primary} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chatContainer: {
    padding: 20,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    maxWidth: '75%',
  },
  aiBubble: {
    backgroundColor: '#e1f0ff',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#d1f7e1',
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopColor: colors.light,
    borderTopWidth: 1,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.medium,
    fontFamily: fonts.regular,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.light,
  },
});
