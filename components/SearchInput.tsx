import { View, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { icons } from '@/constants'
import { router, usePathname } from 'expo-router'

type Props = {
    initialQuery?: string,
    placeholder?: string,
}

const SearchInput = ({ initialQuery = "", placeholder = "search"} : Props) => {
    const pathname = usePathname();
    const [query, setQuery] = useState(initialQuery)

    return (
        <View className={`border-2 border-black-200 w-full h-16 px-4 bg-black-100 items-center rounded-2xl
         focus:border-secondary flex-row space-x-4`}>
            <TextInput
                className={`text-base mt-0.5 text-white flex-1 font-pregular`}
                value={query}
                placeholder={placeholder}
                onChangeText={(e) => {
                    setQuery(e)
                }}
                placeholderTextColor={"#7b7b8b"}
            />

            <TouchableOpacity
                onPress={() => {
                    if(!query){
                        Alert.alert("Missing query","Please input something for searching results")
                    }
                    if(pathname.startsWith("/search")){
                        router.setParams({query})
                    } else {
                        router.push(`/search/${query}`)
                    }
                }}
            >
                <Image
                    source={icons.search}
                    className='w-5 h-5'
                    resizeMode='contain'
                />
            </TouchableOpacity>
        </View>
    )
}

export default SearchInput