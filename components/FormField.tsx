import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from '@/constants'

type Props = {
    title: string,
    value: string,
    handleChange: (e: string) => void,
    placeholder: string,
    keyboardType?: string,
    otherStyles?: string,
}

const FormField = ({ title, value, handleChange, otherStyles, placeholder }: Props) => {
    const [showPassword, setShowPassword] = useState<boolean>(true)

    return (
        <View className={`w-full space-y-2 ${otherStyles}`}>
            <Text className={`text-base text-gray-100 font-pmedium`}>{title}</Text>

            <View className={`border-2 border-black-200 w-full h-16 px-4 bg-black-100 items-center rounded-2xl focus:border-secondary flex-row`}>
                <TextInput
                    className={`w-full flex-1 text-white font-psemibold`}
                    value={value}
                    placeholder={placeholder}
                    onChangeText={handleChange}
                    placeholderTextColor={"#7b7b8b"}
                    secureTextEntry={title === "Password" && showPassword === true ? true : false}
                />

                {title === "Password" && (
                    <TouchableOpacity onPress={()=> setShowPassword(!showPassword)}>
                        <Image
                        className='w-6 h-6'
                        resizeMode='contain'
                        source={!showPassword ? icons.eye : icons.eyeHide}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

export default FormField