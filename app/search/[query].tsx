import { View, Text, FlatList, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '@/components/SearchInput'
import EmptyState from '@/components/EmptyState'
import useAppWrite from '@/lib/useAppWrite'
import { searchPosts } from '@/lib/appWrite'
import { Video } from '@/app/types/types'
import VideoCard from '@/components/VideoCard'
import { useGlobalContext } from '@/context/GlobalProvider'

const Search = () => {
  const { query } = useLocalSearchParams()
  const { data: posts, isLoading, refetch } = useAppWrite<Video[]>(() => {
    return searchPosts(typeof query === "string" ? query : "")
  });
  const { user } = useGlobalContext()

  useEffect(() => {
    refetch()
  }, [query])

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item} />
        )}
        ListHeaderComponent={() => (
          <View className='my-6 px-4 space-y-6'>
            <View className='justify-between items-start mb-6 flex-row'>
              <View className='w-full'>
                <Text className='font-pmedium text-sm text-gray-100'>
                  Search Results:
                </Text>
                <Text className='text-2xl font-pmedium text-white'>
                  {query}
                </Text>

                <View className='mt-3'>
                  <SearchInput initialQuery={typeof query === "string" ? query : ""} />
                </View>
              </View>
            </View>

          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No videos found" subTitle={`No videos found with: ${query}`} />
        )}
      />
    </SafeAreaView>
  )
}

export default Search;