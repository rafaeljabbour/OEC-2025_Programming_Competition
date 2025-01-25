import React, { useState } from 'react';
import { Text, Dimensions, TextInput, TouchableOpacity, Alert, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '@/components/header'; 
import { Linking } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const { width } = Dimensions.get('window');

export default function loginscreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const router = useRouter();

  const handleLogin = () => { //user and password is the login
    //Login System
    if (username === 'user' && password === 'password') {
      Alert.alert('Login Successful', 'Welcome!');
      router.push('/home')
    } else {
      Alert.alert('Login Failed', 'Invalid username or password');
    }
  };

  return (
    <View style={styles.container}>
     

      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Enter your email"
          placeholderTextColor="#8391a1"
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          secureTextEntry={hidePassword}
          style={styles.inputText}
          placeholder="Enter your password"
          placeholderTextColor="#8391a1"
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'eye-off-outline' : 'eye-outline'} size={24} color="#6a707c" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Set background color to white
  },
  header: {
    marginTop: 100, // Add margin to push the header lower on the screen
  },
  backButtonContainer: {
    width: '100%',
    marginTop: 40, 
    marginLeft: 40, 
    marginBottom: 150, 
    paddingLeft: 0,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: 'black',
    marginLeft: 5,
  },
  welcomeText: {
    fontSize: 26,
    marginTop: 90, 
    marginBottom: 30,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#f7f8f9',
    borderRadius: 10,
    borderColor: '#e8ecf4',
    borderWidth: 1,
    height: 50,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  inputText: {
    flex: 1,
    height: 50,
    color: 'black',
    fontSize: 18,
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#ff4747',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold', // Make text bold
  },
});