import { Image, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { icons } from '@/constants'
import { AVPlaybackStatusSuccess, ResizeMode, Video } from 'expo-av'
import { Video as TVideo } from '@/app/types/types'
import VideoMenu from './VideoMenu'

type Props = {
  video: TVideo,
  refetch?: () => any
}

const VideoCard = ({ video: { $id, title, thumbnail, users: { avatar, username }, video }, refetch }: Props) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <View className='flex-col items-center px-4 mb-14'>
      <View className='flex-row gap-3 items-start'>
        <View className='justify-center items-center flex-row flex-1'>
          <View className='w-[46px] h-[46px] rounded-lg border border-secondary justify-center'>
            <Image
              source={{ uri: avatar }}
              className='w-full h-full rounded-lg'
              resizeMode="contain"
            />
          </View>
          <View className='justify-center flex-1 ml-3 gap-y-1'>
            <Text className='text-white' numberOfLines={1}>
              {title}
            </Text>
            <Text className='text-xs text-gray-100 font-pregular' numberOfLines={1}>
              {username ?? "user not found"}
            </Text>
          </View>
        </View>

        <View className='pt-2 mr-1'>
          <VideoMenu videoId={$id} refetch={refetch} />
        </View>
      </View>

      {isPlaying ?
        <Video
          source={{ uri: video }}
          className='w-full h-60 rounded-lg mt-3 bg-white/10'
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if ((status as AVPlaybackStatusSuccess).didJustFinish) {
              setIsPlaying(false)
            }
          }}
        /> :
        <TouchableOpacity
          onPress={() => setIsPlaying(true)}
          activeOpacity={0.7}
          className='w-full h-60 rounded-lg mt-3 justify-center items-center'>
          <Image
            source={{ uri: thumbnail }}
            className='w-full h-full rounded-xl mt-3'
            resizeMode='cover'
          />
          <Image
            className='w-12 h-12 absolute'
            resizeMode="contain"
            source={icons.play}
          />
        </TouchableOpacity>
      }
    </View>
  )
}

export default VideoCard