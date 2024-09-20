import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import CustomButton from '@/components/CustomButton'
import { getUserPosts, signOut } from "@/lib/appWrite"
import { useGlobalContext } from '@/context/GlobalProvider'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import useAppWrite from '@/lib/useAppWrite'
import { Video } from '@/app/types/types'
import EmptyState from '@/components/EmptyState'
import SearchInput from '@/components/SearchInput'
import VideoCard from '@/components/VideoCard'
import { icons } from '@/constants'
import InfoBox from '@/components/InfoBox'

const Profile = () => {
  const { setUser, user } = useGlobalContext()
  const { data: posts } = useAppWrite<Video[]>(() => getUserPosts(user?.id ?? ""))
  async function logout() {
    await signOut()
    setUser(null)
    
    router.push("/")
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <Text>Profile</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item} />
        )}
        ListHeaderComponent={() => (
          <View className='w-full justify-center items-center mt-6 mb-12 px-4'>

            <TouchableOpacity className='items-end w-full mb-10'
              onPress={logout}>
              <Image
                source={icons.logout}
                resizeMode='contain'
                className='w-6 h-6'
              />
            </TouchableOpacity>

            <View className='w-16 h-16 border border-secondary items-center justify-center'>
              <Image
                source={{ uri: user?.avatar }}
                resizeMode='cover'
                className='w-[90%] h-[90%] rounded-lg'
              />
            </View>

            <InfoBox
              title={user?.username || ""}
              containerStyles={"mt-5"}
              titleStyles={`text-lg`}
            />

            <View className='flex-row mt-5'>
              <InfoBox
                title={posts.length.toString() || 0..toString()}
                subTitle="Posts"
                containerStyles={"mr-10"}
                titleStyles={`text-xl`}
              />
              <InfoBox
                title="1.2k"
                subTitle="Followers"
                titleStyles={`text-xl`}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No videos found" subTitle={`No videos found`} />
        )}
      />
    </SafeAreaView>
  )
}

export default Profile