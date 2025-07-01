import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  PanResponder,
  Animated,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

// some demo spots for the map
const spots = [
  {
    id: 1,
    title: 'Tabbigai Gap',
    score: 97,
    lat: -33.993,
    lng: 151.246,
    distance: '1.25 km',
  },
  {
    id: 2,
    title: 'Cruwee Cove',
    score: 76,
    lat: -33.995,
    lng: 151.251,
    distance: '225 m',
  },
  {
    id: 3,
    title: 'Mystery Bay',
    score: 41,
    lat: -33.99,
    lng: 151.248,
    distance: '2.0 km',
  },
  {
    id: 4,
    title: 'Lake Superior Point',
    score: 89,
    lat: 48.3794,
    lng: -89.2593,
    distance: '3.2 km',
  },
  {
    id: 5,
    title: 'Georgian Bay Marina',
    score: 72,
    lat: 45.3311,
    lng: -80.1005,
    distance: '1.8 km',
  },
  {
    id: 6,
    title: 'Pacific Rim Inlet',
    score: 94,
    lat: 49.0162,
    lng: -125.7781,
    distance: '4.5 km',
  },
  {
    id: 7,
    title: 'Lofoten Deep',
    score: 91,
    lat: 68.1102,
    lng: 13.6929,
    distance: '2.1 km',
  },
  {
    id: 8,
    title: 'Sagami Bay',
    score: 83,
    lat: 35.2467,
    lng: 139.4072,
    distance: '1.7 km',
  },
  {
    id: 9,
    title: 'Kenai Peninsula',
    score: 96,
    lat: 60.5544,
    lng: -151.2583,
    distance: '5.3 km',
  },
  {
    id: 10,
    title: 'Key Largo Reef',
    score: 78,
    lat: 25.0865,
    lng: -80.4465,
    distance: '2.9 km',
  },
  {
    id: 11,
    title: 'Patagonia Fjord',
    score: 85,
    lat: -45.8696,
    lng: -73.8103,
    distance: '6.1 km',
  },
  {
    id: 12,
    title: 'Bay of Islands',
    score: 88,
    lat: -35.25,
    lng: 174.0833,
    distance: '3.7 km',
  },
  {
    id: 13,
    title: 'Dingle Peninsula',
    score: 67,
    lat: 52.141,
    lng: -10.2681,
    distance: '2.4 km',
  },
  {
    id: 14,
    title: 'Westfjords Coast',
    score: 92,
    lat: 65.9578,
    lng: -24.0,
    distance: '4.8 km',
  },
  {
    id: 15,
    title: 'Cape Point Deep',
    score: 74,
    lat: -34.3569,
    lng: 18.4977,
    distance: '3.3 km',
  },
  {
    id: 16,
    title: "Cox's Bazar Shore",
    score: 82,
    lat: 21.4272,
    lng: 92.0058,
    distance: '1.9 km',
  },
  {
    id: 17,
    title: 'Sundarbans Delta',
    score: 75,
    lat: 22.4937,
    lng: 89.154,
    distance: '3.8 km',
  },
  {
    id: 18,
    title: 'Chittagong Harbor',
    score: 68,
    lat: 22.3384,
    lng: 91.8317,
    distance: '2.7 km',
  },
  {
    id: 19,
    title: 'Goa Backwaters',
    score: 79,
    lat: 15.2993,
    lng: 74.124,
    distance: '4.2 km',
  },
  {
    id: 20,
    title: 'Kerala Coastline',
    score: 86,
    lat: 10.8505,
    lng: 76.2711,
    distance: '5.1 km',
  },
  {
    id: 21,
    title: 'Mumbai Harbor',
    score: 64,
    lat: 18.922,
    lng: 72.8347,
    distance: '3.4 km',
  },
  {
    id: 22,
    title: 'Kolkata Port',
    score: 71,
    lat: 22.5726,
    lng: 88.3639,
    distance: '2.8 km',
  },
  {
    id: 23,
    title: 'Tamil Nadu Coast',
    score: 77,
    lat: 11.1271,
    lng: 78.6569,
    distance: '4.6 km',
  },
];

export default function MapScreen() {
  const [sheetState, setSheetState] = useState('normal');
  const [mapReady, setMapReady] = useState(false);
  const [userLocation, setUserLocation] = useState<null | {
    latitude: number;
    longitude: number;
  }>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [nearestSpots, setNearestSpots] = useState(spots.slice(0, 4));
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchFocused, setSearchFocused] = useState<null | {
    lat: number;
    lng: number;
  }>(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: -33.993,
    longitude: 151.246,
    latitudeDelta: 0.09,
    longitudeDelta: 0.09,
  });
  const sheetHeight = useRef(new Animated.Value(210)).current;
  const mapRef = useRef<any>(null);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findNearestSpots = (userLat: number, userLon: number) => {
    const spotsWithDistance = spots.map((spot) => ({
      ...spot,
      calculatedDistance: calculateDistance(
        userLat,
        userLon,
        spot.lat,
        spot.lng
      ),
      distance: `${calculateDistance(
        userLat,
        userLon,
        spot.lat,
        spot.lng
      ).toFixed(1)} km`,
    }));

    const nearest = spotsWithDistance
      .sort((a, b) => a.calculatedDistance - b.calculatedDistance)
      .slice(0, 4)
      .sort((a, b) => b.score - a.score);

    setNearestSpots(nearest);

    if (nearest.length > 0) {
      const topSpot = nearest[0];
      const newRegion = {
        latitude: topSpot.lat,
        longitude: topSpot.lng,
        latitudeDelta: 0.09,
        longitudeDelta: 0.09,
      };
      setInitialRegion(newRegion);

      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dy) > 10;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (sheetState === 'normal') {
        const newHeight = 210 - gestureState.dy;
        if (newHeight >= 50 && newHeight <= 280) {
          sheetHeight.setValue(newHeight);
        }
      } else if (sheetState === 'expanded') {
        const newHeight = 280 - gestureState.dy;
        if (newHeight >= 50 && newHeight <= 280) {
          sheetHeight.setValue(newHeight);
        }
      } else if (sheetState === 'hidden') {
        const newHeight = 50 - gestureState.dy;
        if (newHeight >= 50 && newHeight <= 280) {
          sheetHeight.setValue(newHeight);
        }
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > 30) {
        if (sheetState === 'expanded') {
          setSheetState('normal');
          Animated.spring(sheetHeight, {
            toValue: 210,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          }).start();
        } else if (sheetState === 'normal') {
          setSheetState('hidden');
          Animated.spring(sheetHeight, {
            toValue: 50,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          }).start();
        }
      } else if (gestureState.dy < -30) {
        if (sheetState === 'hidden') {
          setSheetState('normal');
          Animated.spring(sheetHeight, {
            toValue: 210,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          }).start();
        } else if (sheetState === 'normal') {
          setSheetState('expanded');
          Animated.spring(sheetHeight, {
            toValue: 280,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          }).start();
        }
      } else {
        const targetHeight =
          sheetState === 'hidden' ? 50 : sheetState === 'normal' ? 210 : 280;
        Animated.spring(sheetHeight, {
          toValue: targetHeight,
          useNativeDriver: false,
          tension: 100,
          friction: 8,
        }).start();
      }
    },
  });

  const toggleSheet = () => {
    if (sheetState === 'hidden') {
      setSheetState('normal');
      Animated.spring(sheetHeight, {
        toValue: 210,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
    } else if (sheetState === 'normal') {
      setSheetState('expanded');
      Animated.spring(sheetHeight, {
        toValue: 280,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      setSheetState('normal');
      Animated.spring(sheetHeight, {
        toValue: 210,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        getCurrentLocation();
      } else {
        Alert.alert(
          'Location Permission',
          'Location permission is needed to show your current position on the map.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Settings',
              onPress: () => Location.requestForegroundPermissionsAsync(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(newLocation);

      findNearestSpots(newLocation.latitude, newLocation.longitude);
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please try again.'
      );
    }
  };

  const handleLocationButtonPress = async () => {
    if (!locationPermission) {
      await requestLocationPermission();
      return;
    }

    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.09,
        },
        1000
      );
    } else {
      await getCurrentLocation();
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);

    if (text.length > 0) {
      const filteredSpots = spots.filter((spot) =>
        spot.title.toLowerCase().includes(text.toLowerCase())
      );
      setSearchSuggestions(filteredSpots.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSpot = (spot: any) => {
    setSearchQuery(spot.title);
    setShowSuggestions(false);

    setSearchFocused({ lat: spot.lat, lng: spot.lng });

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: spot.lat,
          longitude: spot.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        1000
      );
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.length > 0) {
      const mostSimilar = spots.find((spot) =>
        spot.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (mostSimilar) {
        selectSpot(mostSimilar);
      }
    }
    setShowSuggestions(false);
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (mapReady && mapRef.current) {
      setTimeout(() => {
        mapRef.current.animateToRegion(initialRegion, 100);
      }, 500);
    }
  }, [mapReady, initialRegion, userLocation]);

  useEffect(() => {
    if (userLocation) {
      findNearestSpots(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

  return (
    <View style={{ flex: 1, backgroundColor: '#10141a' }}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name='magnify' size={20} color='#aaa' />
          <TextInput
            style={styles.searchInput}
            placeholder='Search fishing spots...'
            placeholderTextColor='#aaa'
            value={searchQuery}
            onChangeText={handleSearch}
            onSubmitEditing={handleSearchSubmit}
            onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <MaterialCommunityIcons name='cog' size={24} color='#aaa' />
        </TouchableOpacity>
      </View>

      {showSuggestions && searchSuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <ScrollView
            style={styles.suggestionsList}
            keyboardShouldPersistTaps='handled'
          >
            {searchSuggestions.map((spot) => (
              <TouchableOpacity
                key={spot.id}
                style={styles.suggestionItem}
                onPress={() => selectSpot(spot)}
              >
                <MaterialCommunityIcons
                  name='map-marker'
                  size={16}
                  color='#aaa'
                />
                <Text style={styles.suggestionText}>{spot.title}</Text>
                <Text style={styles.suggestionScore}>{spot.score}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        customMapStyle={darkMapStyle}
        onMapReady={() => setMapReady(true)}
        onLayout={() => {
          if (mapRef.current) {
            mapRef.current.animateToRegion(initialRegion, 100);
          }
        }}
        showsUserLocation={locationPermission}
        showsMyLocationButton={false}
      >
        {spots.map((spot, index) => {
          let activeMarker = false;
          if (
            (spot.lat === nearestSpots[0].lat &&
              spot.lng === nearestSpots[0].lng) ||
            (searchFocused &&
              spot.lat === searchFocused.lat &&
              spot.lng === searchFocused.lng)
          ) {
            activeMarker = true;
          }
          return (
            <Marker
              key={spot.id}
              coordinate={{ latitude: spot.lat, longitude: spot.lng }}
              title={spot.title}
              description={'Fish Score: ' + spot.score}
            >
              <View
                style={[
                  styles.markerContainer,
                  activeMarker && styles.activeMarkerContainer,
                ]}
              >
                <MaterialCommunityIcons
                  name='fish'
                  size={12}
                  color={activeMarker ? '#000000' : '#fff'}
                />
                <Text
                  style={[
                    styles.markerScore,
                    activeMarker && { color: '#000000' },
                  ]}
                >
                  {spot.score}
                </Text>
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            userLocation && styles.activeControlButton,
          ]}
          onPress={handleLocationButtonPress}
        >
          <MaterialCommunityIcons
            name='crosshairs-gps'
            size={20}
            color={userLocation ? '#fffb00' : '#aaa'}
          />
        </TouchableOpacity>
      </View>

      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.bottomSheet, { height: sheetHeight }]}
      >
        <TouchableOpacity style={styles.sheetHandle} onPress={toggleSheet}>
          <View style={styles.handle} />
        </TouchableOpacity>

        {sheetState !== 'hidden' && (
          <>
            <Text style={styles.sheetTitle}>Spots near you</Text>

            <ScrollView
              style={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              scrollEnabled={sheetState === 'expanded'}
            >
              {nearestSpots.map((spot, idx) => (
                <View key={spot.id} style={styles.spotRow}>
                  <View style={styles.spotInfo}>
                    <Text style={styles.spotTitle}>{spot.title}</Text>
                    <Text style={styles.spotDistance}>{spot.distance}</Text>
                  </View>
                  <View style={styles.spotRating}>
                    <View
                      style={{
                        flexDirection: 'column',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {idx === 0 && (
                          <MaterialCommunityIcons
                            name={idx === 0 ? 'crown' : 'star'}
                            size={16}
                            color={idx === 0 ? '#FFD700' : '#fffb00'}
                          />
                        )}
                        <Text style={styles.spotScore}>{spot.score}</Text>
                      </View>
                      <Text style={styles.scoreLabel}>Fish Score</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { width: Dimensions.get('window').width, height: '100%' },
  searchContainer: {
    position: 'absolute',
    top: 30,
    left: 20,
    right: 20,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151b22',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#fff',
    paddingVertical: 10,
  },
  settingsButton: {
    backgroundColor: '#151b22',
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    height: 54,
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerWrapper: {
    alignItems: 'center',
  },
  markerContainer: {
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'visible',
  },
  activeMarkerContainer: {
    backgroundColor: '#fffb00',
    transform: [{ scale: 1.1 }],
    borderColor: '#000000',
  },
  markerScore: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
    marginLeft: 2,
  },
  mapControls: {
    position: 'absolute',
    right: 20,
    bottom: '40%',
    zIndex: 1,
  },
  controlButton: {
    backgroundColor: '#151b22',
    borderRadius: 25,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  activeControlButton: {
    backgroundColor: '#1a2130',
    shadowColor: '#fffb00',
    shadowOpacity: 0.4,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#151b22',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sheetHandle: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#555',
    borderRadius: 2,
  },
  sheetTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  spotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#232c3a',
  },
  spotInfo: {
    flex: 1,
  },
  spotTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  spotDistance: {
    color: '#aaa',
    fontSize: 14,
  },
  spotRating: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  spotScore: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 4,
  },
  scoreLabel: {
    color: '#aaa',
    fontSize: 12,
    marginLeft: 4,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 90,
    left: 20,
    right: 20,
    zIndex: 2,
    backgroundColor: '#151b22',
    borderRadius: 12,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#232c3a',
  },
  suggestionText: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
  },
  suggestionScore: {
    color: '#fffb00',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#212b36' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212b36' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#b0c4de' }] },
  { featureType: 'water', stylers: [{ color: '#295a8f' }] },
];
