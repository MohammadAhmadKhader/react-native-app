import { View, Text } from 'react-native'
import React from 'react'

type Props = {
    title: string,
    titleStyles?: string,
    subTitle?: string,
    containerStyles?: string,
}


const InfoBox = ({ title, containerStyles, subTitle, titleStyles }: Props) => {
    return (
        <View className={containerStyles}>
            <Text className={`text-white text-center font-psemibold ${titleStyles}`}>
                {title}
            </Text>
            {subTitle && <Text className='text-sm text-gray-100 text-center'>
                {subTitle}
            </Text>}
        </View>
    )
}

export default InfoBox