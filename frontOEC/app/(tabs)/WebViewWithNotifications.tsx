import React, { useEffect, useRef } from 'react';
import { View, Alert } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import * as Notifications from 'expo-notifications';

const WebViewWithNotifications = () => {
  const webviewRef = useRef<WebView>(null);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Failed to get push token for push notification!');
        return;
      }
    }
  };

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    const message = JSON.parse(event.nativeEvent.data);
    if (message.alert) {
      sendPushNotification(message.alert);
    }
  };

  const sendPushNotification = async (message: string) => {
    await Notifications.scheduleNotificationAsync({
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