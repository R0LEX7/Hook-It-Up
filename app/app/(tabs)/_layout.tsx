import AuthGuard from '@/components/AuthGuard';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { SECONDARY } from '@/constants/myColor';
import { useColorScheme } from '@/hooks/useColorScheme';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,

          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            backgroundColor: 'white',
            position: Platform.OS === 'ios' ? 'absolute' : 'relative',

            borderTopRightRadius : 30,
            borderTopLeftRadius : 30,

            elevation: 5,
          },
        }}
      >
        {/* Home Tab */}
        <Tabs.Screen
          name="explore"
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'home' : 'home-outline'}
                size={focused ? 30 : 28}
                color={focused ? 'black' : SECONDARY}
              />
            ),
            tabBarLabel: () => null,
          }}
        />

        {/* Matches Tab */}
        <Tabs.Screen
          name="matches"
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'heart' : 'heart-outline'}
                size={focused ? 30 : 28}
                color={focused ? 'black' : SECONDARY}
              />
            ),
            tabBarLabel: () => null,
          }}
        />

        {/* Chat Tab */}
        <Tabs.Screen
          name="chat"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? 'chatbubble' : 'chatbubble-outline'}
                size={focused ? 30 : 28}
                color={focused ? 'black' : SECONDARY}
              />
            ),
            tabBarLabel: () => null,
          }}
        />

        {/* Profile Tab */}
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <FontAwesome
                name={focused ? 'user' : 'user-o'}
                size={focused ? 30 : 28}
                color={focused ? 'black' : SECONDARY}
              />
            ),
            tabBarLabel: () => null,
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
