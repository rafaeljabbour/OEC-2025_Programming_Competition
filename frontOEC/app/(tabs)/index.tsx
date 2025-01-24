import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the Icon component
import { WebView } from 'react-native-webview'; // Import WebView component
import Header from '@/components/header'; // Import the Header component
import { useRouter } from 'expo-router'; // Import useRouter from expo-router

export default function HomeScreen() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const router = useRouter(); // Initialize router

  const handleButtonPress = (url: string) => {
    setCurrentUrl(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      {currentUrl ? (
        <WebView source={{ uri: currentUrl }} style={styles.webview} />
      ) : (
        <>
          <Header /> {/* Add the Header component */}
          <View style={styles.contentContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.naturalDisastersButton}
                onPress={() => router.push('/WebViewWithNotifications')}
              >
                <Icon name="exclamation-triangle" size={30} color="#FFFFFF" />
                <Text style={styles.buttonText}>Natural Disasters</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.diseasesButton}
                onPress={() => router.push('/disease')}
              >
                <Icon name="medkit" size={30} color="#FFFFFF" />
                <Text style={styles.buttonText}>Diseases</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/loginscreen')}
            >
              <Icon name="sign-in" size={30} color="#FFFFFF" />
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Set background color to white
  },
  webview: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  naturalDisastersButton: {
    flexDirection: 'row', // Arrange icon and text in a row
    width: '90%',
    height: 100, // Set a specific height for the button
    borderRadius: 10,
    backgroundColor: '#ff4747',
    alignItems: 'center',
    justifyContent: 'center', // Center the text vertically
    marginVertical: 10,
  },
  diseasesButton: {
    flexDirection: 'row', // Arrange icon and text in a row
    width: '90%',
    height: 100, // Set a specific height for the button
    borderRadius: 10,
    backgroundColor: '#ff4747',
    alignItems: 'center',
    justifyContent: 'center', // Center the text vertically
    marginVertical: 20,
  },
  loginButton: {
    flexDirection: 'row', // Arrange icon and text in a row
    position: 'absolute',
    bottom: 20,
    width: '90%',
    height: 60, // Set a specific height for the button
    borderRadius: 30,
    backgroundColor: '#ff4747',
    alignItems: 'center',
    justifyContent: 'center', // Center the text vertically
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20, // Make text bigger
    fontWeight: 'bold', // Make text bold
    marginLeft: 10, // Add margin to separate text from icon
  },
});