import { View, Text, FlatList, Image, Alert } from 'react-native'
import React, {  useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '@/context/GlobalProvider'
import { images } from '@/constants'
import SearchInput from '@/components/SearchInput'
import Trending from '@/components/Trending'
import EmptyState from '@/components/EmptyState'
import { getAllPosts, getLatestPosts } from '@/lib/appWrite'
import useAppWrite from '@/lib/useAppWrite'
import { Video } from '../types/types'
import VideoCard from '@/components/VideoCard'

const Home = () => {
  const { data: allPosts, isLoading: areAllPostsLoading, refetch: refetchAllPosts } = useAppWrite<Video[]>(getAllPosts);
  const { data: latestPosts, isLoading: areLatestPostsLoading, refetch: refetchLatestPosts } = useAppWrite<Video[]>(getLatestPosts);

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const { user } = useGlobalContext()
  
  async function onRefresh() {
    setIsRefreshing(true);
    await refetchAllPosts()
    setIsRefreshing(false);
  }
  
  return (
    <SafeAreaView className='bg-primary h-full relative'>
      <FlatList
        data={allPosts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) =>  (<VideoCard video={item} />)}
        ListHeaderComponent={() => (
          <View className='my-6 px-4 space-y-6'>
            <View className='justify-between items-start mb-6 flex-row'>
              <View>
                <Text className='font-pmedium text-sm text-gray-100'>
                  Welcome to Aora
                </Text>
                <Text className='text-2xl font-pmedium text-white'>
                  {user?.username}
                </Text>
              </View>
              <View className='mt-1.5'>
                <Image
                  source={images.logoSmall}
                  className='w-9 h-10'
                  resizeMode='contain'
                />
              </View>
            </View>

            <SearchInput />

            <View className='w-full flex-1 pt-5'>
              <Text className='text-gray-100 text-lg font-pregular'>
                Latest Videos
              </Text>
            </View>

            <Trending posts={latestPosts} />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No videos found" subTitle="No videos created yet" />
        )}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  )
}

export default Home