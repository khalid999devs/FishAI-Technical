import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Markdown from 'react-native-markdown-display';

type Message = { sender: 'user' | 'bot'; text: string };

const initialMsgs: Message[] = [
  {
    sender: 'bot',
    text: "👋 Hey there! I'm Fish Coach. Here to provide expert advice on fishing techniques and fish behavior to help you improve your angling skills. 🎣",
  },
  {
    sender: 'bot',
    text: "Ask me anything about fishing, and I'll do my best to help!",
  },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMsgs);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<any>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    const userInput = input;
    setInput('');
    setLoading(true);

    try {
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const fishingPrompt = `You are Fish Coach, an expert fishing assistant with years of angling experience. 
      Answer this fishing question in a helpful, friendly way using relevant emojis throughout your response.
      Share specific tips, techniques, and advice that will help improve their fishing success.
      Include interesting fish facts or pro tips when relevant.
      Question: ${userInput}`;

      const res = await axios.post(
        endpoint,
        {
          contents: [
            {
              parts: [
                {
                  text: fishingPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const botText =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate a response.";
      setMessages((msgs) => [...msgs, { sender: 'bot', text: botText }]);
    } catch (error: any) {
      let errorMessage = "Sorry, I'm having trouble connecting right now. ";

      if (error.response) {
        if (error.response.status === 400) {
          errorMessage += 'Please check your question and try again.';
        } else if (error.response.status === 403) {
          errorMessage += 'API access denied. Please check API key.';
        } else {
          errorMessage += 'Please try again in a moment.';
        }
      } else if (error.request) {
        errorMessage += 'Please check your internet connection.';
      } else {
        errorMessage += 'Please try again.';
      }

      setMessages((msgs) => [...msgs, { sender: 'bot', text: errorMessage }]);
    } finally {
      setLoading(false);
    }
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name='fish' size={28} color='#43b0f1' />
        <Text style={styles.headerText}>Fish Coach</Text>
      </View>
      <ScrollView
        style={styles.chat}
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        ref={scrollRef}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((msg, i) => (
          <View
            key={i}
            style={[
              styles.messageRow,
              msg.sender === 'user' ? styles.userAlign : styles.botAlign,
            ]}
          >
            <View
              style={[
                styles.bubble,
                msg.sender === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              {msg.sender === 'bot' && (
                <MaterialCommunityIcons
                  name='fish'
                  size={16}
                  color='#43b0f1'
                  style={{ marginRight: 6, paddingTop: 3 }}
                />
              )}

              <Markdown
                style={{
                  body: {
                    color: '#fff',
                    fontSize: 17,
                    paddingRight: 4,
                    maxWidth: msg.sender === 'user' ? '100%' : '95%',
                    paddingTop: 0,
                    marginTop: -8,
                  },
                  paragraph: {
                    color: '#fff',
                    fontSize: 17,
                    marginBottom: 8,
                    marginTop: 8,
                    paddingRight: 4,
                    paddingTop: 0,
                  },
                  h1: { color: '#43b0f1', fontSize: 20, marginBottom: 8 },
                  strong: { color: '#43b0f1' },
                  em: { color: '#aaa' },
                  code_inline: {
                    backgroundColor: '#333',
                    color: '#fff',
                    padding: 2,
                  },
                  code_block: {
                    backgroundColor: '#333',
                    color: '#fff',
                    padding: 8,
                  },
                }}
              >
                {msg.text}
              </Markdown>
            </View>
          </View>
        ))}
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inputBar}
      >
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder='Ask the coach...'
          placeholderTextColor='#aaa'
          editable={!loading}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={loading || !input.trim()}
          style={[
            styles.sendBtn,
            (loading || !input.trim()) && styles.sendBtnDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator size='small' color='#fff' />
          ) : (
            <FontAwesome name='send' size={20} style={{ color: '#fff' }} />
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#10141a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151b22',
    padding: 14,
    paddingTop: 24,
    borderBottomWidth: 1,
    borderColor: '#222',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  chat: { flex: 1, gap: 10 },
  messageRow: { flexDirection: 'row', marginBottom: 8 },
  userAlign: { justifyContent: 'flex-end' },
  botAlign: { justifyContent: 'flex-start' },
  bubble: {
    borderRadius: 18,
    padding: 14,
    paddingLeft: 8,
    maxWidth: '90%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#192535',
    marginLeft: '20%',
    borderTopRightRadius: 4,
  },
  botBubble: { backgroundColor: '#232c3a', borderTopLeftRadius: 4 },
  msgText: { color: '#fff', fontSize: 17, paddingRight: 8 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151b22',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#222',
  },
  input: {
    flex: 1,
    color: '#fff',
    backgroundColor: '#232c3a',
    borderRadius: 18,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 8,
    height: 44,
  },
  sendBtn: {
    backgroundColor: '#43b0f1',
    borderRadius: 22,
    padding: 12,
  },
  sendBtnDisabled: {
    backgroundColor: '#43b0f180',
  },
});
