import { View, Text, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native'
import React, { useState } from 'react'
import * as Animatable from "react-native-animatable"
import { type Video as TVideo } from '@/app/types/types'
import { icons } from '@/constants'
import { Video, ResizeMode, AVPlaybackStatusSuccess } from "expo-av"

type Props = {
    posts: TVideo[]
}

type TrendingItemProps = {
    activeItem: TVideo,
    item: TVideo
}
const zoomIn = {
    0: {
        scale: 0.85
    },
    1: {
        scale: 0.95
    }
} as any

const zoomOut = {
    0: {
        scale: 0.95
    },
    1: {
        scale: 0.85
    }
}
function TrendingItem({ activeItem, item }: TrendingItemProps) {
    const [playing, setPlaying] = useState<boolean>(false);

    return (
        <Animatable.View
            animation={activeItem.$id === item.$id ? zoomIn : zoomOut}
            duration={500}
        >
            {
                playing ?
                    <Video
                        source={{ uri: item.video }}
                        className='w-52 h-72 rounded-lg mt-3 bg-white/10'
                        resizeMode={ResizeMode.CONTAIN}
                        useNativeControls
                        shouldPlay
                        onPlaybackStatusUpdate={(status) => {
                            if ((status as AVPlaybackStatusSuccess).didJustFinish) {
                                setPlaying(false)
                            }
                        }}
                    /> : <TouchableOpacity
                        className='justify-center items-center'
                        activeOpacity={0.7}
                        onPress={() => setPlaying(true)}
                    >
                        <ImageBackground
                            source={{
                                uri: item.thumbnail,
                            }}
                            resizeMode='cover'
                            className='w-52 h-72 rounded-[35px] my-5 shadow-lg shadow-black/40 overflow-hidden'
                        />
                        <Image
                            className='absolute w-12 h-12'
                            source={icons.play}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
            }
        </Animatable.View>
    )
}

const Trending = ({ posts }: Props) => {
    const [activeItem, setActiveItem] = useState(posts[1])

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
                <TrendingItem activeItem={activeItem} item={item} />
            )}
            horizontal
            onViewableItemsChanged={({ viewableItems }) => {
                if (viewableItems.length > 0) {
                    setActiveItem(viewableItems[0].item)
                }
            }}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 70
            }}
            contentOffset={{ x: 170, y: 0 }}
        />
    )
}

export default Trending