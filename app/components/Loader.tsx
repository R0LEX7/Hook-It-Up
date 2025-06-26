import { PRIMARY } from '@/constants/myColor'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'

const Loader = () => {
  return (
    <View className='w-full h-full justify-center items-center'>
      <ActivityIndicator  className='text-red-500' size={"large"} color={PRIMARY}/>
    </View>
  )
}

export default Loader
