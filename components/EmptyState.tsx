import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '@/constants'
import CustomButton from './CustomButton'
import { router } from 'expo-router'

type Props = {
    title: string,
    subTitle: string,
    showButton?:boolean
}

const EmptyState = ({ title, subTitle, showButton = true }: Props) => {
    return (
        <View className='justify-center items-center px-3'>
            <Image
                source={images.empty}
                className='w-[250px] h-[210px]'
                resizeMode='contain'
            />

            <View className='mb-4'>
                <Text className='text-xl text-center font-pmedium text-white'>
                {title}
                </Text>
                <Text className='text-sm text-center font-psemimedium text-gray-100'>
                    {subTitle}
                </Text>
            </View>
            
            {showButton && (
                <CustomButton 
                title='Create video'
                handlePress={()=> router.push("/create")}
                />
            )}
            
        </View>
    )
}

export default EmptyState