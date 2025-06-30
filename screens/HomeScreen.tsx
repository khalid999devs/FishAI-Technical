import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ color: '#fff' }}>Welcome to the Home Screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '# 111',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
