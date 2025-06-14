import React, { useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([
    "Hello! Do you need help or would you like to report a crime?"
  ]);

  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (message.trim() === '') return;

    setMessages((prev) => [...prev, message.trim()]);
    setMessage('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingBottom: 20 }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 100} // raised offset
      >
        <Text style={styles.title}>Live Chat</Text>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.messagesContainer}
          style={styles.messagesList}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.messageBubble,
                index === 0 && styles.greetingBubble, // special style for first message
              ]}
            >
              <Text style={styles.messageText}>{item}</Text>
            </View>
          )}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Wrapper to add extra space */}
        <View style={{ paddingBottom: 50, backgroundColor: 'white' }}>
          <View style={[styles.inputContainer, { paddingBottom: 40 }]}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              blurOnSubmit={false}
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: 10,
  },
  messageBubble: {
    backgroundColor: '#e1ffc7',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  greetingBubble: {
    backgroundColor: '#c7e0ff', // light blue bubble for greeting
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderTopWidth: 1,
    paddingBottom: 20,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 25,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 25,
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: 44,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
