import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

// Example crime types - match with your API's categories
const CRIME_TYPES = ['Theft', 'Assault', 'Burglary'];

type CrimeIncident = {
  id: string;
  type: string;
  description: string;
  date: string; // ISO date string
  location: { lat: number; lng: number };
};

export default function TabTwoScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<CrimeIncident[]>([]);
  const [filters, setFilters] = useState<Record<string, boolean>>({
    Theft: true,
    Assault: true,
    Burglary: true,
  });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch crime data function (replace URL with real API)
  async function fetchCrimeData() {
    try {
      setLoading(true);
      setError(null);

      // Example dummy fetch - replace with real API call
      // const res = await fetch('https://api.yourcrimeprovider.com/incidents');
      // const data = await res.json();

      // Simulated dummy data for demo:
      const data: CrimeIncident[] = [
        {
          id: '1',
          type: 'Theft',
          description: 'Stolen bicycle reported',
          date: new Date().toISOString(),
          location: { lat: 30.2672, lng: -97.7431 },
        },
        {
          id: '2',
          type: 'Assault',
          description: 'Assault reported near downtown',
          date: new Date().toISOString(),
          location: { lat: 30.2685, lng: -97.7420 },
        },
        {
          id: '3',
          type: 'Burglary',
          description: 'Residential burglary',
          date: new Date().toISOString(),
          location: { lat: 30.2650, lng: -97.7450 },
        },
      ];

      // Filter data by selected filters
      const filteredData = data.filter((inc) => filters[inc.type]);
      setIncidents(filteredData);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load crime data.');
    } finally {
      setLoading(false);
    }
  }

  // Auto-refresh every 5 minutes
  useEffect(() => {
    fetchCrimeData();
    const interval = setInterval(fetchCrimeData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [filters]);

  // Toggle filter on/off
  function toggleFilter(type: string) {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  }

  // Count incidents by type
  const incidentCounts = CRIME_TYPES.reduce<Record<string, number>>((acc, type) => {
    acc[type] = incidents.filter((i) => i.type === type).length;
    return acc;
  }, {});

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
  <Image
    source={require('@/assets/images/banner.png')}
    style={styles.headerImage}
    contentFit="contain"
  />
}

    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>

      {/* 🔵 Map Button Section */}
      <ThemedView style={styles.mapButtonContainer}>
  <ThemedText type="subtitle">Live Safety Features</ThemedText>
  <ThemedText>Use our real-time map to check for nearby incidents.</ThemedText>
  
  <Pressable onPress={() => router.push('/map')} style={styles.mapButton}>
    <Text style={styles.mapButtonText}>View Crime Map</Text>
  </Pressable>

  <Pressable onPress={() => router.push('/report')} style={[styles.mapButton, { backgroundColor: '#d9534f' }]}>
    <Text style={styles.mapButtonText}>Report a Crime</Text>
  </Pressable>
</ThemedView>


      {/* 🔵 Crime Filters Section */}
      <ThemedView style={styles.filterContainer}>
        <ThemedText type="subtitle">Filter by Crime Type:</ThemedText>
        <View style={styles.filterButtonsRow}>
          {CRIME_TYPES.map((type) => (
            <Pressable
              key={type}
              onPress={() => toggleFilter(type)}
              style={[
                styles.filterButton,
                { backgroundColor: filters[type] ? '#007aff' : '#ccc' },
              ]}
            >
              <Text style={[styles.filterButtonText, { color: filters[type] ? '#fff' : '#000' }]}>
                {type} ({incidentCounts[type] || 0})
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable onPress={fetchCrimeData} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Refresh Data</Text>
        </Pressable>
        {loading && <ActivityIndicator size="small" color="#007aff" />}
        {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
        {lastUpdated && (
          <ThemedText style={styles.lastUpdatedText}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </ThemedText>
        )}
      </ThemedView>

      {/* 🔵 Recent Incidents List */}
      <ThemedView style={styles.incidentsContainer}>
        <ThemedText type="subtitle">Recent Incidents ({incidents.length})</ThemedText>
        {incidents.length === 0 && !loading && (
          <ThemedText>No incidents to display with current filters.</ThemedText>
        )}
        {incidents.map((incident) => (
          <ThemedView key={incident.id} style={styles.incidentItem}>
            <ThemedText type="defaultSemiBold">{incident.type}</ThemedText>
            <ThemedText>{incident.description}</ThemedText>
            <ThemedText style={styles.incidentDate}>
              {new Date(incident.date).toLocaleString()}
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
  width: 150,
  height: 150,
  alignSelf: 'center',
  marginBottom: 10,
  marginTop: 70,
  marginLeft: 10,
},

  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  mapButtonContainer: {
    marginVertical: 20,
    alignItems: 'center',
    gap: 10,
  },
  mapButton: {
    backgroundColor: '#007aff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 6,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  filterContainer: {
    marginVertical: 20,
    paddingHorizontal: 12,
  },
  filterButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  filterButtonText: {
    fontWeight: '600',
  },
  refreshButton: {
    marginTop: 8,
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
  },
  lastUpdatedText: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#666',
  },
  incidentsContainer: {
    marginVertical: 20,
    paddingHorizontal: 12,
  },
  incidentItem: {
    marginBottom: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  incidentDate: {
    fontSize: 12,
    color: '#888',
  },
});
