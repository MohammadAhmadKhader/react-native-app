import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import { ResizeMode, Video } from 'expo-av'
import { icons } from '@/constants'
import CustomButton from '@/components/CustomButton'
import * as DocumentPicker from "expo-document-picker"
import { router } from 'expo-router'
import { CreateVideoFormType } from '../types/types'
import { createVideo } from '@/lib/appWrite'
import { useGlobalContext } from '@/context/GlobalProvider'
import AppLoader from '@/components/AppLoader'

const Create = () => {
    const {setIsAppLoading} = useGlobalContext()
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const initialFormState = {
        title: "",
        video: null,
        thumbnail: null,
        prompt: ""
    }
    const [form, setForm] = useState<CreateVideoFormType>(initialFormState);

    async function openPicker(type: string) {
        const result = await DocumentPicker.getDocumentAsync({
            type: type === "image" ? ["image/png", "image/jpg", "image/jpeg", "image/webp"]
                : ["video/mp4", "video/gif"]
        })

        if (!result.canceled) {
            if (type === "image") {
                setForm({ ...form, thumbnail: result.assets[0] })
            }

            if (type === "video") {
                setForm({ ...form, video: result.assets[0] })
            }
        } else {
            setTimeout(() => {
                Alert.alert("Document picked", JSON.stringify(result, null, 2))
            }, 100)
        }


    }

    async function submit() {
        if (!form.prompt || !form.thumbnail || !form.title || !form.video) {
            Alert.alert("Error", "Please fill all the fields")
            return;
        }
        setIsUploading(true)
        setIsAppLoading(true)

        try {
            await createVideo(form);
            Alert.alert("Success", "Uploaded Successfully!")

            router.push("/home")
        } catch (error: any) {
            Alert.alert("Error", error.message)
        } finally {
            setIsUploading(false)
            setIsAppLoading(false)
            setForm(initialFormState)
        }

    }

    return (
        <SafeAreaView className='h-full bg-primary'>
            <ScrollView className='px-4 my-6'>
                <AppLoader />
                <Text className='text-2xl text-white font-psemibold'>
                    Upload Video
                </Text>

                <FormField
                    handleChange={(e) => { setForm({ ...form, title: e }) }}
                    otherStyles='mt-10'
                    title='Video Title'
                    value={form.title}
                    placeholder='video title'
                />

                <View className='mt-7 space-y-2'>
                    <Text className='text-base text-gray-100 font-pmedium'>
                        Upload video
                    </Text>

                    <TouchableOpacity onPress={() => openPicker('video')}>
                        {
                            form.video ? (
                                <Video
                                    source={{ uri: form.video.uri }}
                                    className='w-full h-64 rounded-2xl'
                                    resizeMode={ResizeMode.COVER}
                                />
                            ) : (
                                <View className='w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center'>
                                    <View className='w-14 h-14 border border-dashed border-secondary justify-center items-center'>
                                        <Image
                                            source={icons.upload}
                                            className='w-1/2 h-1/2'
                                            resizeMode='contain'
                                        />
                                    </View>
                                </View>
                            )
                        }
                    </TouchableOpacity>
                </View>

                <View className='mt-7 space-y-2'>
                    <Text className='text-base text-gray-100 font-pmedium'>
                        Thumbnail Image
                    </Text>

                    <TouchableOpacity onPress={() => openPicker('image')}>
                        {
                            form.thumbnail ? (
                                <Image
                                    source={{ uri: form.thumbnail.uri }}
                                    className='w-full h-64 rounded-2xl'
                                    resizeMode={"cover"}
                                />
                            ) : (
                                <View className='w-full h-16 px-4 bg-black-100 rounded-2xl justify-center 
                                items-center border border-black-100'>
                                    <Image
                                        source={icons.upload}
                                        className='w-5 h-5'
                                        resizeMode='contain'
                                    />
                                    <Text className='text-sm text-gray-100 font-pmedium mt-1'>
                                        Choose a file
                                    </Text>
                                </View>
                            )
                        }
                    </TouchableOpacity>
                </View>

                <FormField
                    otherStyles='mt-5'
                    handleChange={(e) => { setForm({ ...form, prompt: e }) }}
                    title={"prompt"}
                    value={form.prompt}
                    placeholder={"prompt"}
                />

                <CustomButton
                    title="Submit & Publish"
                    isLoading={isUploading}
                    containerStyles='mt-10'
                    handlePress={submit}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default Create