# Fish AI 🐟

## Overview

Fish AI is a comprehensive mobile application designed for fishing enthusiasts. The app combines artificial intelligence, real-time data, and location services to enhance the fishing experience by providing intelligent fishing spot recommendations and comprehensive fishing analytics.

## Full Demo Video

[https://drive.google.com/file/d/1CE3wNf68UaMj4ryR2XFGEfPjiCWzS26v/view?usp=sharing](https://drive.google.com/file/d/1CE3wNf68UaMj4ryR2XFGEfPjiCWzS26v/view?usp=sharing)

## Working Demo

<img src="./demo.gif" alt="Fish AI Demo" height="500">

### Key Features

- **Smart Fishing Spots**: Discover the best fishing locations with AI-calculated Fish Scores
- **Real-time Map Integration**: Interactive maps with location-based fishing spots
- **Fish AI Coach**: AI assistant that provides fishing tips, techniques, and personalized advice
- **Dark Theme Support**: Optimized for both day and night fishing

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **Maps**: React Native Maps
- **Location Services**: Expo Location
- **Icons**: Expo Vector Icons
- **State Management**: React Hooks
- **Styling**: StyleSheet (React Native)

## Folder Structure

```
FishAI-Technical/
├── App.tsx                 # Main app entry point
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
├── assets/                # Static assets
│   ├── icon.png          # App icon
│   ├── splash-icon.png   # Splash screen image
│   ├── adaptive-icon.png # Android adaptive icon
│   └── favicon.png       # Web favicon
├── screens/               # Screen components
│   ├── HomeScreen.tsx    # Home dashboard
│   ├── MapScreen.tsx     # Interactive map with fishing spots
│   ├── ChatScreen.tsx    # AI fish Assistant
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
EXPO_PUBLIC_GEMINI_API_KEY="your_google_gemini_api_key"
```

## Local Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/FishAI-Technical.git
   cd FishAI-Technical
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Expo CLI globally** (if not already installed)

   ```bash
   npm install -g @expo/cli
   ```

4. **Set up environment variables**

   - Copy `.env.example` to `.env`
   - Fill in your API keys and configuration values

   ```bash
   cp .env.example .env
   ```

5. **Start the development server**

   ```bash
   npx expo start
   ```

6. **Run on device/simulator**
   - **iOS Simulator**: Press `i` in the terminal or scan QR code with Expo Go app
   - **Android Emulator**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Physical Device**: Install Expo Go app and scan the QR code

### Development Commands

```bash
# Start development server
npx expo start

# Start with cache cleared
npx expo start --clear

# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios

# Run on Android device/emulator
npx expo run:android

# Run on iOS device/simulator
npx expo run:ios

# Install dependencies
npm install
```

**Happy Fishing! 🎣**
