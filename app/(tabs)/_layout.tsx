import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

/**
 * Tab layout for the app
 */

export default function TabLayout() {
  const iconColor = '#687076';
  const selectedIconColor = '#465CD4'; // Using the same blue as the Boxs card for consistency

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name="home" 
              size={24} 
              color={focused ? selectedIconColor : iconColor} 
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name="calendar-outline" 
              size={24} 
              color={focused ? selectedIconColor : iconColor} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title: 'Files',
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name="folder-outline" 
              size={24} 
              color={focused ? selectedIconColor : iconColor} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name="heart-outline" 
              size={24} 
              color={focused ? selectedIconColor : iconColor} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name="person-outline" 
              size={24} 
              color={focused ? selectedIconColor : iconColor} 
            />
          ),
        }}
      /> */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#F2F2F2',
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: 0,
  },
});