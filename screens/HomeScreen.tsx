import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

function HomeScreen({ navigation }: any) {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [greeting, setGreeting] = useState('Good morning!');

  const theme = {
    dark: {
      background: '#151b22',
      cardBackground: '#2a2a2a',
      text: '#ffffff',
      textSecondary: '#cccccc',
      accent: '#4a9eff',
      border: '#3a3a3a',
      searchBackground: '#333333',
    },
    light: {
      background: '#f8f9fa',
      cardBackground: '#ffffff',
      text: '#1a1a1a',
      textSecondary: '#666666',
      accent: '#007bff',
      border: '#e9ecef',
      searchBackground: '#ffffff',
    },
  };

  const currentTheme = isDarkTheme ? theme.dark : theme.light;

  const fishingSpots = [
    {
      id: 1,
      name: 'Tabigai Gap',
      distance: '1.25 km',
      fishScore: 97,
      status: 'Hot',
    },
    {
      id: 2,
      name: 'Cruwee Cove',
      distance: '2.5 km',
      fishScore: 76,
      status: 'Good',
    },
    {
      id: 3,
      name: 'Marina Bay',
      distance: '3.2 km',
      fishScore: 84,
      status: 'Good',
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Scan Fish',
      icon: '📸',
      description: 'Identify your catch',
    },
    {
      id: 2,
      title: 'Log Catch',
      icon: '📝',
      description: 'Record your fishing',
    },
    {
      id: 3,
      title: 'Fish Guide',
      icon: '🐟',
      description: 'Browse fish database',
    },
    { id: 4, title: 'Weather', icon: '🌊', description: 'Check conditions' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good morning!';
    } else if (hour < 17) {
      return 'Good afternoon!';
    } else {
      return 'Good evening!';
    }
  };

  useEffect(() => {
    setGreeting(getGreeting());

    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleSearchPress = () => {
    navigation.navigate('Map');
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={currentTheme.background}
      />

      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: currentTheme.text }]}>
            {greeting}
          </Text>
          <Text
            style={[styles.subtitle, { color: currentTheme.textSecondary }]}
          >
            Ready for your next catch?
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.themeToggle,
            { backgroundColor: currentTheme.cardBackground },
          ]}
          onPress={() => setIsDarkTheme(!isDarkTheme)}
        >
          <Text style={styles.themeIcon}>{isDarkTheme ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.searchContainer,
          {
            backgroundColor: currentTheme.searchBackground,
            borderColor: currentTheme.border,
          },
        ]}
        onPress={handleSearchPress}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <Text
          style={[
            styles.searchPlaceholder,
            { color: currentTheme.textSecondary },
          ]}
        >
          Search fishing spots...
        </Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.actionCard,
                  {
                    backgroundColor: currentTheme.cardBackground,
                    borderColor: currentTheme.border,
                  },
                ]}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text
                  style={[styles.actionTitle, { color: currentTheme.text }]}
                >
                  {action.title}
                </Text>
                <Text
                  style={[
                    styles.actionDescription,
                    { color: currentTheme.textSecondary },
                  ]}
                >
                  {action.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Fishing Spots */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
              Spots near you
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: currentTheme.accent }]}>
                See all
              </Text>
            </TouchableOpacity>
          </View>

          {fishingSpots.map((spot) => (
            <TouchableOpacity
              key={spot.id}
              style={[
                styles.spotCard,
                {
                  backgroundColor: currentTheme.cardBackground,
                  borderColor: currentTheme.border,
                },
              ]}
            >
              <View style={styles.spotInfo}>
                <Text style={[styles.spotName, { color: currentTheme.text }]}>
                  {spot.name}
                </Text>
                <Text
                  style={[
                    styles.spotDistance,
                    { color: currentTheme.textSecondary },
                  ]}
                >
                  {spot.distance}
                </Text>
              </View>
              <View style={styles.spotStats}>
                <View
                  style={[
                    styles.fishScore,
                    {
                      backgroundColor:
                        spot.fishScore > 90 ? '#ff6b35' : '#4a9eff',
                    },
                  ]}
                >
                  <Text style={styles.scoreText}>{spot.fishScore}</Text>
                </View>
                <Text
                  style={[
                    styles.spotStatus,
                    { color: currentTheme.textSecondary },
                  ]}
                >
                  Fish Score
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
            Recent Activity
          </Text>
          <View
            style={[
              styles.activityCard,
              {
                backgroundColor: currentTheme.cardBackground,
                borderColor: currentTheme.border,
              },
            ]}
          >
            <Text style={styles.activityIcon}>🎣</Text>
            <View style={styles.activityContent}>
              <Text
                style={[styles.activityTitle, { color: currentTheme.text }]}
              >
                Last catch: Largemouth Bass
              </Text>
              <Text
                style={[
                  styles.activityTime,
                  { color: currentTheme.textSecondary },
                ]}
              >
                2 days ago • Marina Bay
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.viewButton, { borderColor: currentTheme.accent }]}
            >
              <Text
                style={[styles.viewButtonText, { color: currentTheme.accent }]}
              >
                View
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 25,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeIcon: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionCard: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  spotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  spotInfo: {
    flex: 1,
  },
  spotName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  spotDistance: {
    fontSize: 14,
  },
  spotStats: {
    alignItems: 'center',
  },
  fishScore: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  scoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spotStatus: {
    fontSize: 12,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
    minHeight: 80,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
  },
  viewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;
