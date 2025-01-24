import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WebScreen2() {
  const router = useRouter();

  return (
    <View style={styles.container}>
   
   <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
      {/* This is where we put the url to the backend website, essentially acts as a hyperlink */}
      <WebView source={{ uri: 'https://www.google.com/search?q=disaster&rlz=1C5CHFA_enIN1002IN1003&oq=disaster&gs_lcrp=EgZjaHJvbWUyEQgAEEUYORhDGLEDGIAEGIoFMgYIARAjGCcyDAgCEAAYQxiABBiKBTIMCAMQABhDGIAEGIoFMgwIBBAAGEMYgAQYigUyDAgFEAAYQxiABBiKBTIMCAYQABhDGIAEGIoFMgwIBxAAGEMYgAQYigUyDAgIEAAYQxiABBiKBTIMCAkQABhDGIAEGIoF0gEIMzMyNGowajeoAgCwAgA&sourceid=chrome&ie=UTF-8' }} style={styles.webView} /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: { // Incorporated a back button to go back to app home screen (removed, here for optional use)
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    elevation: 5,
  },
 
  webView: {
    flex: 1,
    marginTop: 0, 
  },
});
