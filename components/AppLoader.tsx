import { View, ActivityIndicator,Dimensions } from 'react-native'
import React from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'

const AppLoader = () => {
  const {isAppLoading} = useGlobalContext()
  if(!isAppLoading){
    return null
  }

  return (
    <View className='flex absolute justify-center items-center w-full h-full bg-primary/60 z-[1000]'>
        <ActivityIndicator
        style={{height: Dimensions.get("screen").height}}
            animating={isAppLoading}
            color={"white"}
            size={42}
        />
    </View>
  )
}

export default AppLoader