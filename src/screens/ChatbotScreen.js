import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GeminiService from '../services/geminiService';

export default function ChatbotScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Halo! Saya adalah chatbot AKSANUSA. Tanyakan apa saja tentang budaya Indonesia!',
      sender: 'bot',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: inputText,
        sender: 'user',
      };
      setMessages([...messages, userMessage]);
      const tempBotMessage = {
        id: messages.length + 2,
        text: '...',
        sender: 'bot',
        loading: true,
      };
      setMessages((prev) => [...prev, tempBotMessage]);
      const prompt = inputText;
      setInputText('');

      (async () => {
        try {
          const response = await GeminiService.sendMessage(prompt);
          setMessages((prev) =>
            prev.map((m) => (m.id === tempBotMessage.id ? { ...m, text: response, loading: false } : m))
          );
        } catch (e) {
          const fallback = 'Maaf, terjadi kesalahan saat menghubungi layanan AI.';
          setMessages((prev) =>
            prev.map((m) => (m.id === tempBotMessage.id ? { ...m, text: fallback, loading: false } : m))
          );
          console.warn('Gemini error:', e.message);
        }
      })();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chatbot AKSANUSA</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.sender === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.sender === 'user' ? styles.userMessage : styles.botMessage,
                ]}
              >
                {message.loading ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <ActivityIndicator size="small" color="#666" />
                    <Text style={styles.botMessageText}>Sedang mengetik...</Text>
                  </View>
                ) : (
                  <Text
                    style={[
                      styles.messageText,
                      message.sender === 'user' ? styles.userMessageText : styles.botMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ketik pertanyaan Anda..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxHeight={100}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={styles.sendButton}
            disabled={!inputText.trim()}
          >
            <LinearGradient
              colors={['#1a472a', '#2d6b42']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sendButtonGradient}
            >
              <Text style={styles.sendButtonText}>Kirim</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1a472a',
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D4AF37',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  keyboardAvoid: {
    flex: 1,
    flexDirection: 'column',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageWrapper: {
    marginVertical: 8,
    flexDirection: 'row',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  botMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: '#1a472a',
  },
  botMessage: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#ffffff',
  },
  botMessageText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  sendButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});
