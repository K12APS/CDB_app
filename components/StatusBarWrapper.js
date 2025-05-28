// app/components/StatusBarWrapper.js
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

const StatusBarWrapper = ({ children }) => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      {children}
    </View>
  );
};

export default StatusBarWrapper;
