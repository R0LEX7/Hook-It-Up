
import { Stack } from 'expo-router'

const Layout = () => {
  return (
    <>
    <Stack screenOptions={{headerShown : false}}>
    <Stack.Screen name='Profile'/>
    </Stack>
    </>
  )
}

export default Layout
