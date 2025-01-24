import { StyleSheet, Text, View } from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Disaster and Disease</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 80,
    backgroundColor: '#ff4747', // Set background color to #ff4747
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20, // Add padding to the top
    shadowColor: '#000', // Add shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Add elevation for Android shadow
  },
  headerText: {
    color: '#FFFFFF', // Set text color to white
    fontSize: 24, // Increase font size
    fontWeight: 'bold',
    letterSpacing: 1, // Add letter spacing
  },
});