
import { Stack } from 'expo-router'

const Layout = () => {
  return (
    <>
    <Stack screenOptions={{headerShown : false}}>
    <Stack.Screen name='explore'/>
    </Stack>
    </>
  )
}

export default Layout
