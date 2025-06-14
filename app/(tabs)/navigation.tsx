import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert, Linking, Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import MapView from 'react-native-maps';

export default function NavigationScreen() {
  const [startingPoint, setStartingPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [startCoords, setStartCoords] = useState<Location.LocationGeocodedLocation | null>(null);
  const [endCoords, setEndCoords] = useState<Location.LocationGeocodedLocation | null>(null);
  const router = useRouter();




  const handleFindRoute = async () => {
  if (!startingPoint || !destination) {
    Alert.alert('Missing Fields', 'Please enter both a starting point and destination.');
    return;
  }

  try {
    const startLocation = await Location.geocodeAsync(startingPoint);
    const endLocation = await Location.geocodeAsync(destination);

    if (startLocation.length === 0 || endLocation.length === 0) {
      Alert.alert('Location Error', 'Could not find one or both locations.');
      return;
    }

    const start = startLocation[0];
    const end = endLocation[0];

    setStartCoords(start);
    setEndCoords(end);

    const appleMapsUrl = `http://maps.apple.com/?saddr=${start.latitude},${start.longitude}&daddr=${end.latitude},${end.longitude}`;

const supported = await Linking.canOpenURL(appleMapsUrl);
if (supported) {
  await Linking.openURL(appleMapsUrl);
} else {
  Alert.alert('Error', 'Apple Maps cannot be opened on this device.');
}


    // You can later update MapView to display markers or draw a route
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Something went wrong with geocoding.');
  }
};


  const handleLiveChat = () => {
  router.push('/chatscreen');
};


  const handleToggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Navigation</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Starting Point"
        value={startingPoint}
        onChangeText={setStartingPoint}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Destination"
        value={destination}
        onChangeText={setDestination}
      />
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 30.2672,
            longitude: -97.7431,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.findRouteButton} onPress={handleFindRoute}>
          <Text style={styles.findRouteText}>Find Route</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleLiveChat}>
          <MaterialIcons name="chat" size={24} color="black" />
          <Text style={styles.iconText}>Live Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleToggleFilter}>
          <Ionicons name="filter" size={24} color="black" />
          <Text style={styles.iconText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reportContainer}>
        <TouchableOpacity style={styles.reportButton}>
          <Text style={styles.reportText}>Report Crime ⚠️</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal visible={isFilterVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Filter Options</Text>
            <Text>🚧 Avoid high-crime areas (coming soon)</Text>
            <Text>📍 Show nearby reports (coming soon)</Text>
            <TouchableOpacity
              onPress={() => setIsFilterVisible(false)}
              style={styles.closeFilterButton}
            >
              <Text style={{ color: 'white' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  mapContainer: {
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 10,
  },
  map: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  findRouteButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  findRouteText: {
    color: 'white',
    fontWeight: '600',
  },
  iconButton: {
    alignItems: 'center',
  },
  iconText: {
    fontSize: 12,
    marginTop: 4,
  },
  reportContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  reportButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  reportText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeFilterButton: {
    marginTop: 20,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 8,
  },
});
