import React, { useEffect, useRef } from 'react';
import { View, Platform } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { granted: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (!existingStatus) {
      const { granted } = await Notifications.requestPermissionsAsync();
      finalStatus = granted;
    }
    if (!finalStatus) {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    // Send the token to your backend
    await fetch('http://your-backend-url.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const WebViewWithNotifications = () => {
  const webviewRef = useRef(null);

  useEffect(() => {
    registerForPushNotificationsAsync();

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });

    return () => subscription.remove();
  }, []);

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    const message = event.nativeEvent.data;
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Alert",
        body: message,
      },
      trigger: null,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://your-website-url.com' }}
        onMessage={handleWebViewMessage}
      />
    </View>
  );
};

export default WebViewWithNotifications;