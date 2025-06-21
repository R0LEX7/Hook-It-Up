import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { PRIMARY, SECONDARY } from '@/constants/myColor';
import { useColorScheme } from '@/hooks/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { Platform, Text } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();



  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="eyeo"
              size={26}
              color={focused ? PRIMARY : SECONDARY}
            />
          ),

          tabBarLabel: ({ focused }) => (
            <Text
              style={{ color: focused ? 'black' : SECONDARY, fontSize: 12 }}
            >
              Explore
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="hearto"
              size={24}
              color={focused ? PRIMARY : SECONDARY}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{ color: focused ? 'black' : SECONDARY, fontSize: 12 }}
            >
              Matches
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="chatbubble-outline"
              size={26}
              color={focused ? PRIMARY : SECONDARY}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{ color: focused ? 'black' : SECONDARY, fontSize: 12 }}
            >
              Chat
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="user"
              size={24}
              color={focused ? PRIMARY : SECONDARY}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{ color: focused ? 'black' : SECONDARY, fontSize: 12 }}
            >
              Profile
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
