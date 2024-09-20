import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

type Props = {
    title: string,
    handlePress?: () => void,
    containerStyles?: string,
    textStyles?: string,
    isLoading?: boolean
}

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }: Props) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            disabled={isLoading}
            className={`bg-secondary w-full rounded-xl items-center justify-center min-h-[62px] 
            ${containerStyles}
            ${isLoading ? "opacity-50" :""}
        `}>
            <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>{title}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton