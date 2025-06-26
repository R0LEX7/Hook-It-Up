
import { Stack } from 'expo-router'
import { StatusBar } from 'react-native'

const Layout = () => {
  return (
    <>
    <StatusBar  hidden></StatusBar>
    <Stack screenOptions={{headerShown : false}} >
    <Stack.Screen name='Profile'/>
    </Stack>
    </>
  )
}

export default Layout
