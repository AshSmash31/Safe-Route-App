import { ThemedView } from '@/components/ThemedView';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput } from 'react-native';

export default function ReportCrimeScreen() {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!type || !description) {
      Alert.alert('Please fill out all fields');
      return;
    }

    setSubmitting(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        setSubmitting(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      const report = {
        type,
        description,
        timestamp: new Date(),
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      };

      // Here you would send the report to your backend
      console.log('User crime report:', report);
      Alert.alert('Report submitted successfully!');

      // Optionally navigate back
      router.back();
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Report a Crime</Text>

      <TextInput
        style={styles.input}
        placeholder="Crime Type (e.g. Theft, Assault)"
        value={type}
        onChangeText={setType}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <Button title={submitting ? 'Submitting...' : 'Submit Report'} onPress={handleSubmit} disabled={submitting} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});
