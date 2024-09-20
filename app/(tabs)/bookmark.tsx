import { View, Text, FlatList, Image, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAppWrite from '@/lib/useAppWrite'
import { getAllLikedPostsByUser } from '@/lib/appWrite'
import { useGlobalContext } from '@/context/GlobalProvider'
import { UserLikedVideos } from '../types/types'
import VideoCard from '@/components/VideoCard'
import EmptyState from '@/components/EmptyState'
import SearchInput from '@/components/SearchInput'
import { useFocusEffect } from '@react-navigation/native'

const bookmark = () => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const { data, refetch, isLoading } = useAppWrite<UserLikedVideos>(() => getAllLikedPostsByUser())
  const [didMakeInitialFetch, setDidMakeInitialFetch] = useState<boolean>(false)
  useEffect(() => {
    setDidMakeInitialFetch(true)
  }, [])

  useFocusEffect(useCallback(() => {
    if (didMakeInitialFetch) {
      refetch()
        .catch((err: any) => Alert.alert("Error", err.message))
    }
  }, []))
  async function onRefresh() {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }
  return (
    <SafeAreaView className='bg-primary h-full pt-5'>
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.video.$id}
        renderItem={({ item }) => (
          <VideoCard video={item.video} refetch={onRefresh} />
        )}
        ListHeaderComponent={() => (
          <View className='my-6 px-4 space-y-6'>
            <View className='justify-between items-start mb-6 flex-row'>
              <Text className='font-pmedium text-2xl text-gray-100'>
                Saved Videos
              </Text>
            </View>

            <SearchInput placeholder='Search your saved videos' />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No videos found" subTitle="No videos were saved yet" showButton={false} />
        )}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  )
}

export default bookmark